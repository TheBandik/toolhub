# Личная Tool Platform — резюме проекта

## Концепция

Модульная веб-платформа в стиле IT Tools для личных инструментов: трекеров, виджетов, интеграций. Архитектура построена вокруг расширяемости – добавление нового модуля не требует изменений в ядре.

**Ключевая идея:** ядро (shell) хостит модули. Модули самоописываемые, регистрируются автоматически. Виджеты модулей собираются в кастомизируемые дашборды. Интеграции с внешними API и локальные агенты – отдельный слой, переиспользуемый модулями.

**Пользователи:** один (для начала), архитектура с прицелом на публичный сервис. Multi-tenancy с первого дня – никаких хардкод `user_id`.

---

## Технологический стек

### Бэкенд
- **Java 21** + **Spring Boot 3**
- **Spring Modulith** – модульный монолит с проверкой границ модулей
- **Spring Security** + JWT (access + refresh tokens) + API Tokens для агентов
- **Spring Data JPA** + **Hibernate**
- **PostgreSQL** + **Flyway** (миграции)
- **Redis** (кэш интеграций и агрегатов)
- **Maven**

### Фронтенд
- **SvelteKit** + **TypeScript**
- **Tailwind CSS** + **shadcn-svelte**
- **svelte-dnd-action** (drag-n-drop для дашборда)
- **LayerChart** (графики)
- **mode-watcher** (тёмная тема)
- **Lucide Svelte** (иконки)
- **Vite** (build tool, идёт с SvelteKit)

### Инфраструктура
- **Docker Compose** (Postgres, Redis, backend, frontend, Caddy/Nginx) на Mac Mini M4 Pro
- **Локальные агенты** – на хосте macOS, НЕ в Docker (см. раздел External Agents)
- Деплой: локально на Mac Mini, в перспективе VPS

---

## Архитектурные слои

```
┌─────────────────────────────────────────────────┐
│  SHELL (sidebar, header, command palette, auth) │
├─────────────────────────────────────────────────┤
│  DASHBOARD (виджеты из модулей)                 │
├─────────────────────────────────────────────────┤
│  MODULES (workout, nutrition, subscriptions,    │
│           music)                                 │
│   ├─ pages   ├─ widgets   ├─ data exports       │
├─────────────────────────────────────────────────┤
│  INTEGRATIONS (weather, banking, fitness)       │
│  EXTERNAL AGENTS (apple-music на хосте macOS)   │
├─────────────────────────────────────────────────┤
│  CORE (users, auth, settings, module registry)  │
└─────────────────────────────────────────────────┘
```

---

## Структура бэкенда

```
toolhub-backend/
├── core/
│   ├── auth/                # Spring Security, JWT, регистрация, API tokens
│   ├── user/                # User entity, profile
│   ├── settings/            # Per-user settings
│   ├── module/              # ModuleRegistry, ModuleInfo, /api/modules
│   └── dashboard/           # Dashboard layouts, widget instances
├── modules/
│   ├── workout/
│   │   ├── api/             # REST controllers /api/modules/workout/...
│   │   ├── domain/          # Entity, repository, service
│   │   ├── widgets/         # WidgetDescriptor реализации
│   │   ├── migrations/      # Flyway: префикс workout_*
│   │   └── WorkoutModule.java
│   ├── nutrition/
│   ├── subscriptions/
│   └── music/
│       ├── api/             # CRUD + статистика
│       ├── domain/          # Track, Listen, Genre, Artist
│       ├── service/         # ImportService, MusicStatsService
│       ├── widgets/         # TopGenres, WeeklyListening
│       └── MusicModule.java
├── integrations/
│   ├── weather/             # /api/integrations/weather/...
│   ├── banking/             # OAuth, токены централизованно
│   └── apple-music/         # Приём снапшотов от агента, should-sync логика
└── shared/                  # Exception handlers, common DTOs, utils
```

### Module contract (бэк)

```java
public interface Module {
    ModuleInfo info();                  // id, name, category, version
    List<WidgetDescriptor> widgets();   // какие виджеты предоставляет
    List<DataExport> dataExports();     // что доступно другим модулям
}

@Component
@ModuleInfo(id = "workout", name = "Workout Tracker", category = "HEALTH")
public class WorkoutModule implements Module { ... }
```

`ModuleRegistry` собирает все `@ModuleInfo`-компоненты при старте, отдаёт через `GET /api/modules`.

### Multi-tenancy

- Каждая entity модулей наследует `UserOwnedEntity` (`@MappedSuperclass` с `user_id`).
- `BaseUserRepository` автоматически фильтрует по текущему пользователю (Spring Security context).

---

## Структура фронтенда

```
toolhub-frontend/
├── src/
│   ├── lib/
│   │   ├── shell/                  # Sidebar, Header, CommandPalette (Cmd+K)
│   │   ├── auth/                   # Login, register, token management
│   │   ├── api/                    # HTTP client, /api/modules клиент
│   │   ├── ui/                     # shadcn-svelte компоненты
│   │   └── widgets/                # Базовый Widget interface
│   ├── modules/
│   │   ├── workout/
│   │   │   ├── manifest.ts         # id, icon, category, routes, widgets
│   │   │   ├── pages/
│   │   │   ├── widgets/
│   │   │   ├── components/
│   │   │   └── api.ts
│   │   ├── nutrition/
│   │   ├── subscriptions/
│   │   └── music/
│   ├── integrations/
│   │   ├── weather/                # UI настройки интеграции
│   │   └── apple-music/            # UI настройки агента + установщик
│   └── routes/
│       ├── (auth)/
│       │   ├── login/
│       │   └── register/
│       ├── (app)/
│       │   ├── +layout.svelte      # Shell
│       │   ├── dashboard/          # Главный дашборд
│       │   ├── modules/[moduleId]/ # Динамическая загрузка модулей
│       │   └── settings/
│       └── +layout.svelte
```

### Module manifest (фронт)

```typescript
export const manifest: ModuleManifest = {
  id: 'workout',
  name: 'Workout Tracker',
  icon: Dumbbell,
  category: 'health',
  description: 'Трекер тренировок: теннис, бег, силовые',
  routes: [
    { path: '/', component: () => import('./pages/Overview.svelte') },
    { path: '/sessions', component: () => import('./pages/Sessions.svelte') },
  ],
  widgets: [
    { id: 'week-stats', name: 'Неделя', component: () => import('./widgets/WeekStats.svelte') },
  ],
};
```

Реестр собирает manifest-ы автоматически через `import.meta.glob`.

---

## Виджеты и Dashboard

**Widget API:**
```typescript
interface WidgetProps {
  config: Record<string, unknown>;   // пользовательские настройки
  size: 'sm' | 'md' | 'lg';
}
```

**Dashboard:** хранит массив `WidgetInstance` в БД: `{ widgetId, position, size, config }`. Пользователь выбирает виджеты из агрегированного каталога (все модули), расставляет drag-n-drop, конфигурирует.

---

## External Agents (новый тип компонента)

Для задач, требующих доступа к локальному окружению (macOS API, локальные файлы, домашняя сеть), которые невозможны из Docker-контейнера или серверного бэка.

### Принцип

- **Агент работает на хосте macOS, НЕ в Docker** (Docker = Linux VM, нет доступа к Music.app, AppleScript, локальным файлам).
- **Агент не сервер** – запускается по расписанию через **launchd**, делает работу, завершается.
- **Тупой исполнитель + умный планировщик:** вся логика расписания на бэке, агент только спрашивает "пора?" и выполняет.
- **Авторизация через API Token** (длинный, не истекает быстро как JWT), генерируется в UI, кладётся в конфиг агента.

### Разделение ответственности

| Компонент | Ответственность |
|---|---|
| **launchd** | Запускает агента каждый час (фиксированно, ставится один раз) |
| **Агент** | Спрашивает `should-sync`, при `true` читает данные, POSTит снапшот |
| **Бэк** | Хранит расписание, решает "пора или нет", принимает снапшоты |
| **UI** | Слайдер частоты, статус, кнопки Sync/Переустановить/Удалить |

### Установщик (auto-deploy flow)

UI-кнопка "Скачать установщик для macOS" → бэк генерирует персонализированный bash-скрипт с зашитым API-токеном и URL. Юзер запускает `curl ... | bash` или скачивает и выполняет. Установщик:

1. Проверяет окружение (macOS, Python 3, Music.app).
2. Создаёт `~/.toolhub/agents/apple-music/`.
3. Скачивает агент-скрипт и конфиг с токеном.
4. Регистрирует launchd-задачу (`~/Library/LaunchAgents/*.plist`), часовой интервал.
5. Делает первый sync, проверяет ответ бэка.

**Ограничение:** веб-страница НЕ может ставить ПО напрямую (security модель браузера). Максимум – скачать установщик + выполнить команду в терминале.

### Известные подводные камни агентов

- **macOS permissions:** первый запуск вызовет диалог разрешения доступа к Music.app – нужно проговорить в инструкции.
- **Python 3 на macOS 15+:** нет из коробки, ставится через `xcode-select --install`.
- **Безопасность токена:** installer-токен делать одноразовым или с коротким TTL (15 мин), rotation при первом запуске.
- **Свой бинарь (Swift CLI)** требует подписи (Gatekeeper) → нужен Apple Developer Program. Чистый Python + osascript обходит это.

---

## Модуль Music Stats

Замена Python-скрипта со статистикой музыки по жанрам.

**Домен:** `music_tracks` (title, artist, album, genre, duration, play_count, added_at, source), `music_listens`, `music_genres`, `music_sync_settings`.

**Источники данных (все пишут в одни таблицы, маркируются `source`):**
- **Apple Music через External Agent** – снапшот библиотеки (треки, жанры, play counts, рейтинги) через AppleScript/osascript на маке. Основной путь.
- **CSV-импорт** – для исторических данных и ручных правок (legacy).
- **privacy.apple.com экспорт** – опционально, раз в полгода для полной истории Play Activity (единственный источник полного timeline прослушиваний).

**Что Apple Music даёт через агента:** полная библиотека с метадатой, жанрами, play count за всё время. **Чего НЕ даёт:** timeline прослушиваний (только дельты play count между снапшотами).

**UI:** Library (список с фильтрами), Stats (графики: топ жанров, динамика по месяцам, топ артистов), Import (CSV fallback), Sync settings (слайдер частоты 1–90 дней + пресеты).

**Виджеты:** «Топ-5 жанров за месяц», «Прослушано за неделю», «Сейчас на повторе».

### Схема sync settings

```sql
CREATE TABLE music_sync_settings (
    user_id        UUID PRIMARY KEY,
    interval_days  INTEGER NOT NULL DEFAULT 30,
    last_sync_at   TIMESTAMP,
    next_sync_at   TIMESTAMP,
    manual_trigger BOOLEAN DEFAULT false,
    quiet_hours_start INTEGER,   -- nullable
    quiet_hours_end   INTEGER    -- nullable
);
```

### should-sync контракт

Агент раз в час: `GET /api/integrations/apple-music/should-sync`. Бэк отвечает `{ shouldSync, reason }`:
- `manual_trigger = true` → sync, сбросить флаг (reason: manual)
- `now > next_sync_at` → sync (reason: scheduled)
- в quiet hours → всегда false
- `last_sync_at > now - 1h` → false (минимальный gap, защита от спама)
- иначе → false (reason: skip)

После успешного `POST /snapshot`: обновить `last_sync_at`, пересчитать `next_sync_at = now + interval_days`.

### Endpoints интеграции

```
POST /api/integrations/apple-music/setup           → генерирует API token + installer URL
GET  /api/integrations/apple-music/installer/{token} → bash-скрипт с зашитым токеном
GET  /api/integrations/apple-music/agent-script    → sync.py (статичный агент)
GET  /api/integrations/apple-music/should-sync     → { shouldSync, reason }
POST /api/integrations/apple-music/snapshot        → приём данных (Auth: Bearer token)
GET  /api/integrations/apple-music/status          → статус для UI
PATCH /api/integrations/apple-music/settings       → interval_days, quiet_hours
POST /api/integrations/apple-music/trigger-now     → ставит manual_trigger
```

---

## Стартовый набор модулей

1. **workout** – трекер тренировок (теннис, бег, силовые)
2. **nutrition** – трекер КБЖУ, клетчатка, вода
3. **subscriptions** – трекер платных подписок
4. **music** – статистика музыки по жанрам (с Apple Music агентом)

**Интеграции в перспективе:** погода (Open-Meteo), финансы, фитнес.

---

## Порядок реализации

**НЕ строить всю архитектуру сразу.** Дорастать постепенно, на каждом шаге иметь работающее приложение:

1. **Shell + Auth + первый модуль (workout)** без виджетов и дашборда. Просто страница тренировок внутри shell-а. Цель – почувствовать стек, поднять инфру.
2. **ModuleRegistry** на бэке и фронте. Превратить workout в зарегистрированный модуль. Добавить второй модуль (nutrition) – проверка архитектуры.
3. **Dashboard + Widget API.** Простой дашборд, 2-3 виджета.
4. **Третий модуль (subscriptions).**
5. **Модуль music + CSV-импорт.** Сначала перенести Python-логику статистики, импорт через CSV.
6. **Apple Music агент.** Сначала Python-скрипт вручную (проверить цепочку Music.app → JSON → POST → БД → UI). Потом обернуть в installer-flow со слайдером частоты.
7. **Первая внешняя интеграция (погода).** Отработать паттерн API-интеграций.

---

## Ключевые архитектурные принципы

- **Физическая изоляция модулей.** Никаких импортов между модулями. Только через явные `DataExport` API.
- **Префиксы таблиц БД** по модулю (`workout_*`, `music_*`).
- **Миграции по модулям** в отдельных папках, Flyway собирает из `classpath*:db/migration/{module}/*.sql`.
- **Multi-tenancy с первого дня.**
- **Module contract строгий** – манифест module и есть его публичный API.
- **Spring Modulith** проверяет границы в тестах.
- **External Agents:** тупой исполнитель + умный планировщик, вся логика на бэке.

---

## Что НЕ делать

- Не делать настоящие runtime-плагины (OSGi, classloader-магию). Модули компилируются вместе.
- Не делать микросервисы – модульный монолит.
- Не делать «сначала всю архитектуру, потом первый модуль» – дорастать постепенно.
- Не делать локальное приложение без auth – multi-tenancy с самого начала.
- Не запускать локальные агенты в Docker – только на хосте macOS.
- Не делать скрапинг privacy.apple.com – хрупко, нарушает ToS, риск блокировки Apple ID.
- Не давать агенту самому перенастраивать launchd – расписание решает бэк через should-sync.
- Не строить красивый installer для несуществующего агента – сначала ручная установка, потом обёртка.
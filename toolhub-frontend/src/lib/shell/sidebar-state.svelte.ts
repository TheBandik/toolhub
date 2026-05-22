class SidebarState {
	open = $state(false);

	toggle() {
		this.open = !this.open;
	}

	close() {
		this.open = false;
	}
}

export const sidebarState = new SidebarState();

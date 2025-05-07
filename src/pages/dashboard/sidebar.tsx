export default function Sidebar() {
	return (
		<aside className="bg-sidebar border-r border-sidebar-border p-4">
			<h1 className="text-xl font-semibold mb-6">Support Dashboard</h1>
			<nav className="space-y-2 text-sm">
				<button className="block w-full text-left px-3 py-2 rounded-lg bg-[--sidebar-accent] text-[--sidebar-accent-foreground]">
					Posts
				</button>
			</nav>
		</aside>
	);
}

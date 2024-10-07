import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
	component: HomeComponent,
});

function HomeComponent() {
	return (
		<div className="p-2 bg-green-400 h-64">
			<h3>Welcome Home!</h3>
		</div>
	);
}

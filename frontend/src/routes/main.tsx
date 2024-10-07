import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/main")({
	component: () => main,
});

const main = () => <div>Hello /main!</div>;

export default main;

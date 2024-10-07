import { Link, Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import Cookies from "js-cookie";
import useFetch from "@/hooks/useFetch";

export const Route = createRootRoute({
	component: RootComponent,
});

function RootComponent() {
	const { data, isError, isPending } = useFetch("8");
	const { setCourses, setIsPending, setIsError } = useCourseStore();

	useEffect(() => {
		setCourses(data || []);
		setIsPending(isPending);
		setIsError(isError);
	}, [isPending, data, isError]);

	return (
		<>
			<SidebarLayout defaultOpen={Cookies.get("sidebar:state") === "true"}>
				<AppSidebar />
				<main className="flex w-full p-2 transition-all duration-300 ease-in-out">
					<div className="flex-1 h-full w-full rounded-md p-2">
						<SidebarTrigger />
						<Outlet />
					</div>
				</main>
			</SidebarLayout>
			{/* @ts-ignore */}
			{import.meta.env.DEV && (
				<TanStackRouterDevtools position="bottom-right" />
			)}
		</>
	);
}

interface NavLinkProps {
	label: string;
	route: string;
	date?: number;
	className?: string;
}

const NavLink = ({ label, date, className, route }: NavLinkProps) => {
	const formatDate = date
		? new Date(date * 1000).toLocaleDateString("de-DE")
		: new Date().toLocaleDateString("de-DE");
	return (
		<Link
			to={route}
			className=" text-sm hover:border-l-4 p-1 border-primary hover:bg-primary/10 transition-all duration-300"
			activeProps={{
				className: `font-medium bg-primary/10 border-l-4  border-primary transition-all duration-300 ease-in-out  ${className}`,
			}}
		>
			<span className="font-medium">{label}</span>
			<span className="block text-sm">{formatDate}</span>
		</Link>
	);
};

import {
	Sidebar,
	SidebarContent,
	SidebarHeader,
	SidebarItem,
	SidebarLayout,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import { Loader2 } from "lucide-react";
import useCourseStore from "@/hooks/useCourseStore";
import { useEffect } from "react";

export function AppSidebar() {
	const { courses, isPending } = useCourseStore();
	return (
		<Sidebar className="oveflow-hidden break-before-auto">
			<SidebarHeader>Course Info</SidebarHeader>
			<SidebarContent>
				<SidebarItem>
					<div className="flex flex-col gap-2 text-lg">
						{isPending ? (
							<Loader2 className="animate-spin" />
						) : (
							courses?.map((topic) => (
								<NavLink
									key={topic.record_id}
									label={topic.lernfeld}
									route={`/course/${topic.record_id}-${topic.datum}`}
									date={parseInt(topic.datum)}
								/>
							))
						)}
					</div>
				</SidebarItem>
			</SidebarContent>
		</Sidebar>
	);
}

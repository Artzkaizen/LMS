import { createFileRoute } from "@tanstack/react-router";
import { AppSidebar } from "./__root";
import Cookies from "js-cookie";
import { SidebarLayout, SidebarTrigger } from "@/components/ui/sidebar";

export const Route = createFileRoute("/menu")({
  component: () => <Cut />,
});

const Cut = () => {
  console.log(Cookies.get("sidebar:state"));
  return (
    <>
      <SidebarLayout defaultOpen={Cookies.get("sidebar:state") === "true"}>
        <AppSidebar />
        <main className="flex flex-1 flex-col p-2 transition-all duration-300 ease-in-out">
          <div className="h-full rounded-md border-2 border-dashed p-2">
            <SidebarTrigger />
          </div>
        </main>
      </SidebarLayout>
    </>
  );
};

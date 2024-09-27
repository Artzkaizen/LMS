import { Link, Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import Cookies from "js-cookie";
export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <>
      <SidebarLayout defaultOpen={Cookies.get("sidebar:state") === "true"}>
        <AppSidebar />
        {/* add here   */}
        <main className="flex p-2 transition-all duration-300 ease-in-out">
          <div className="flex-1 h-full rounded-md p-2">
            <SidebarTrigger />
            <Outlet />
          </div>
        </main>
      </SidebarLayout>
      <TanStackRouterDevtools position="bottom-right" />
    </>
  );
}

const data = [
  {
    record_id: "13",
    datum: "1723420800",
    lernfeld: "Übertragungsmedien##Bereitstellen von Netzwerken",
    tagesinhalte:
      '<p dir="ltr" style="text-align:left;">Hier kommt eine Liste mit Themen, die heute gelaufen sind.</p><ul dir="ltr"><li style="text-align:left;">Thema 1</li><li style="text-align:left;">Thema 2</li><li style="text-align:left;">Themenüberleitung<br /></li></ul>',
    tafelbild: "/2233/mod_data/content/69/Montag.pdf",
    präsentation: null,
  },
  {
    record_id: "14",
    datum: "1723593600",
    lernfeld: "Bereitstellen von Netzwerken",
    tagesinhalte:
      '<p dir="ltr" style="text-align:left;">Hier steht, was in dieser Session besprochen wurde.</p><ul dir="ltr"><li style="text-align:left;">Thema</li><li style="text-align:left;">Thema</li><li style="text-align:left;">Übersicht<br /></li></ul>',
    tafelbild: "/2233/mod_data/content/75/TS4_Series_-_User_Guide_-_v1.7.pdf",
    präsentation: "/2233/mod_data/content/78/TS12Sub_-_User_Guide_-_v1.5.pdf",
  },
  {
    record_id: "18",
    datum: "1727136000",
    lernfeld: "Übertragungsmedien",
    tagesinhalte:
      '<p dir="ltr" style="text-align:left;">Inhalt eine ....<br /></p>',
    tafelbild: "/2233/mod_data/content/91/SQQ10-080801.pdf",
    präsentation: null,
  },
  {
    record_id: "19",
    datum: "1727136000",
    lernfeld: "Bereitstellen von Netzwerken",
    tagesinhalte: '<p dir="ltr" style="text-align:left;">Blablbl <br /></p>',
    tafelbild: "/2233/mod_data/content/96/SQQ10 – Gruppe 080802.pdf",
    präsentation: "/2233/mod_data/content/98/SQQ10 – Gruppe 080802 Präsi.pdf",
  },
];

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

export function AppSidebar() {
  return (
    <Sidebar className="oveflow-hidden break-before-auto">
      <SidebarHeader>Course Info</SidebarHeader>
      <SidebarContent>
        <SidebarItem>
          <div className="flex flex-col gap-2 text-lg">
            {data.map((topic) => (
              <NavLink
                key={topic.record_id}
                label={topic.lernfeld}
                route={`/course/${topic.record_id}-${topic.datum}`}
                date={parseInt(topic.datum)}
              />
            ))}
          </div>
        </SidebarItem>
      </SidebarContent>
    </Sidebar>
  );
}

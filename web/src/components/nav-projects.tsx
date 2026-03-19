import { NavLink, useLocation } from "react-router-dom";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { MoreHorizontalIcon } from "lucide-react";

export function NavProjects({
  projects,
}: {
  projects: {
    id: string;
    name: string;
    url: string;
    icon: React.ReactNode;
    description: string;
    isActive: boolean;
    onSelect: () => void;
  }[];
}) {
  const location = useLocation();

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Активные бенды</SidebarGroupLabel>
      <SidebarMenu>
        {projects.map((item) => (
          <SidebarMenuItem key={item.id}>
            <SidebarMenuButton
              render={<NavLink to={item.url} />}
              isActive={item.isActive}
              onClick={item.onSelect}
            >
              {item.icon}
              <div className="grid min-w-0 flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{item.name}</span>
                <span className="truncate text-xs text-muted-foreground">
                  {item.description}
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
        <SidebarMenuItem>
          <SidebarMenuButton
            render={<NavLink to="/bands" />}
            className="text-sidebar-foreground/70"
            isActive={location.pathname === "/bands"}
          >
            <MoreHorizontalIcon className="text-sidebar-foreground/70" />
            <span>Все бенды</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
}


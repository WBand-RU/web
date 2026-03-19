import * as React from "react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { useAuth } from "@/components/providers/auth-provider";
import { useBands } from "@/components/providers/bands-provider";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { formatRole, getBandInitials } from "@/lib/bands";
import {
  BookOpenIcon,
  CalendarDaysIcon,
  Disc3Icon,
  FrameIcon,
  InboxIcon,
  LayoutDashboardIcon,
  SendIcon,
  UsersIcon,
} from "lucide-react";

const navigation = [
  {
    title: "Обзор",
    url: "/app",
    icon: <LayoutDashboardIcon />,
  },
  {
    title: "Репертуар",
    url: "/songs",
    icon: <BookOpenIcon />,
    items: [
      {
        title: "Песни",
        url: "/songs",
      },
      {
        title: "Сетлисты",
        url: "/setlists",
      },
    ],
  },
  {
    title: "Бенды",
    url: "/bands",
    icon: <UsersIcon />,
    items: [
      {
        title: "Составы",
        url: "/bands",
      },
      {
        title: "Участники",
        url: "/members",
      },
      {
        title: "Приглашения",
        url: "/invitations",
      },
    ],
  },
  {
    title: "Мои приглашения",
    url: "/my-invitations",
    icon: <InboxIcon />,
  },
  {
    title: "Календарь",
    url: "/calendar",
    icon: <CalendarDaysIcon />,
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const auth = useAuth();
  const { bands, selectedBandId, selectBand } = useBands();

  const teamOptions = React.useMemo(
    () =>
      bands.map((band) => ({
        id: band.id,
        name: band.name,
        logo: (
          <span className="text-xs font-semibold">
            {getBandInitials(band.name)}
          </span>
        ),
        plan: formatRole(band.role),
      })),
    [bands],
  );

  const projectLinks = React.useMemo(
    () =>
      bands.map((band, index) => ({
        id: band.id,
        name: band.name,
        url: "/bands",
        icon: index % 2 === 0 ? <Disc3Icon /> : <FrameIcon />,
        description: formatRole(band.role),
        isActive: band.id === selectedBandId,
        onSelect: () => selectBand(band.id),
      })),
    [bands, selectBand, selectedBandId],
  );

  return (
    <Sidebar variant="inset" collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher
          teams={teamOptions}
          activeTeamId={selectedBandId}
          onSelectTeam={selectBand}
        />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navigation} />
        <NavProjects projects={projectLinks} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            name: auth.profile?.name ?? "Музыкант",
            email: auth.profile?.email ?? "account@wband.local",
            initials: auth.profile?.initials ?? "WB",
          }}
          onLogout={auth.logout}
          secondaryActionIcon={<SendIcon />}
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}


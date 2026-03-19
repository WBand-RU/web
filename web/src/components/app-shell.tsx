import { Link, Outlet, useLocation } from "react-router-dom";

import { AppSidebar } from "@/components/app-sidebar";
import { useAuth } from "@/components/providers/auth-provider";
import { useBands } from "@/components/providers/bands-provider";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { formatRole } from "@/lib/bands";
import { getRouteMeta } from "@/lib/mock-data";

export function AppShell() {
  const location = useLocation();
  const auth = useAuth();
  const { selectedBandDetails } = useBands();
  const meta = getRouteMeta(location.pathname);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="min-h-screen">
        <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center gap-2 border-b border-border/60 bg-background/90 backdrop-blur">
          <div className="flex w-full items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink render={<Link to="/app" />}>
                    WBand
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem className="hidden sm:block">
                  <BreadcrumbPage>{meta.section}</BreadcrumbPage>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden sm:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>{meta.title}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            {auth.profile ? (
              <div className="ml-auto hidden items-center gap-2 md:flex">
                {selectedBandDetails ? (
                  <>
                    <Badge variant="secondary">
                      {selectedBandDetails.name}
                    </Badge>
                    <Badge variant="outline">
                      {formatRole(selectedBandDetails.role)}
                    </Badge>
                  </>
                ) : null}
                <Badge variant="outline">{auth.profile.name}</Badge>
              </div>
            ) : null}
          </div>
        </header>
        <div className="flex flex-1 flex-col px-4 pb-6 md:px-6">
          <div className="pt-4 text-sm text-muted-foreground md:pt-6">
            {meta.description}
          </div>
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}


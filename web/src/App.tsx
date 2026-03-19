import { BrowserRouter, Route, Routes } from "react-router-dom";

import { ProtectedRoute } from "@/components/auth/protected-route";
import { AppShell } from "@/components/app-shell";
import { AuthProvider } from "@/components/providers/auth-provider";
import { BandsProvider } from "@/components/providers/bands-provider";
import {
  BandsPage,
  CalendarPage,
  DashboardPage,
  InvitationsPage,
  MembersPage,
  MyInvitationsPage,
  NotFoundPage,
  SetlistsPage,
  SongDetailsPage,
  SongsPage,
} from "@/pages/app-pages";
import { LandingPage } from "@/pages/landing-page";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <BandsProvider>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route element={<ProtectedRoute />}>
              <Route element={<AppShell />}>
                <Route path="/app" element={<DashboardPage />} />
                <Route path="/bands" element={<BandsPage />} />
                <Route path="/members" element={<MembersPage />} />
                <Route path="/invitations" element={<InvitationsPage />} />
                <Route path="/my-invitations" element={<MyInvitationsPage />} />
                <Route path="/songs" element={<SongsPage />} />
                <Route path="/songs/:songId" element={<SongDetailsPage />} />
                <Route path="/setlists" element={<SetlistsPage />} />
                <Route path="/calendar" element={<CalendarPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Route>
            </Route>
          </Routes>
        </BandsProvider>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;


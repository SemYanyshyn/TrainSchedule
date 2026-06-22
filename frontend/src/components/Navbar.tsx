import type { AuthUser } from "@/types";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type NavbarProps = {
  user: AuthUser | null;
  onLogout: () => void;
};

function Navbar({ onLogout, user }: NavbarProps) {
  return (
    <Card className="border-slate-700/80 bg-slate-950/70 p-5 shadow-2xl shadow-black/20 backdrop-blur">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-medium text-sky-300">Train Schedule</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-white">
            Train Schedule Application
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-400">
            View public schedules as a guest, or sign in to manage train
            records.
          </p>
        </div>

        <div className="flex flex-col items-start gap-3 md:items-end">
          {user ? (
            <>
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="border-emerald-500/30 bg-emerald-500/15 text-emerald-100 hover:bg-emerald-500/15">
                  Authenticated
                </Badge>
                <Badge variant="secondary">{user.role}</Badge>
              </div>
              <p className="text-sm text-slate-300">
                Signed in as{" "}
                <span className="font-medium text-white">{user.email}</span>
              </p>
              <Button onClick={onLogout} variant="destructive">
                Logout
              </Button>
            </>
          ) : (
            <>
              <Badge variant="secondary">Guest mode</Badge>
              <p className="text-sm text-slate-400">
                You can view schedules without signing in.
              </p>
            </>
          )}
        </div>
      </div>
    </Card>
  );
}

export default Navbar;

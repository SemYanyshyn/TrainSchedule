import { FormEvent } from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type AuthMode = "login" | "register";

type AuthFormProps = {
  authError: string | null;
  authMode: AuthMode;
  email: string;
  isSubmitting: boolean;
  onEmailChange: (value: string) => void;
  onModeChange: (mode: AuthMode) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  password: string;
};

function AuthForm({
  authError,
  authMode,
  email,
  isSubmitting,
  onEmailChange,
  onModeChange,
  onPasswordChange,
  onSubmit,
  password,
}: AuthFormProps) {
  return (
    <Card className="border-slate-700 bg-slate-900/80 shadow-xl shadow-black/20">
      <CardHeader>
        <CardTitle>Account access</CardTitle>
        <CardDescription>
          Log in or create an account to manage train records.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-5 flex gap-2">
          <Button
            onClick={() => onModeChange("login")}
            type="button"
            variant={authMode === "login" ? "default" : "outline"}
          >
            Login
          </Button>
          <Button
            onClick={() => onModeChange("register")}
            type="button"
            variant={authMode === "register" ? "default" : "outline"}
          >
            Register
          </Button>
        </div>

        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="grid gap-4 md:grid-cols-[1fr_1fr_auto] md:items-end">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                autoComplete="email"
                id="email"
                onChange={(event) => onEmailChange(event.target.value)}
                required
                type="email"
                value={email}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                autoComplete={
                  authMode === "login" ? "current-password" : "new-password"
                }
                id="password"
                minLength={1}
                onChange={(event) => onPasswordChange(event.target.value)}
                required
                type="password"
                value={password}
              />
            </div>

            <Button disabled={isSubmitting} type="submit">
              {isSubmitting
                ? "Please wait..."
                : authMode === "login"
                  ? "Login"
                  : "Register"}
            </Button>
          </div>

          {authError && (
            <Alert variant="destructive">
              <AlertDescription>{authError}</AlertDescription>
            </Alert>
          )}
        </form>
      </CardContent>
    </Card>
  );
}

export default AuthForm;

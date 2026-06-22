import { FormEvent, useCallback, useEffect, useState } from "react";

import {
  createTrain,
  deleteTrain,
  fetchTrains,
  loginUser,
  registerUser,
  updateTrain,
} from "@/api";
import AuthForm from "@/components/AuthForm";
import Navbar from "@/components/Navbar";
import TrainForm from "@/components/TrainForm";
import TrainTable from "@/components/TrainTable";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { AuthUser, Train, TrainPayload } from "@/types";

const TOKEN_STORAGE_KEY = "train_schedule_token";
const USER_STORAGE_KEY = "train_schedule_user";

const getStoredToken = (): string | null => {
  return localStorage.getItem(TOKEN_STORAGE_KEY);
};

const getStoredUser = (): AuthUser | null => {
  const storedToken = getStoredToken();
  const storedUser = localStorage.getItem(USER_STORAGE_KEY);

  if (!storedToken || !storedUser) {
    localStorage.removeItem(USER_STORAGE_KEY);
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    return null;
  }

  try {
    return JSON.parse(storedUser) as AuthUser;
  } catch {
    localStorage.removeItem(USER_STORAGE_KEY);
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    return null;
  }
};

function App() {
  const [trains, setTrains] = useState<Train[]>([]);
  const [isLoadingTrains, setIsLoadingTrains] = useState(true);
  const [trainsError, setTrainsError] = useState<string | null>(null);

  const [token, setToken] = useState<string | null>(() => getStoredToken());
  const [user, setUser] = useState<AuthUser | null>(() => getStoredUser());
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSubmittingAuth, setIsSubmittingAuth] = useState(false);

  const [editingTrain, setEditingTrain] = useState<Train | null>(null);
  const [isSavingTrain, setIsSavingTrain] = useState(false);
  const [trainActionError, setTrainActionError] = useState<string | null>(null);
  const [trainActionSuccess, setTrainActionSuccess] = useState<string | null>(
    null,
  );

  const loadTrains = useCallback(async () => {
    try {
      setIsLoadingTrains(true);
      setTrainsError(null);
      const data = await fetchTrains();
      setTrains(data);
    } catch (error) {
      setTrainsError(
        error instanceof Error ? error.message : "Failed to load trains",
      );
    } finally {
      setIsLoadingTrains(false);
    }
  }, []);

  useEffect(() => {
    void loadTrains();
  }, [loadTrains]);

  const handleAuthSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAuthError(null);
    setIsSubmittingAuth(true);

    try {
      const authResponse =
        authMode === "login"
          ? await loginUser(email, password)
          : await registerUser(email, password);

      localStorage.setItem(TOKEN_STORAGE_KEY, authResponse.token);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(authResponse.user));
      setToken(authResponse.token);
      setUser(authResponse.user);
      setEmail("");
      setPassword("");
      setTrainActionError(null);
      setTrainActionSuccess("You are authenticated and can manage trains.");
    } catch (error) {
      setAuthError(
        error instanceof Error ? error.message : "Authentication failed",
      );
    } finally {
      setIsSubmittingAuth(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
    setToken(null);
    setUser(null);
    setEditingTrain(null);
    setTrainActionError(null);
    setTrainActionSuccess(null);
  };

  const handleTrainSubmit = async (data: TrainPayload) => {
    if (!token) {
      setTrainActionError("You must be logged in to manage train records.");
      return;
    }

    try {
      setIsSavingTrain(true);
      setTrainActionError(null);
      setTrainActionSuccess(null);

      if (editingTrain) {
        await updateTrain(token, editingTrain.id, data);
        setEditingTrain(null);
        setTrainActionSuccess("Train updated successfully.");
      } else {
        await createTrain(token, data);
        setTrainActionSuccess("Train created successfully.");
      }

      await loadTrains();
    } catch (error) {
      setTrainActionError(
        error instanceof Error ? error.message : "Train operation failed",
      );
    } finally {
      setIsSavingTrain(false);
    }
  };

  const handleDeleteTrain = async (train: Train) => {
    if (!token) {
      setTrainActionError("You must be logged in to manage train records.");
      return;
    }

    const confirmed = window.confirm(
      `Delete train ${train.trainNumber}? This action cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setTrainActionError(null);
      setTrainActionSuccess(null);
      await deleteTrain(token, train.id);

      if (editingTrain?.id === train.id) {
        setEditingTrain(null);
      }

      setTrainActionSuccess("Train deleted successfully.");
      await loadTrains();
    } catch (error) {
      setTrainActionError(
        error instanceof Error ? error.message : "Failed to delete train",
      );
    }
  };

  const canManageTrains = Boolean(user && token);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <Navbar onLogout={handleLogout} user={user} />

      {!user && (
        <AuthForm
          authError={authError}
          authMode={authMode}
          email={email}
          isSubmitting={isSubmittingAuth}
          onEmailChange={setEmail}
          onModeChange={(mode) => {
            setAuthMode(mode);
            setAuthError(null);
          }}
          onPasswordChange={setPassword}
          onSubmit={handleAuthSubmit}
          password={password}
        />
      )}

      {canManageTrains ? (
        <TrainForm
          editingTrain={editingTrain}
          isSubmitting={isSavingTrain}
          onCancelEdit={() => setEditingTrain(null)}
          onSubmit={handleTrainSubmit}
        />
      ) : (
        <Alert variant="info">
          <AlertDescription>
            You are viewing as a guest. Log in to manage train records.
          </AlertDescription>
        </Alert>
      )}

      {trainActionSuccess && (
        <Alert variant="success">
          <AlertDescription>{trainActionSuccess}</AlertDescription>
        </Alert>
      )}

      {trainActionError && (
        <Alert variant="destructive">
          <AlertDescription>{trainActionError}</AlertDescription>
        </Alert>
      )}

      <Card className="border-slate-700 bg-slate-900/80 shadow-xl shadow-black/20">
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Train Schedule</CardTitle>
            <CardDescription>
              Public train list ordered by departure time.
            </CardDescription>
          </div>
          <Button
            disabled={isLoadingTrains}
            onClick={() => void loadTrains()}
            type="button"
            variant="outline"
          >
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          {isLoadingTrains && (
            <Alert variant="info">
              <AlertDescription>Loading trains...</AlertDescription>
            </Alert>
          )}

          {trainsError && (
            <Alert variant="destructive">
              <AlertDescription>{trainsError}</AlertDescription>
            </Alert>
          )}

          {!isLoadingTrains && !trainsError && trains.length === 0 && (
            <Alert>
              <AlertDescription>No trains found.</AlertDescription>
            </Alert>
          )}

          {!isLoadingTrains && !trainsError && trains.length > 0 && (
            <TrainTable
              canManage={canManageTrains}
              onDelete={handleDeleteTrain}
              onEdit={(train) => {
                setEditingTrain(train);
                setTrainActionError(null);
                setTrainActionSuccess(null);
              }}
              trains={trains}
            />
          )}
        </CardContent>
      </Card>
    </main>
  );
}

export default App;

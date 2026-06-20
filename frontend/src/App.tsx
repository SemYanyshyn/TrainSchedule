import { FormEvent, useCallback, useEffect, useState } from "react";

import {
  createTrain,
  deleteTrain,
  fetchTrains,
  loginUser,
  registerUser,
  updateTrain,
} from "./api";
import TrainForm from "./components/TrainForm";
import TrainTable from "./components/TrainTable";
import type { AuthUser, Train, TrainPayload } from "./types";

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
    <main className="container app-shell py-4">
      <div className="app-card d-flex flex-column flex-md-row justify-content-between gap-3 mb-4 rounded-3 border p-4 shadow">
        <div>
          <h1 className="mb-1 text-light">Train Schedule Application</h1>
          <p className="text-muted mb-0">
            View train schedules and manage records after login.
          </p>
        </div>

        <div className="text-md-end">
          {user ? (
            <div>
              <div className="alert alert-success border-success py-2 mb-2" role="status">
                Authenticated as <strong>{user.email}</strong> ({user.role})
              </div>
              <button className="btn btn-outline-danger" onClick={handleLogout}>
                Logout
              </button>
            </div>
          ) : (
            <div className="alert alert-dark-surface py-2 mb-0" role="status">
              You are viewing as a guest.
            </div>
          )}
        </div>
      </div>

      {!user && (
        <section className="mb-4">
          <div className="card app-card border-secondary shadow">
            <div className="card-body">
              <div className="d-flex gap-2 mb-3">
                <button
                  className={`btn ${
                    authMode === "login" ? "btn-primary" : "btn-outline-primary"
                  }`}
                  onClick={() => {
                    setAuthMode("login");
                    setAuthError(null);
                  }}
                  type="button"
                >
                  Login
                </button>
                <button
                  className={`btn ${
                    authMode === "register"
                      ? "btn-primary"
                      : "btn-outline-primary"
                  }`}
                  onClick={() => {
                    setAuthMode("register");
                    setAuthError(null);
                  }}
                  type="button"
                >
                  Register
                </button>
              </div>

              <form onSubmit={handleAuthSubmit}>
                <div className="row g-3 align-items-end">
                  <div className="col-12 col-md-5">
                    <label className="form-label text-light" htmlFor="email">
                      Email
                    </label>
                    <input
                      className="form-control"
                      id="email"
                      onChange={(event) => setEmail(event.target.value)}
                      required
                      type="email"
                      value={email}
                    />
                  </div>
                  <div className="col-12 col-md-5">
                    <label className="form-label text-light" htmlFor="password">
                      Password
                    </label>
                    <input
                      className="form-control"
                      id="password"
                      minLength={1}
                      onChange={(event) => setPassword(event.target.value)}
                      required
                      type="password"
                      value={password}
                    />
                  </div>
                  <div className="col-12 col-md-2 d-grid">
                    <button
                      className="btn btn-success"
                      disabled={isSubmittingAuth}
                      type="submit"
                    >
                      {isSubmittingAuth
                        ? "Please wait..."
                        : authMode === "login"
                          ? "Login"
                          : "Register"}
                    </button>
                  </div>
                </div>

                {authError && (
                  <div className="alert alert-danger border-danger mt-3 mb-0" role="alert">
                    {authError}
                  </div>
                )}
              </form>
            </div>
          </div>
        </section>
      )}

      {canManageTrains ? (
        <TrainForm
          editingTrain={editingTrain}
          isSubmitting={isSavingTrain}
          onCancelEdit={() => setEditingTrain(null)}
          onSubmit={handleTrainSubmit}
        />
      ) : (
        <div className="alert alert-dark-surface border-info" role="status">
          You are viewing as a guest. Log in to manage train records.
        </div>
      )}

      {trainActionSuccess && (
        <div className="alert alert-success border-success" role="status">
          {trainActionSuccess}
        </div>
      )}

      {trainActionError && (
        <div className="alert alert-danger border-danger" role="alert">
          {trainActionError}
        </div>
      )}

      <section className="card app-card border-secondary shadow">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2 className="h4 mb-0 text-light">Train Schedule</h2>
            <button
              className="btn btn-outline-light btn-sm"
              disabled={isLoadingTrains}
              onClick={() => void loadTrains()}
              type="button"
            >
              Refresh
            </button>
          </div>

          {isLoadingTrains && (
            <div className="alert alert-dark-surface border-info" role="status">
              Loading trains...
            </div>
          )}

          {trainsError && (
            <div className="alert alert-danger border-danger" role="alert">
              {trainsError}
            </div>
          )}

          {!isLoadingTrains && !trainsError && trains.length === 0 && (
            <div className="alert alert-dark-surface mb-0" role="status">
              No trains found.
            </div>
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
        </div>
      </section>
    </main>
  );
}

export default App;

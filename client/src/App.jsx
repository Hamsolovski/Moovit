/* eslint-disable import/no-unresolved */
import { useContext, useEffect, useState } from "react";
import { Outlet, useLoaderData } from "react-router-dom";
import { toast, Toaster } from "sonner";
import DarkModeContext from "./services/DarkModeContext";
import "./App.css";
import { useUser } from "./contexts/User/User";
import Background from "./components/Background/Background";

function App() {
  // Contexte DarkMode
  const { mode } = useContext(DarkModeContext);
  const { setUser } = useUser();
  const sports = useLoaderData();
  const [isLoading, setIsLoading] = useState(true);

  const api = import.meta.env.VITE_API_URL;

  const handleRefresh = async () => {
    try {
      const response = await fetch(`${api}/api/users/refresh/page`, {
        credentials: "include",
      });
      if (response.ok) {
        const auth = await response.json();
        const token = response.headers.get("Authorization");
        auth.token = token;
        setUser(auth);
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      toast.error("Token not valid");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleRefresh();
  }, []);

  return (
    <main className={`container ${mode}`}>
      <Background />
      <Outlet context={{ sports, isLoading }} />
      <Toaster />
    </main>
  );
}

export default App;

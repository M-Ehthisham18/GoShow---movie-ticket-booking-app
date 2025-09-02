import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { AppContext } from "./AppContext";

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

export const AppProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(null);
  const [shows, setShows] = useState([]);
  const [favoriteMovies, setFavoriteMovies] = useState([]);

  const { user, isLoaded } = useUser(); // 👈 grab isLoaded
  const { getToken } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const fetchIsAdmin = async () => {
    try {
      const token = await getToken();
      if (!token) return; // ⛔️ no token yet

      const { data } = await axios.get("/api/admin/isAdmin", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setIsAdmin(data?.isAdmin);

      if (data?.isAdmin === false && location?.pathname.includes("/admin")) {
        navigate("/");
        toast.error("You are not authorized to access admin panel");
      }
    } catch (error) {
      console.error("Error in fetchIsAdmin", error);

      if (error.response?.status === 403 && location.pathname.includes("/admin")) {
        navigate("/");
        toast.error("You are not authorized to access admin panel");
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  const fetchShows = async () => {
    try {
      const { data } = await axios.get("/api/show/all");
      if (data?.success) {
        setShows(data.shows);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error in fetchShows", error);
      toast.error("Something went wrong");
    }
  };

  const fetchFavoriteMovies = async () => {
    try {
      const token = await getToken();
      if (!token) return;

      const { data } = await axios.get("/api/user/favorites", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (data?.success) {
        setFavoriteMovies(data.movies);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error in fetchFavoriteMovies", error);
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    fetchShows();
  }, []);

  useEffect(() => {
    if (isLoaded && user) { // ✅ only run once Clerk is ready
      fetchIsAdmin();
      fetchFavoriteMovies();
    }
  }, [isLoaded, user]);

  const value = {
    axios,
    isAdmin,
    shows,
    favoriteMovies,
    fetchFavoriteMovies,
    fetchIsAdmin,
    user,
    getToken,
    navigate,
    location,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

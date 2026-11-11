import {
  createContext,
  useEffect,
  useContext,
  useReducer,
  useCallback,
} from "react";

import type { CityType } from "../types";
import { apiFetch } from "../utils/apiFetch";
import { useAuth } from "./AuthContext";

const CitiesContext = createContext<CitiesContextType | undefined>(undefined);

type ActionType =
  | { type: "loadingTrue" }
  | { type: "cities/loaded"; payload: CityType[] }
  | { type: "cities/cleared" }
  | { type: "city/loaded"; payload: CityType }
  | { type: "city/added"; payload: CityType }
  | { type: "city/deleted"; payload: CityType["id"] }
  | { type: "rejected"; payload: string };

type StateType = {
  cities: CityType[];
  isLoading: boolean;
  currentCity: Partial<CityType>;
  error: string;
};

type CitiesProviderProps = {
  children: React.ReactNode;
};

type CitiesContextType = {
  cities: CityType[];
  isLoading: boolean;
  currentCity: Partial<CityType>;
  getCity: (id: string) => Promise<void>;
  addCity: (city: CityType) => Promise<void>;
  deleteCity: (id: string) => Promise<void>;
};

const initialState: StateType = {
  cities: [],
  isLoading: false,
  currentCity: {},
  error: "",
};

function reducer(state: StateType, action: ActionType): StateType {
  switch (action.type) {
    case "loadingTrue":
      return { ...state, isLoading: true };
    case "cities/loaded":
      return { ...state, isLoading: false, cities: action.payload };
    case "cities/cleared":
      return initialState;
    case "city/loaded":
      return { ...state, isLoading: false, currentCity: action.payload };

    case "city/added":
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities, action.payload],
        currentCity: action.payload,
      };
    case "city/deleted":
      return {
        ...state,
        isLoading: false,
        cities: state.cities.filter((city) => city.id !== action.payload),
        currentCity: {},
      };
    case "rejected":
      return { ...state, isLoading: false, error: action.payload };
    default:
      throw new Error("Unknown action");
  }
}

function CitiesProvider({ children }: CitiesProviderProps) {
  const { isLoggedIn } = useAuth();
  const [{ cities, isLoading, currentCity }, dispatch] = useReducer(
    reducer,
    initialState,
  );

  useEffect(() => {
    if (!isLoggedIn) {
      dispatch({ type: "cities/cleared" });
      return;
    }

    async function fetchCities() {
      dispatch({ type: "loadingTrue" });
      try {
        const res = await apiFetch("/api/cities");
        if (!res.ok) throw new Error("Failed to load cities");
        const data: CityType[] = await res.json();
        dispatch({ type: "cities/loaded", payload: data });
      } catch {
        dispatch({
          type: "rejected",
          payload: "There was an error loading the cities list",
        });
      }
    }
    fetchCities();
  }, [isLoggedIn]);

  const getCity = useCallback(
    async function getCity(id: string) {
      if (id.toString() === currentCity.id) return;
      dispatch({ type: "loadingTrue" });
      try {
        const res = await apiFetch(`/api/cities?id=${encodeURIComponent(id)}`);
        if (!res.ok) throw new Error("City not found");

        const data: CityType = await res.json();

        dispatch({ type: "city/loaded", payload: data });
      } catch {
        dispatch({
          type: "rejected",
          payload: "There was an error setting current city",
        });
      }
    },
    [currentCity.id],
  );

  async function addCity(newCity: CityType) {
    dispatch({ type: "loadingTrue" });
    try {
      const res = await apiFetch("/api/cities", {
        method: "POST",
        body: JSON.stringify(newCity),
      });
      if (!res.ok) throw new Error("Failed to add city");
      const data: CityType = await res.json();
      dispatch({ type: "city/added", payload: data });
    } catch (err) {
      console.error("addCity failed:", err);
      dispatch({
        type: "rejected",
        payload: "There was an error adding the city",
      });
    }
  }

  async function deleteCity(id: string) {
    dispatch({ type: "loadingTrue" });
    try {
      const res = await apiFetch(`/api/cities?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete city");

      dispatch({ type: "city/deleted", payload: id });
    } catch {
      dispatch({
        type: "rejected",
        payload: "There was an error deleting the city",
      });
    }
  }

  return (
    <CitiesContext.Provider
      value={{ cities, isLoading, currentCity, getCity, addCity, deleteCity }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

function useCities() {
  const context = useContext(CitiesContext);

  if (context === undefined) {
    throw new Error("useCities must be used within CitiesProvider");
  }
  return context;
}

// eslint-disable-next-line react-refresh/only-export-components
export { CitiesProvider, useCities };

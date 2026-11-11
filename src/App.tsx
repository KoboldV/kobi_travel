import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";
import { CitiesProvider } from "./contexts/CitiesContext";
import { AuthProvider } from "./contexts/AuthContext";

import ProtectedRoute from "./components/ProtectedRoute";

const Homepage = lazy(() => {
  return import("./pages/Homepage");
});
const Product = lazy(() => {
  return import("./pages/Product");
});
const Pricing = lazy(() => {
  return import("./pages/Pricing");
});
const PageNotFound = lazy(() => {
  return import("./pages/PageNotFound");
});
const AppLayout = lazy(() => {
  return import("./pages/AppLayout");
});
const Login = lazy(() => {
  return import("./pages/Login");
});

const Signup = lazy(() => {
  return import("./pages/Signup");
});

import Form from "./components/Form";
import CityList from "./components/CityList";
import CountryList from "./components/CountryList";
import City from "./components/City";
import SpinnerFullPage from "./components/SpinnerFullPage";

// dist/assets/index-CM0Ok_hg.css   31.80 kB │ gzip:   5.16 kB
// dist/assets/index-CC0_FoT-.js   588.51 kB │ gzip: 171.85 kB

function App() {
  return (
    <AuthProvider>
      <CitiesProvider>
        <BrowserRouter>
          <Suspense fallback={<SpinnerFullPage></SpinnerFullPage>}>
            <Routes>
              <Route index element={<Homepage></Homepage>}></Route>
              <Route path="/product" element={<Product></Product>}></Route>
              <Route path="/pricing" element={<Pricing></Pricing>}></Route>
              <Route
                path="/app"
                element={
                  <ProtectedRoute>
                    <AppLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="cities" replace />}></Route>
                <Route path="cities" element={<CityList></CityList>}></Route>
                <Route path="cities/:id" element={<City></City>}></Route>
                <Route
                  path="countries"
                  element={<CountryList></CountryList>}
                ></Route>
                <Route path="form" element={<Form></Form>}></Route>
              </Route>
              <Route path="/login" element={<Login></Login>}></Route>
              <Route path="/signup" element={<Signup></Signup>}></Route>
              <Route path="*" element={<PageNotFound></PageNotFound>}></Route>
            </Routes>
          </Suspense>
        </BrowserRouter>
      </CitiesProvider>
    </AuthProvider>
  );
}

export default App;

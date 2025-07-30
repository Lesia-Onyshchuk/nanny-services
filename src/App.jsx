// import "./App.css";
import { Route, Routes } from "react-router-dom";
// import HomePage from "./pages/HomePage/HomePage.jsx";
// import NannysPage from "./pages/NannysPage/NannysPage.jsx";
// import FavouritesPage from "./pages/FavouritesPage/FavouritesPage.jsx";
// import NotFoundPage from "./pages/NotFoundPage/NotFoundPage.jsx";
import { lazy, Suspense } from "react";
import PrivateRoute from "./PrivateRoute.jsx";
// import Layout from "./Layout.jsx";
import { Toaster } from "react-hot-toast";
import "./App.css";
import Loader from "./components/Loader/Loader.jsx";

const HomePage = lazy(() => import("./pages/HomePage/HomePage.jsx"));
const NannysPage = lazy(() => import("./pages/NannysPage/NannysPage.jsx"));
const FavouritesPage = lazy(() =>
  import("./pages/FavouritesPage/FavouritesPage.jsx")
);
const NotFoundPage = lazy(() =>
  import("./pages/NotFoundPage/NotFoundPage.jsx")
);
const Layout = lazy(() => import("./Layout.jsx"));

function App() {
  // const [loading, setLoading] = useState(false);
  return (
    <div>
      {/* {loading && <Loader />} */}
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="/nannies" element={<NannysPage />} />
            <Route
              path="/favourites"
              element={
                <PrivateRoute>
                  <FavouritesPage />
                </PrivateRoute>
              }
            />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
        <Toaster
          position="top-right"
          reverseOrder={false}
          toastOptions={{
            duration: 4000,
          }}
        />
      </Suspense>
    </div>
  );
}

export default App;

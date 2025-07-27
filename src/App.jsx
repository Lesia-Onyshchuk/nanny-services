// import "./App.css";
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage/HomePage.jsx";
import NannysPage from "./pages/NannysPage/NannysPage.jsx";
import FavouritesPage from "./pages/FavouritesPage/FavouritesPage.jsx";
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage.jsx";
import { useState } from "react";
import PrivateRoute from "./PrivateRoute.jsx";
import Layout from "./Layout.jsx";
import { Toaster } from "react-hot-toast";

function App() {
  const [loading, setLoading] = useState(false);
  return (
    <div>
      {loading && <Loader />}
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
    </div>
  );
}

export default App;

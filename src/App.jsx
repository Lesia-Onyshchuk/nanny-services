// import "./App.css";
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage/HomePage.jsx";
import NannysPage from "./pages/NannysPage/NannysPage.jsx";
import FavouritesPage from "./pages/FavouritesPage/FavouritesPage.jsx";
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage.jsx";
import { useState } from "react";
import PrivateRoute from "./PrivateRoute.jsx";

function App() {
  const [loading, setLoading] = useState(false);
  return (
    <div>
      {loading && <Loader />}
      <Routes>
        <Route path="/" element={<HomePage />} />
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
      </Routes>
    </div>
  );
}

export default App;

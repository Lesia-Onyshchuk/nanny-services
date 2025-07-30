import NanniesList from "../../components/NanniesList/NanniesList.jsx";
import css from "./FavouritesPage.module.css";
import { useEffect, useState, useMemo } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Select from "react-select";
import customSelectStyles from "../../../public/assets/styles/reactSelectStyles.js";

const onPage = 3;

const sortOptions = [
  { value: "name-asc", label: "A to Z" },
  { value: "name-desc", label: "Z to A" },
  { value: "price-asc", label: "Low price" },
  { value: "price-desc", label: "High price" },
  { value: "rating-desc", label: "Popular" },
  { value: "rating-asc", label: "Not popular" },
  { value: "id-asc", label: "Show all" },
];

const sortEntries = (entries, sortOption) => {
  if (sortOption === "id-asc") return entries;

  const [sortFieldRaw, sortDirection] = sortOption.split("-");
  const sortField = sortFieldRaw === "price" ? "price_per_hour" : sortFieldRaw;

  return entries.sort((a, b) => {
    if (sortField === "name") {
      return sortDirection === "asc"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    }

    const aVal = Number(a[sortField]) || 0;
    const bVal = Number(b[sortField]) || 0;

    return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
  });
};

const FavouritesPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [page, setPage] = useState(1);
  const [user, setUser] = useState(null);
  const [sortOption, setSortOption] = useState("id-asc");

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;

    const key = `favorites_${user.uid}`;
    const stored = localStorage.getItem(key);
    const parsed = stored ? JSON.parse(stored) : [];

    setFavorites(parsed);
    setPage(1);
  }, [user]);

  const paginatedData = useMemo(() => {
    const sorted = sortEntries([...favorites], sortOption);
    return sorted.slice(0, page * onPage);
  }, [favorites, page, sortOption]);

  const handleLoadMore = () => {
    setPage((prev) => prev + 1);
  };

  const handleRemove = (idToRemove) => {
    const key = `favorites_${user.uid}`;
    const updated = favorites.filter((nanny) => nanny.id !== idToRemove);
    localStorage.setItem(key, JSON.stringify(updated));
    setFavorites(updated);
  };

  return (
    <div className={css.page}>
      <div className={css.sortbox}>
        <label htmlFor="sort-select" className={css.label}>
          Filters
        </label>
        <Select
          inputId="sort-select"
          options={sortOptions}
          value={sortOptions.find((option) => option.value === sortOption)}
          onChange={(selected) => setSortOption(selected.value)}
          styles={customSelectStyles}
        />
      </div>

      <NanniesList nannies={paginatedData} onRemoveFavorite={handleRemove} />

      <div className={css.listbox}>
        {paginatedData.length < favorites.length && (
          <button onClick={handleLoadMore} className={css.loadMore}>
            Load more
          </button>
        )}
        {user === null && (
          <p style={{ color: "red" }}>Please sign in to view your favorites.</p>
        )}
        {user && favorites.length === 0 && (
          <p className={css.noFavourites}>No favorite nannies yet.</p>
        )}
      </div>
    </div>
  );
};

export default FavouritesPage;

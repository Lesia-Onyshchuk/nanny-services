import Select from "react-select";
import NanniesList from "../../components/NanniesList/NanniesList.jsx";
import css from "./NannysPage.module.css";
import customSelectStyles from "../../../public/assets/styles/reactSelectStyles.js";
import { useCallback, useEffect, useMemo, useState } from "react";
import { get, ref } from "firebase/database";
import { db } from "../../firebase-config.js";
import { getAuth, onAuthStateChanged } from "firebase/auth";

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
      const aName = a.name || "";
      const bName = b.name || "";
      return sortDirection === "asc"
        ? aName.localeCompare(bName)
        : bName.localeCompare(aName);
    }

    const aVal = Number(a[sortField]) || 0;
    const bVal = Number(b[sortField]) || 0;

    return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
  });
};

const NannysPage = () => {
  const [allData, setAllData] = useState([]);
  const [page, setPage] = useState(1);
  const [sortOption, setSortOption] = useState("id-asc");
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  const fetchAllData = useCallback(async () => {
    try {
      setError(null);
      const snapshot = await get(ref(db));
      const data = snapshot.val();

      if (data) {
        let entries = Object.entries(data).map(([id, value]) => ({
          id,
          ...value,
        }));

        return sortEntries(entries, sortOption);
      }

      return [];
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to load data");
      return [];
    }
  }, [sortOption]);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });

    const load = async () => {
      const data = await fetchAllData();
      setAllData(data);
      setPage(1);
    };

    load();
    return () => unsubscribe();
  }, [sortOption, fetchAllData]);

  const { paginatedData, hasMore } = useMemo(() => {
    const validData = allData.filter(
      (nanny) => typeof nanny.name === "string" && nanny.name.trim() !== ""
    );
    const paginated = validData.slice(0, page * onPage);
    return {
      paginatedData: paginated,
      hasMore: paginated.length < validData.length,
    };
  }, [allData, page]);

  const handleLoadMore = () => {
    setPage((prev) => prev + 1);
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
      <NanniesList nannies={paginatedData} />
      <div className={css.listbox}>
        {error && <p style={{ color: "red" }}>{error}</p>}

        {hasMore && (
          <button onClick={handleLoadMore} className={css.loadMore}>
            Load more
          </button>
        )}
      </div>
    </div>
  );
};

export default NannysPage;

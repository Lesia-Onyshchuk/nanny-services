import { useId } from "react";
import NannyItem from "../NannyItem/NannyItem.jsx";
import css from "./NanniesList.module.css";

const NanniesList = ({ nannies, onRemoveFavorite }) => {
  const id = useId();
  return (
    <ul className={css.listbox}>
      {nannies.map((nanny) => (
        <li key={id} className={css.liItem}>
          <NannyItem nanny={nanny} onRemoveFavorite={onRemoveFavorite} />
        </li>
      ))}
    </ul>
  );
};

export default NanniesList;

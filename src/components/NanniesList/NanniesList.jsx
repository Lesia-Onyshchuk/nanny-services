import { useId } from "react";
import NannyItem from "../NannyItem/NannyItem.jsx";
import css from "./NanniesList.module.css";

const NanniesList = ({ nannies }) => {
  const id = useId();
  return (
    <ul className={css.listbox}>
      {nannies.map((nanny) => (
        <li key={id}>
          <NannyItem nanny={nanny} />
        </li>
      ))}
    </ul>
  );
};

export default NanniesList;

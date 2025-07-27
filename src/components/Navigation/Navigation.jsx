import clsx from "clsx";
import css from "./Navigation.module.css";
import { NavLink } from "react-router-dom";

const activeClass = ({ isActive }) => {
  return clsx(css.link, isActive && css.isActive);
};

const Navigation = ({ user }) => {
  return (
    <div>
      <NavLink to="/">Nanny.Services</NavLink>
      <nav>
        <NavLink to="/" className={activeClass}>
          Home
        </NavLink>
        <NavLink to="nannies" className={activeClass}>
          Nannies
        </NavLink>
        {user && (
          <NavLink to="favourites" className={activeClass}>
            Favourites
          </NavLink>
        )}
      </nav>
    </div>
  );
};

export default Navigation;

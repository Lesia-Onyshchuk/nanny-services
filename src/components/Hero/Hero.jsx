import { NavLink } from "react-router-dom";
import hero from "../../../public/assets/hero.png";
import arrowtop from "../../../public/assets/icons/arrow-top.svg";
import arrowright from "../../../public/assets/icons/arrow-right.svg";
import css from "./Hero.module.css";
import clsx from "clsx";

const activeClass = ({ isActive }) => {
  return clsx(css.link, isActive && css.isActive);
};

const Hero = () => {
  return (
    <div className={css.herobox}>
      <div className={css.infobox}>
        <h1 className={css.title}>Make Life Easier for the Family:</h1>
        <p className={css.text}>Find Babysitters Online for All Occasions</p>
        <NavLink to="nannies" className={css.link}>
          <p>Get started</p>
          {activeClass ? (
            <img src={arrowtop} alt="" width="15" />
          ) : (
            <img src={arrowright} alt="" width="20" />
          )}
        </NavLink>
      </div>
      <img src={hero} alt="" className={css.heroImg} />
    </div>
  );
};

export default Hero;

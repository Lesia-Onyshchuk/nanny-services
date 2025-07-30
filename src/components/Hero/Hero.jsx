import { NavLink } from "react-router-dom";
import hero from "../../../public/assets/hero.png";
import arrowtop from "../../../public/assets/icons/arrow-top.svg";
import arrowright from "../../../public/assets/icons/arrow-right.svg";
import css from "./Hero.module.css";
import clsx from "clsx";
import check from "../../../public/assets/icons/check.svg";
import { useState } from "react";

const activeClass = ({ isActive }) => {
  return clsx(css.link, isActive && css.isActive);
};

const Hero = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className={css.herobox}>
      <div className={css.infobox}>
        <h1 className={css.title}>Make Life Easier for the Family:</h1>
        <p className={css.text}>Find Babysitters Online for All Occasions</p>
        <NavLink
          to="nannies"
          className={css.link}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <p>Get started</p>
          <img
            src={isHovered ? arrowright : arrowtop}
            alt=""
            width={isHovered ? "20" : "15"}
          />
        </NavLink>
      </div>
      <img src={hero} alt="" className={css.heroImg} />
      <div className={css.accountbox}>
        <div className={css.checkbox}>
          <img src={check} width="20" />
        </div>
        <div className={css.textbox}>
          <p className={css.textName}>Experienced nannies</p>
          <p className={css.number}>15,000</p>
        </div>
      </div>
    </div>
  );
};

export default Hero;

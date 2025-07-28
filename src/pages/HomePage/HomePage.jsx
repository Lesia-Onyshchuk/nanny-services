import Hero from "../../components/Hero/Hero.jsx";
import css from "./HomePage.module.css";

const HomePage = () => {
  return (
    <div className={css.page}>
      <Hero />
    </div>
  );
};

export default HomePage;

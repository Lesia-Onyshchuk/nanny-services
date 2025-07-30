import { PropagateLoader } from "react-spinners";
import css from "./Loader.module.css";

const Loader = () => {
  return (
    <div className={css.loader}>
      <PropagateLoader color="#f03f3b" />
    </div>
  );
};

export default Loader;

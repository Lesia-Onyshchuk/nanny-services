import css from "./NotFoundPage.module.css";

const NotFoundPage = () => {
  return (
    <div className={css.page}>
      <p className={css.notPage}>404. Something went wrong. Page not found!</p>
    </div>
  );
};

export default NotFoundPage;

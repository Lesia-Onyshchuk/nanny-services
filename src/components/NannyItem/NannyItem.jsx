import location from "../../../public/assets/icons/location.svg";
import star from "../../../public/assets/icons/star.svg";
import heartEmpty from "../../../public/assets/icons/heart-empty.svg";
import heartFull from "../../../public/assets/icons/heart-full.svg";
import { useEffect, useState } from "react";
import css from "./NannyItem.module.css";
import AppointmentModal from "../AppointmentModal/AppointmentModal.jsx";
import { auth } from "../../firebase-config";

const NannyItem = ({ nanny, onRemoveFavorite }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [modal, setModal] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      const storageKey = `favorites_${user.uid}`;
      const existing = JSON.parse(localStorage.getItem(storageKey)) || [];
      setIsFavorite(existing.some((item) => item.id === nanny.id));
    }
  }, [nanny.id]);

  const handleFavorite = (nanny) => {
    const user = auth.currentUser;
    if (!user) {
      alert("You must be logged in to add favorites.");
      return;
    }

    const storageKey = `favorites_${user.uid}`;
    const existing = JSON.parse(localStorage.getItem(storageKey)) || [];
    const isAlreadyFavorite = existing.some((item) => item.id === nanny.id);

    let updated;

    if (isAlreadyFavorite) {
      updated = existing.filter((item) => item.id !== nanny.id);
      setIsFavorite(false);
    } else {
      updated = [...existing, nanny];
      setIsFavorite(true);
    }

    localStorage.setItem(storageKey, JSON.stringify(updated));
    if (isAlreadyFavorite) {
      updated = existing.filter((item) => item.id !== nanny.id);
      setIsFavorite(false);
      if (onRemoveFavorite) {
        onRemoveFavorite(nanny.id);
      }
    } else {
      updated = [...existing, nanny];
      setIsFavorite(true);
    }
  };

  const charactersInfo = nanny.characters
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(", ");

  function calculateAge(dateString) {
    const birthDate = new Date(dateString);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();

    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();

    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age--;
    }

    return age;
  }

  // const firstLetter = nanny.name.charAt(0);

  const toggleReadMore = () => {
    setIsExpanded(!isExpanded);
  };

  const renderModal = () => {
    if (modal === "order") {
      return <AppointmentModal onClose={() => setModal(null)} nanny={nanny} />;
    }

    return null;
  };

  return (
    <div className={css.cardbox}>
      <ul className={css.generalInfo}>
        <li className={css.li}>
          <img src={location} alt="" width="14" className={css.icon} />
          <p>{nanny.location}</p>
        </li>
        <li className={css.li}>
          <img src={star} alt="" width="16" className={css.icon} />
          <p>Raring: {nanny.rating}</p>
        </li>
        <li>
          <p>
            Price / 1 hour:{" "}
            <span className={css.span}>{nanny.price_per_hour}$</span>
          </p>
        </li>
      </ul>
      <button className={css.selectBtn} onClick={() => handleFavorite(nanny)}>
        <img src={isFavorite ? heartFull : heartEmpty} alt="like" width="26" />
      </button>
      <div className={css.imgbox}>
        <img src={nanny.avatar_url} alt={nanny.name} className={css.photo} />
      </div>
      <div className={css.boxDescr}>
        <p className={css.role}>Nanny</p>
        <h2 className={css.name}>{nanny.name}</h2>
        <ul className={css.listDescr}>
          <li className={css.liDescr}>
            Age:{" "}
            <span className={css.spanAge}>{calculateAge(nanny.birthday)}</span>
          </li>
          <li className={css.liDescr}>
            Experience:{" "}
            <span className={css.spanDescr}>{nanny.experience}</span>
          </li>
          <li className={css.liDescr}>
            Kids Age: <span className={css.spanDescr}>{nanny.kids_age}</span>
          </li>
          <li className={css.liDescr}>
            Characters: <span className={css.spanDescr}>{charactersInfo}</span>
          </li>
          <li className={css.liDescr}>
            Education: <span className={css.spanDescr}>{nanny.education}</span>
          </li>
        </ul>
        <p className={css.about}>{nanny.about}</p>
        {!isExpanded && (
          <button onClick={toggleReadMore} className={css.readMore}>
            Read more
          </button>
        )}
        {isExpanded && (
          <div>
            <ul className={css.reviewList}>
              {nanny.reviews.map((review, index) => (
                <li key={index}>
                  <div className={css.reviewbox}>
                    <div className={css.letterbox}>
                      <p>{review.reviewer.charAt(0)}</p>
                    </div>
                    <div className={css.infoReviewer}>
                      <h3>{review.reviewer}</h3>
                      <div className={css.ratingbox}>
                        <img src={star} alt="" width="16" />
                        <p>{review.rating}</p>
                      </div>
                    </div>
                  </div>
                  <p className={css.comment}>{review.comment}</p>
                </li>
              ))}
            </ul>
            <button
              type="button"
              className={css.order}
              onClick={() => setModal("order")}
            >
              Make an appointment
            </button>
          </div>
        )}
      </div>
      {renderModal()}
    </div>
  );
};

export default NannyItem;

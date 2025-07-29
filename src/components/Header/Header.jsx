import { NavLink, useLocation } from "react-router-dom";
import Navigation from "../Navigation/Navigation.jsx";
import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import toast from "react-hot-toast";
import { auth, db } from "../../firebase-config.js";
import RegistrationModal from "../RegistrationModal/RegistrationModal.jsx";
import LoginModal from "../LoginModal/LoginModal.jsx";
import { get, ref } from "firebase/database";
import css from "./Header.module.css";
import userIcon from "../../../public/assets/icons/user.svg";

const Header = () => {
  const [user, setUser] = useState(null);
  const [modal, setModal] = useState(null);
  const { pathname } = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        try {
          const snapshot = await get(ref(db, "users/" + authUser.uid));
          const userData = snapshot.val();

          setUser({
            uid: authUser.uid,
            email: authUser.email,
            name: userData?.username || "User",
          });
        } catch (error) {
          console.error("Failed to load user data:", error);
          setUser({
            uid: authUser.uid,
            email: authUser.email,
            name: "User",
          });
        }
      } else {
        setUser(null);
      }
    });

    return unsubscribe;
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      toast.success("Successful logout");
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const renderModal = () => {
    if (modal === "register") {
      return <RegistrationModal onClose={() => setModal(null)} />;
    }

    if (modal === "login") {
      return <LoginModal onClose={() => setModal(null)} />;
    }

    return null;
  };

  // if (pathname === "/") {
  //   return (
  //     <div className={css.wrapper}>
  //       <div className={css.headerbox}>
  //         <Navigation user={user} />
  //         {user ? (
  //           <div>
  //             <p>{user.name}</p>
  //             <button onClick={logout}>Log out</button>
  //           </div>
  //         ) : (
  //           <div className={css.btnbox}>
  //             <button onClick={() => setModal("login")} className={css.login}>
  //               Log In
  //             </button>
  //             <button
  //               onClick={() => setModal("register")}
  //               className={css.register}
  //             >
  //               Registration
  //             </button>
  //           </div>
  //         )}
  //       </div>
  //       {renderModal()}
  //     </div>
  //   );
  // }

  return (
    <div className={css.wrapper}>
      <div className={pathname === "/" ? css.headerbox : css.headerboxOther}>
        <Navigation user={user} />
        {user ? (
          <div className={css.userbox}>
            <div className={css.userInfo}>
              <div className={css.userIcon}>
                <img src={userIcon} alt="user" width="16" />
              </div>
              <p className={css.name}>{user.name}</p>
            </div>
            <button onClick={logout} className={css.logout}>
              Log out
            </button>
          </div>
        ) : (
          <div className={css.btnbox}>
            <button onClick={() => setModal("login")} className={css.login}>
              Log In
            </button>
            <button
              onClick={() => setModal("register")}
              className={css.register}
            >
              Registration
            </button>
          </div>
        )}
      </div>
      {renderModal()}
    </div>
  );
};

export default Header;

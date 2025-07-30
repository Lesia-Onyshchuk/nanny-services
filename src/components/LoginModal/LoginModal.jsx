import { signInWithEmailAndPassword } from "firebase/auth";
import { useEffect, useId, useState } from "react";
import toast from "react-hot-toast";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { auth } from "../../firebase-config";
import css from "./LoginModal.module.css";
import close from "../../../public/assets/icons/close.svg";
import eye from "../../../public/assets/icons/eye.svg";
import eyeoff from "../../../public/assets/icons/eye-off.svg";

const LoginModal = ({ onClose }) => {
  const emailFieldId = useId();
  const passwordFieldId = useId();
  const [showPwd, setShowPwd] = useState(false);

  const schema = Yup.object().shape({
    email: Yup.string()
      .email("Error: Invalid email format")
      .max(64, "Email must be 64 characters or less")
      .required("Error: Email is required!"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters long")
      .max(64, "Password must be 64 characters or less")
      .required("Error: Password is required!"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const onSubmit = async ({ email, password }) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Login successful");
      onClose();
    } catch (error) {
      const message = error.message;

      if (message.includes("auth/user-not-found")) {
        toast.error("User not found. Please register.", {
          duration: 4000,
          style: {
            background: "rgb(206, 84, 84)",
            color: "#fff",
            fontSize: "16px",
            fontWeight: "500",
          },
        });
      } else {
        toast.error("Login or password error.", {
          duration: 4000,
          style: {
            background: "rgb(206, 84, 84)",
            color: "#fff",
            fontSize: "16px",
            fontWeight: "500",
          },
        });
      }
    }
  };

  const togglePwd = () => setShowPwd((prev) => !prev);

  return (
    <div className={css.wrapper} onClick={handleBackdropClick}>
      <div className={css.modal}>
        <button type="button" onClick={onClose} className={css.closeBtn}>
          <img src={close} alt="close" width="20" />
        </button>
        <h2 className={css.title}>Log In</h2>
        <p className={css.text}>
          Welcome back! Please enter your credentials to access your account and
          continue your babysitter search.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className={css.form}>
          <div className={css.errorBox}>
            <input
              {...register("email")}
              type="email"
              id={emailFieldId}
              placeholder="Email"
              className={css.input}
            />
            {errors.email && (
              <p className={css.error}>{errors.email.message}</p>
            )}
          </div>

          <div className={css.errorBox} style={{ position: "relative" }}>
            <input
              {...register("password")}
              type={showPwd ? "text" : "password"}
              id={passwordFieldId}
              placeholder="Password"
              className={css.input}
            />
            <button
              type="button"
              onClick={togglePwd}
              className={css.eyeBtn}
              tabIndex={-1}
            >
              <img src={showPwd ? eyeoff : eye} alt="Visibility" width="20" />
            </button>
            {errors.password && (
              <p className={css.error}>{errors.password.message}</p>
            )}
          </div>

          <button type="submit" className={css.submitBtn}>
            Log in
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;

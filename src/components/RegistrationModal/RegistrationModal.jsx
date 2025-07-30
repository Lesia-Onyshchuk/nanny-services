import { useEffect, useId, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { auth, db } from "../../firebase-config";
import { ref, set } from "firebase/database";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import close from "../../../public/assets/icons/close.svg";
import eye from "../../../public/assets/icons/eye.svg";
import eyeoff from "../../../public/assets/icons/eye-off.svg";
import css from "./RegistartionModal.module.css";
import { createUserWithEmailAndPassword } from "firebase/auth";

const RegistrationModal = ({ onClose }) => {
  const navigate = useNavigate();
  const emailFieldId = useId();
  const passwordFieldId = useId();
  const nameFieldId = useId();
  const [showPwd, setShowPwd] = useState(false);

  const schema = Yup.object().shape({
    name: Yup.string()
      .min(3, "Name is too short!")
      .max(24, "Name is too long!")
      .required("Error: Name is required!"),
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

  const onSubmit = async ({ name, email, password }) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await set(ref(db, "users/" + user.uid), {
        username: name,
        email,
      });

      toast.success("Registration successful");
      onClose();
      navigate("/");
    } catch (error) {
      const message = error.message;

      if (message.includes("auth/email-already-in-use")) {
        toast.error("This email is already registered.", {
          duration: 4000,
          style: {
            background: "rgb(206, 84, 84)",
            color: "#fff",
            fontSize: "16px",
            fontWeight: "500",
          },
        });
        return;
      }

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
  };

  const togglePwd = () => setShowPwd((prev) => !prev);

  return (
    <div className={css.wrapper} onClick={handleBackdropClick}>
      <div className={css.modal}>
        <button type="button" onClick={onClose} className={css.closeBtn}>
          <img src={close} alt="close" width="20" />
        </button>
        <h2 className={css.title}>Registration</h2>
        <p className={css.text}>
          Thank you for your interest in our platform! In order to register, we
          need some information. Please provide us with the following
          information.
        </p>
        <form onSubmit={handleSubmit(onSubmit)} className={css.form}>
          <div className={css.errorBox}>
            <input
              {...register("name")}
              type="text"
              id={nameFieldId}
              placeholder="Name"
              className={css.input}
              onKeyDown={(e) => {
                if (/\d/.test(e.key)) e.preventDefault();
              }}
            />
            {errors.name && <p className={css.error}>{errors.name.message}</p>}
          </div>

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
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegistrationModal;

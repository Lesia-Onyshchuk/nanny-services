import { createUserWithEmailAndPassword } from "firebase/auth";
import React, { useEffect, useId, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { auth, db } from "../../firebase-config";
import { ref, set } from "firebase/database";
import toast from "react-hot-toast";
import { Field, Form, Formik } from "formik";
import close from "../../../public/assets/icons/close.svg";
import eye from "../../../public/assets/icons/eye.svg";
import eyeoff from "../../../public/assets/icons/eye-off.svg";
import css from "./RegistartionModal.module.css";

const RegistrationModal = ({ onClose }) => {
  const navigate = useNavigate();
  const emailFieldId = useId();
  const passwordFieldId = useId();
  const nameFieldId = useId();
  const [showPwd, setShowPwd] = useState(false);

  const initialValues = {
    name: "",
    email: "",
    password: "",
  };

  const LogInSchema = Yup.object().shape({
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

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSubmit = async ({ email, password }) => {
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

  const togglePwd = () => {
    setShowPwd((prev) => !prev);
  };

  return (
    <div className={css.wrapper}>
      <div onClick={handleBackdropClick} className={css.modal}>
        <button type="button" onClick={onClose} className={css.closeBtn}>
          <img src={close} alt="close" width="20" />
        </button>
        <h2 className={css.title}>Registration</h2>
        <p className={css.text}>
          Thank you for your interest in our platform! In order to register, we
          need some information. Please provide us with the following
          information.
        </p>
        <Formik
          initialValues={initialValues}
          validationSchema={LogInSchema}
          onSubmit={handleSubmit}
        >
          <Form>
            <div className={css.inputbox}>
              <Field
                name="name"
                type="name"
                id={nameFieldId}
                placeholder="Name"
                className={css.input}
              />
              <Field
                name="email"
                type="email"
                id={emailFieldId}
                placeholder="Email"
                className={css.input}
              />
              <Field
                name="password"
                type={showPwd ? "text" : "password"}
                id={passwordFieldId}
                placeholder="Password"
                className={css.input}
              />
              <button type="button" onClick={togglePwd} className={css.eyeBtn}>
                <img src={showPwd ? eyeoff : eye} alt="Visibility" width="20" />
              </button>
            </div>
            <button type="submit" className={css.submitBtn}>
              Sing Up
            </button>
          </Form>
        </Formik>
      </div>
    </div>
  );
};

export default RegistrationModal;

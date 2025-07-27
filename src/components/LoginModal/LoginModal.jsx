import { signInWithEmailAndPassword } from "firebase/auth";
import { Field, Form, Formik } from "formik";
import { useEffect, useId } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { auth } from "../../firebase-config";

const LoginModal = ({ onClose }) => {
  const navigate = useNavigate();
  const emailFieldId = useId();
  const passwordFieldId = useId();

  const initialValues = {
    email: "",
    password: "",
  };

  const LogInSchema = Yup.object().shape({
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
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Login successful");
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

  return (
    <div>
      <div onClick={handleBackdropClick}>
        <button type="button" onClick={onClose}>
          Close
        </button>
        <h2>Log In</h2>
        <p>
          Welcome back! Please enter your credentials to access your account and
          continue your babysitter search.
        </p>
        <Formik
          initialValues={initialValues}
          validationSchema={LogInSchema}
          onSubmit={handleSubmit}
        >
          <Form>
            <Field
              name="email"
              type="email"
              id={emailFieldId}
              placeholder="Email"
            />
            <Field
              name="password"
              type="password"
              id={passwordFieldId}
              placeholder="Password"
            />
            <button type="submit">Log in</button>
          </Form>
        </Formik>
      </div>
    </div>
  );
};

export default LoginModal;

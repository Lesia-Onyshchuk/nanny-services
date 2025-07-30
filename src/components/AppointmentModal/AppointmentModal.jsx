import * as Yup from "yup";
import css from "./AppointmentModal.module.css";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import close from "../../../public/assets/icons/close.svg";
import { useEffect } from "react";

const AppointmentModal = ({ onClose, nanny }) => {
  const { name, avatar_url } = nanny;

  const schema = Yup.object().shape({
    address: Yup.string()
      .min(2, "Min 2 characters")
      .max(64, "Max 64 characters")
      .required("Name is required"),
    phone: Yup.string()
      .min(13, "Too short")
      .max(13, "Too long")
      .required("Enter your phone number"),
    age: Yup.number()
      .min(3, "Min child's age is 3 years old")
      .max(18, "Max child's age is 3 years old")
      .required("Enter your child's age"),
    time: Yup.date().required("Choose a time"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    name: Yup.string()
      .min(2, "Min 2 characters")
      .max(64, "Max 64 characters")
      .required("Enter mother's or father's name"),
    comment: Yup.string(),
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    console.log(data);
  };

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

  return (
    <div className={css.wrapper} onClick={handleBackdropClick}>
      <div className={css.modal}>
        <button type="button" onClick={onClose} className={css.closeBtn}>
          <img src={close} alt="close" width="20" />
        </button>
        <h2 className={css.title}>Make an appointment with a babysitter</h2>
        <p className={css.text}>
          Arranging a meeting with a caregiver for your child is the first step
          to creating a safe and comfortable environment. Fill out the form
          below so we can match you with the perfect care partner.
        </p>
        <div className={css.nannyBox}>
          <img src={avatar_url} alt={name} className={css.avatar} />
          <div>
            <p className={css.nanny}>Your nanny</p>
            <p className={css.name}>{name}</p>
          </div>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className={css.form}>
          <div className={css.inputBox}>
            <div className={css.errorBox}>
              <input
                {...register("address")}
                placeholder="Address"
                className={css.inputShort}
                onKeyDown={(e) => {
                  if (/\d/.test(e.key)) {
                    e.preventDefault();
                  }
                }}
              />
              {errors.name && (
                <p className={css.error}>{errors.name.message}</p>
              )}
            </div>
            <div className={css.errorBox}>
              <input
                {...register("phone")}
                placeholder="+380"
                className={css.input}
                onKeyDown={(e) => {
                  const allowedKeys = [
                    "Backspace",
                    "ArrowLeft",
                    "ArrowRight",
                    "Tab",
                  ];
                  const isNumber = /^\d$/.test(e.key);
                  const isPlus = e.key === "+";
                  const alreadyHasPlus = e.currentTarget.value.includes("+");
                  if (
                    !isNumber &&
                    !allowedKeys.includes(e.key) &&
                    !(
                      isPlus &&
                      !alreadyHasPlus &&
                      e.currentTarget.selectionStart === 0
                    )
                  ) {
                    e.preventDefault();
                  }
                }}
              />
              {errors.phone && (
                <p className={css.error}>{errors.phone.message}</p>
              )}
            </div>
          </div>

          <div className={css.dayTimeBox}>
            <div className={css.errorBox}>
              <input
                {...register("age")}
                placeholder="Child's age"
                className={css.inputShort}
                onKeyDown={(e) => {
                  if (/\d/.test(e.key)) {
                    e.preventDefault();
                  }
                }}
              />
              {errors.name && (
                <p className={css.error}>{errors.name.message}</p>
              )}
            </div>

            <div className={css.errorBox}>
              <Controller
                control={control}
                name="time"
                render={({ field }) => (
                  <DatePicker
                    selected={field.value}
                    onChange={(val) => field.onChange(val)}
                    showTimeSelect
                    showTimeSelectOnly
                    timeIntervals={30}
                    timeCaption="Time"
                    dateFormat="HH:mm"
                    placeholderText="00:00"
                    className={css.input}
                    onKeyDown={(e) => e.preventDefault()}
                  />
                )}
              />
              {errors.time && (
                <p className={css.error}>{errors.time.message}</p>
              )}
            </div>
          </div>

          <div className={css.errorBox}>
            <input
              {...register("email")}
              placeholder="Email"
              className={css.input}
            />
            {errors.email && (
              <p className={css.error}>{errors.email.message}</p>
            )}
          </div>

          <div className={css.errorBox}>
            <input
              {...register("name")}
              placeholder="Father's or mother's name"
              className={css.input}
              onKeyDown={(e) => {
                if (/\d/.test(e.key)) {
                  e.preventDefault();
                }
              }}
            />
            {errors.name && <p className={css.error}>{errors.name.message}</p>}
          </div>

          <div className={css.errorBox}>
            <textarea
              {...register("comment")}
              placeholder="Comment"
              rows={4}
              maxLength={168}
              className={css.textar}
            />
          </div>

          <button type="submit" className={css.sendBtn}>
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default AppointmentModal;

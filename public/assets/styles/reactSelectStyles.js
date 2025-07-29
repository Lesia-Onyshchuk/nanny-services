const customSelectStyles = {
  control: (base, state) => ({
    ...base,
    background: "#f03f3b",
    borderRadius: "14px",
    border: "none",
    padding: "0 18px",
    width: "226px",
    height: "48px",
    fontFamily: "Inter, sans-serif",
    fontWeight: 500,
    fontSize: "16px",
    lineHeight: "1.25",
    color: "#fbfbfb",
    cursor: "pointer",
    boxShadow: "none",
    transition: "background 0.3s ease",
  }),
  singleValue: (base) => ({
    ...base,
    color: "#fbfbfb",
  }),
  indicatorSeparator: () => ({
    display: "none",
  }),
  dropdownIndicator: (base, state) => ({
    ...base,
    color: "#fbfbfb",
    transition: "transform 0.3s ease",
    transform: state.selectProps.menuIsOpen
      ? "rotate(-180deg)"
      : "rotate(0deg)",
    "&:hover": {
      color: "#fbfbfb",
    },
  }),
  menu: (base) => ({
    ...base,
    marginTop: "8px",
    width: "226px",
    background: "#fff",
    borderRadius: "14px",
    boxShadow: "0 20px 69px 0 rgba(0, 0, 0, 0.07)",
    zIndex: 20,
    padding: "8px 0",
    maxHeight: "220px",
    overflowY: "auto",
    overflowX: "hidden",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  }),
  option: (base, state) => ({
    ...base,
    fontFamily: "Inter, sans-serif",
    fontWeight: 400,
    fontSize: "16px",
    lineHeight: "1.25",
    padding: "4px 18px",
    color:
      state.isFocused || state.isSelected ? "#191a15" : "rgba(25, 26, 21, 0.3)",
    backgroundColor: "transparent",
    cursor: "pointer",
    "&:hover": {
      color: "#191a15",
      backgroundColor: "transparent",
    },
    marginBottom: 0,
  }),
};

export default customSelectStyles;

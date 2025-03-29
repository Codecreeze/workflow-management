import { SxProps, Theme } from "@mui/material/styles";

export const styles = {
  container: {
    height: "100vh",
    width: "100vw",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundSize: "cover",
    backgroundPosition: "center",
    overflow: "hidden",
    position: "relative",
    "&::before": {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundSize: "cover",
      backgroundPosition: "center",
      zIndex: 1,
    },
  },
  contentWrapper: {
    display: "flex",
    width: "100%",
    maxWidth: "1200px",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 24px",
    position: "relative",
    zIndex: 2,
  },
  leftSection: {
    width: "45%",
    color: "white",
    display: { xs: "none", md: "block" },
    paddingRight: 3,
  },
  logoContainer: {
    mb: 5,
    display: "flex",
    alignItems: "center",
  },
  logoIcon: {
    fontSize: "64px",
    mr: 1,
  },
  logoText: {
    fontWeight: "bold",
  },
  headline: {
    fontWeight: "bold",
    mb: 2,
    lineHeight: 1.2,
  },
  subheadline: {
    mb: 4,
    opacity: 0.8,
    fontSize: "16px",
    lineHeight: 1.6,
  },
  loginCard: {
    width: 460,
    height: 768,
    borderRadius: "24px",
    background: "#FAFAFA",
    p: 4,
    display: "flex",
    flexDirection: "column",
    boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
  },
  welcomeText: {
    mb: 1,
    fontWeight: "bold",
    fontSize: "14px",
  },
  headerText: {
    mb: 4,
    fontWeight: "medium",
    fontSize: "28px",
  },
  inputLabel: {
    mb: 1,
    fontSize: "14px",
  },
  textField: {
    mb: 2,
    "& .MuiOutlinedInput-root": {
      borderRadius: "8px",
    },
  },
  forgotPassword: {
    color: "inherit",
    fontSize: "14px",
    textDecoration: "none",
    "&:hover": {
      textDecoration: "underline",
    },
  },
  loginButton: {
    mt: 3,
    mb: 2,
    py: 1.5,
    borderRadius: "8px",
    backgroundColor: "#f44336",
    "&:hover": { 
      backgroundColor: "#f44336",
      opacity: 0.9
    },
    textTransform: "none",
    fontWeight: "medium",
  },
  orDivider: {
    textAlign: "center",
    my: 2,
    position: "relative",
    "&::before": {
      content: '""',
      position: "absolute",
      top: "50%",
      left: 0,
      right: 0,
      height: "1px",
      backgroundColor: "#e0e0e0",
      zIndex: 1,
    },
    "& > *": {
      display: "inline-block",
      position: "relative",
      backgroundColor: "#FAFAFA",
      padding: "0 10px",
      zIndex: 2,
    },
  },
  socialButton: {
    width: 380,
    height: 48,
    borderRadius: "8px",
    color: "#616161",
    fontFamily: "Poppins, sans-serif",
    fontWeight: 400,
    fontSize: "12.8px",
    lineHeight: "22.53px",
    letterSpacing: "0px",
    textAlign: "center",
    verticalAlign: "middle",
    textTransform: "none",
    justifyContent: "center",
    boxShadow: "none",
    mb: 2,
    border: "1px solid #EEEEEE",
    "& .MuiButton-startIcon": {
      position: "absolute",
      left: "26px",
      margin: 0,
    },
  },
  socialButtonIcon: {
    mr: 1.5,
  },
  signUpText: {
    mt: 3,
    textAlign: "center",
    fontSize: "14px",
  },
  signUpLink: {
    color: "black",
    fontWeight: "bold",
    textDecoration: "none",
    "&:hover": {
      textDecoration: "underline",
    },
  },
  checkboxLabel: {
    "& .MuiTypography-root": {
      fontSize: "14px",
    },
  },
  checkbox: {
    color: "#f44336",
    "&.Mui-checked": {
      color: "#f44336",
    },
  },
} as Record<string, SxProps<Theme>>;

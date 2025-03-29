import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Link,
} from "@mui/material";
import { LocationCity, Apple } from "@mui/icons-material";
import { styles } from "../../styles/Auth.styles";
import BG_IMAGE from "../../assets/bg-img.png";
import BG_OVERLAY from "../../assets/bg-overlay.png";

interface LoginProps {
  onLogin?: () => void;
}

// Login page component
const Login = ({ onLogin }: LoginProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Call the login function passed as prop if it exists, otherwise navigate directly
    if (onLogin) {
      onLogin();
    } else {
      navigate("/dashboard");
    }
  };

  // SVG icons for social logins
  const GoogleIcon = () => (
    <Box 
      component="img" 
      src="https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-1024.png" 
      alt="Google" 
      width="20px" 
      height="20px" 
      sx={{ objectFit: 'contain' }}
    />
  );

  const FacebookIcon = () => (
    <Box 
      component="img" 
      src="https://upload.wikimedia.org/wikipedia/commons/b/b8/2021_Facebook_icon.svg" 
      alt="Facebook" 
      width="20px" 
      height="20px" 
      sx={{ objectFit: 'contain' }}
    />
  );

  return (
    <Box
      sx={{
        ...styles.container,
        backgroundImage: `url("${BG_IMAGE}")`,
      }}
    >
      <Box 
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url("${BG_OVERLAY}")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: 1,
        }}
      />
      <Box sx={styles.contentWrapper}>
        {/* Left Section with branding */}
        <Box sx={styles.leftSection}>
          <Box sx={styles.logoContainer}>
            <LocationCity sx={styles.logoIcon} />
            <Typography variant="h4" sx={styles.logoText}>
              HighBridge
            </Typography>
          </Box>
          <Typography variant="h4" sx={styles.headline}>
            Building the Future...
          </Typography>
          <Typography variant="body1" sx={styles.subheadline}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </Typography>
        </Box>

        {/* Login Card */}
        <Box component="form" onSubmit={handleLogin} sx={styles.loginCard}>
          <Typography variant="h6" sx={styles.welcomeText}>
            WELCOME BACK!
          </Typography>
          <Typography variant="h4" sx={styles.headerText}>
            Log In to your Account
          </Typography>

          <Typography sx={styles.inputLabel}>Email</Typography>
          <TextField
            required
            fullWidth
            id="email"
            name="email"
            autoComplete="email"
            autoFocus
            placeholder="Type here..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={styles.textField}
            variant="outlined"
            size="small"
          />

          <Typography sx={styles.inputLabel}>Password</Typography>
          <TextField
            required
            fullWidth
            name="password"
            type="password"
            id="password"
            autoComplete="current-password"
            placeholder="Type here..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={styles.textField}
            variant="outlined"
            size="small"
          />

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mt: 1,
            }}
          >
            <FormControlLabel
              control={
                <Checkbox
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  sx={styles.checkbox}
                />
              }
              label="Remember me"
              sx={styles.checkboxLabel}
            />
            <Link href="#" sx={styles.forgotPassword}>
              Forgot Password?
            </Link>
          </Box>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={styles.loginButton}
          >
            Log In
          </Button>

          <Box sx={styles.orDivider}>
            <Typography variant="body2" color="text.secondary">
              Or
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Button
              fullWidth
              variant="outlined"
              startIcon={<GoogleIcon />}
              sx={styles.socialButton}
            >
              Log In with Google
            </Button>

            <Button
              fullWidth
              variant="outlined"
              startIcon={<FacebookIcon />}
              sx={styles.socialButton}
            >
              Log In with Facebook
            </Button>

            <Button
              fullWidth
              variant="outlined"
              startIcon={<Apple sx={{ color: '#000000' }} />}
              sx={styles.socialButton}
            >
              Log In with Apple
            </Button>
          </Box>

          <Box sx={styles.signUpText}>
            <Typography variant="body2">
              New User?{" "}
              <Link href="#" sx={styles.signUpLink}>
                SIGN UP HERE
              </Link>
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;

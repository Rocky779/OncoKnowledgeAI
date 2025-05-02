import { Button } from "@mui/material";
import { useAuth } from "react-oidc-context";
function SignOut() {
  const auth = useAuth();
  const handleSignOut = () => {
    const clientId = import.meta.env.VITE_COGNITO_CLIENT_ID;
    const cognitoDomain = import.meta.env.VITE_COGNITO_DOMAIN;
    const logoutUri = import.meta.env.VITE_LOGOUT_URI;      
    auth.removeUser();
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
    alert("Signed out");
  };

  return (
    <Button
      variant="contained"
      color="secondary"
      onClick={handleSignOut}
      sx={{
        borderRadius: '20px',
        textTransform: 'none',
        fontWeight: 600,
        px: 3,
        fontSize: '1rem',
      }}
    >
      Sign Out
    </Button>
  );
}

export default SignOut;

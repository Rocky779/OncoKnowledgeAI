import { useAuth } from "react-oidc-context";
import { Button } from "@mui/material";
import LoginIcon from '@mui/icons-material/Login';

function SignIn() {
  const auth = useAuth();

  return (
    <Button
      variant="contained"
      color="primary"
      size="medium"
      onClick={() => auth.signinRedirect()}
      startIcon={<LoginIcon />}
      sx={{
        borderRadius: '20px',
        textTransform: 'none',
        fontWeight: 700,
        background: 'linear-gradient(45deg, #3f51b5 30%, #5c6bc0 90%)',
        boxShadow: '0 4px 10px rgba(63, 81, 181, 0.3)',
        '&:hover': {
          boxShadow: '0 6px 15px rgba(63, 81, 181, 0.4)',
          transform: 'translateY(-2px)',
        },
        transition: 'all 0.3s ease',
        px: 3,
        py: 1.4,
        mx: 6,
        color: '#ffffff', // Explicit white color
        fontSize: '0.95rem', // Slightly larger text
        letterSpacing: '0.5px', // Better readability
        // Ensure no background-clip or textFillColor is applied
        backgroundClip: 'initial',
        // Add a text shadow for better contrast
        textShadow: '0px 1px 2px rgba(0,0,0,0.2)'
       
      }}
    >
      Sign In
      
    </Button>
  );
}

export default SignIn;

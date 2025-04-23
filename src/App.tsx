import { useState, useEffect } from 'react';
import {
  Typography, TextField, Button, Box,
  Paper, ThemeProvider, createTheme, CssBaseline, Fade, Tooltip
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

// Create a custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#3f51b5', // Indigo
    },
    secondary: {
      main: '#f50057', // Pink
    },
    background: {
      default: '#f5f5f7',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h2: {
      fontWeight: 700,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          padding: '10px 24px',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '&:hover fieldset': {
              borderColor: '#3f51b5',
            },
          },
        },
      },
    },
  },
});

// Animated logo component
const AnimatedLogo = () => (
  <motion.div
    initial={{ scale: 0.8, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ duration: 0.5 }}
    style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}
  >
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
    >
      <MedicalServicesIcon sx={{ fontSize: 40, color: theme.palette.primary.main, mr: 2 }} />
    </motion.div>
    <Typography
      variant="h2"
      component="h1"
      sx={{
        background: 'linear-gradient(45deg, #3f51b5 30%, #f50057 90%)',
        backgroundClip: 'text',
        textFillColor: 'transparent',
        fontWeight: 'bold',
      }}
    >
      OncoKnowledge AI
    </Typography>
  </motion.div>
);

// Sexy Loading Animation Component
const LoadingAnimation = () => {
  const circleCount = 6;
  const colors = ['#3f51b5', '#5c6bc0', '#7986cb', '#9fa8da', '#c5cae9', '#f50057'];
  
  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(8px)',
        zIndex: 10,
        borderRadius: 2,
      }}
    >
      <Box sx={{ position: 'relative', width: 120, height: 120, mb: 3 }}>
        {[...Array(circleCount)].map((_, i) => (
          <motion.div
            key={i}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: 20,
              height: 20,
              borderRadius: '50%',
              backgroundColor: colors[i % colors.length],
              marginTop: -10,
              marginLeft: -10,
            }}
            animate={{
              x: Math.cos(2 * Math.PI * (i / circleCount)) * 40,
              y: Math.sin(2 * Math.PI * (i / circleCount)) * 40,
              scale: [1, 1.2, 1],
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut"
            }}
          />
        ))}
        
        {/* DNA Helix-like animation in the center */}
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={`helix-${i}`}
              style={{
                position: 'absolute',
                width: 6,
                height: 6,
                borderRadius: '50%',
                backgroundColor: '#f50057',
                top: 0,
                left: 0,
              }}
              animate={{
                x: [0, 15, 0, -15, 0],
                y: [i * 10 - 15, i * 10 - 5, i * 10 + 5, i * 10 - 5, i * 10 - 15],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.3,
                ease: "easeInOut"
              }}
            />
          ))}
        </Box>
      </Box>
      
      <Typography 
        variant="h6" 
        sx={{ 
          fontWeight: 500,
          background: 'linear-gradient(45deg, #3f51b5 30%, #f50057 90%)',
          backgroundClip: 'text',
          textFillColor: 'transparent',
          mb: 1
        }}
      >
        Processing Your Query
      </Typography>
      
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <motion.div
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <Typography variant="body2" color="text.secondary">
            Analyzing medical literature
          </Typography>
        </motion.div>
      </Box>
    </Box>
  );
};

function App() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPlaceholder, setShowPlaceholder] = useState(true);
  //const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    // Hide placeholder when user starts typing
    if (question) {
      setShowPlaceholder(false);
    } else {
      setShowPlaceholder(true);
    }
  }, [question]);

  const handleSubmit = async () => {
    if (!question.trim()) return;
    setLoading(true);
    setAnswer("");
  
    try {
      const response = await fetch('http://127.0.0.1:5000/process-query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: question }),
      });
  
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
  
      const data = await response.json();
      
      // Implement typing effect for the response
      let i = 0;
      const fullResponse = data.response;
      const typingInterval = setInterval(() => {
        if (i < fullResponse.length) {
          setAnswer(fullResponse.substring(0, i + 1));
          i++;
        } else {
          clearInterval(typingInterval);
        }
      }, 20);
    } catch (error) {
      console.error('Error fetching data:', error);
      setAnswer("Sorry, there was an error processing your request. Please try again later.");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        component={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e7eb 100%)',
          padding: 0,
          width: '100vw',
          maxWidth: '100%',
          margin: 0,
          boxSizing: 'border-box',
          overflow: 'hidden'
        }}
      >
        <Paper
          elevation={10}
          sx={{
            width: '100%',
            maxWidth: '100%', // Remove the 900px constraint
            borderRadius: { xs: 0, md: 4 }, // No border radius on mobile, keep it on larger screens
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
            height: { xs: '100vh', md: 'auto' }, // Full height on mobile, auto on desktop
            m: { xs: 0, md: 2 }, // No margin on mobile, small margin on desktop
          }}
        >
          {/* Header */}
          <Box
            sx={{
              padding: { xs: 3, md: 4 },
              background: 'linear-gradient(90deg, #f8f9fa 0%, #e9ecef 100%)',
              borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <AnimatedLogo />
          </Box>

          {/* Main content */}
          <Box sx={{ padding: { xs: 3, md: 4 }, flexGrow: 1, overflowY: 'auto', position: 'relative' }}>
            {/* Placeholder content when no conversation yet */}
            {showPlaceholder && !answer && (
              <Fade in={showPlaceholder}>
                <Box
                  sx={{
                    textAlign: 'center',
                    color: 'text.secondary',
                    my: 4
                  }}
                >
                  <motion.div
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Typography variant="h6" gutterBottom>
                      Your Oncology Knowledge Assistant
                    </Typography>
                    <Typography variant="body1" sx={{ maxWidth: '800px', mx: 'auto', mb: 3 }}>
                      Ask questions about cancer research, treatments, clinical trials, or patient care.
                    </Typography>
                    <Box
                      sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        gap: 1,
                        my: 2
                      }}
                    >
                      {[
                        "What is the role of nutrition during cancer treatment?",
                        "What are the common symptoms and risk factors for breast cancer?",
                        "I just got diagnosed with cancer, and I feel overwhelmed. What are the first steps I should take?",
                        "How does cancer affect vaginal health, and what are the treatments available?"
                      ].map((suggestion, index) => (
                        <Tooltip title="Click to use this suggestion" key={index}>
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => setQuestion(suggestion)}
                            sx={{
                              borderRadius: '20px',
                              my: 0.5,
                              borderColor: 'rgba(63, 81, 181, 0.5)',
                              '&:hover': {
                                backgroundColor: 'rgba(63, 81, 181, 0.08)',
                              }
                            }}
                          >
                            {suggestion}
                          </Button>
                        </Tooltip>
                      ))}
                    </Box>
                  </motion.div>
                </Box>
              </Fade>
            )}
            {/* Display the answer */}
            {answer && (
              <Paper
              elevation={1}
              sx={{
                p: 3,
                mb: 3,
                borderRadius: 2,
                backgroundColor: 'rgba(63, 81, 181, 0.05)',
                borderLeft: '4px solid #3f51b5',
              }}>
                <ReactMarkdown>
                  {answer}
                </ReactMarkdown>
              </Paper>
              )}

            {/* Input area */}
            <Box
              component="form"
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                mt: 2
              }}
            >
              <TextField
                label="Ask about cancer research, treatments, or care"
                variant="outlined"
                fullWidth
                multiline
                rows={3}
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                sx={{
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  }
                }}
              />
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit}
                  disabled={loading || !question.trim()}
                  endIcon={<SendIcon />}
                  sx={{
                    borderRadius: 8,
                    px: 3,
                    boxShadow: '0 4px 10px rgba(63, 81, 181, 0.3)',
                    '&:hover': {
                      boxShadow: '0 6px 15px rgba(63, 81, 181, 0.4)',
                    }
                  }}
                >
                  {loading ? 'Processing...' : 'Submit'}
                </Button>
              </Box>
              
              {/* Loading Animation */}
              <AnimatePresence>
                {loading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
                  >
                    <LoadingAnimation />
                  </motion.div>
                )}
              </AnimatePresence>
            </Box>
          </Box>

          {/* Footer */}
          <Box
            sx={{
              p: 2,
              borderTop: '1px solid rgba(0, 0, 0, 0.08)',
              textAlign: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.02)',
            }}
          >
            <Typography variant="caption" color="text.secondary">
              OncoKnowledge AI provides information for educational purposes only. Always consult healthcare professionals for medical advice.
            </Typography>
          </Box>
        </Paper>
      </Box>
    </ThemeProvider>
  );
}

export default App;

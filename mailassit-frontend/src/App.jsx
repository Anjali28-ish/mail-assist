
import { useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";

function App() {
  const [emailContent, setEmailContent] = useState("");
  const [tone, setTone] = useState("");
  const [generatedReply, setGeneratedReply] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:8080/api/email/generate",
        {
          emailContent,
          tone,
        }
      );

      setGeneratedReply(
        typeof response.data === "string"
          ? response.data
          : JSON.stringify(response.data)
      );
    } catch (error) {
      console.error(error);
      setGeneratedReply("Failed to generate reply.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(generatedReply);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#F8F7F4",
        color: "#111827",
      }}
    >
      <Container
        maxWidth="md"
        sx={{
          py: { xs: 5, md: 8 },
        }}
      >
        {/* Header */}
        <Box sx={{ mb: 5 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              mb: 2,
            }}
          >
            <Box
              sx={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                backgroundColor: "#B08D57",
              }}
            />

            <Typography
              sx={{
                fontSize: 12,
                fontWeight: 700,
                color: "#B08D57",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
              }}
            >
              MailAssist
            </Typography>
          </Box>

          <Typography
            component="h1"
            sx={{
              fontSize: { xs: 36, sm: 46 },
              lineHeight: 1.1,
              fontWeight: 700,
              letterSpacing: "-0.04em",
              color: "#111827",
              mb: 1.5,
            }}
          >
            Write better email replies.
          </Typography>

          <Typography
            sx={{
              maxWidth: 560,
              fontSize: 16,
              lineHeight: 1.65,
              color: "#6B7280",
            }}
          >
            Turn any email into a thoughtful, well-written response.
            Choose your tone and let MailAssist handle the rest.
          </Typography>
        </Box>

        {/* Input Card */}
        <Box
          sx={{
            backgroundColor: "#FFFFFF",
            border: "1px solid #E7E3DC",
            borderRadius: "14px",
            p: { xs: 2.5, sm: 3.5 },
            boxShadow: "0 8px 30px rgba(17, 24, 39, 0.05)",
          }}
        >
          <Typography
            sx={{
              fontSize: 15,
              fontWeight: 650,
              color: "#111827",
              mb: 1.5,
            }}
          >
            Original email
          </Typography>

          <TextField
            fullWidth
            multiline
            rows={7}
            placeholder="Paste the email you received..."
            value={emailContent}
            onChange={(e) => setEmailContent(e.target.value)}
            sx={{
              mb: 2.5,

              "& .MuiOutlinedInput-root": {
                borderRadius: "9px",
                backgroundColor: "#FCFCFB",
                fontSize: 15,

                "& fieldset": {
                  borderColor: "#DDD9D1",
                },

                "&:hover fieldset": {
                  borderColor: "#B8B1A5",
                },

                "&.Mui-focused fieldset": {
                  borderColor: "#B08D57",
                  borderWidth: "1px",
                },
              },

              "& textarea::placeholder": {
                color: "#9CA3AF",
                opacity: 1,
              },
            }}
          />

          {/* Controls */}
          <Box
            sx={{
              display: "flex",
              gap: 1.5,
              flexDirection: { xs: "column", sm: "row" },
            }}
          >
            <FormControl
              fullWidth
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "9px",
                  backgroundColor: "#FFFFFF",
                },

                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#DDD9D1",
                },

                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#B8B1A5",
                },

                "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#B08D57",
                },
              }}
            >
              <InputLabel>Tone</InputLabel>

              <Select
                value={tone}
                label="Tone"
                onChange={(e) => setTone(e.target.value)}
              >
                <MenuItem value="">Default</MenuItem>
                <MenuItem value="Professional">Professional</MenuItem>
                <MenuItem value="Casual">Casual</MenuItem>
                <MenuItem value="Friendly">Friendly</MenuItem>
              </Select>
            </FormControl>

            <Button
              variant="contained"
              disabled={!emailContent || loading}
              onClick={handleSubmit}
              sx={{
                minWidth: { sm: 175 },
                height: 56,
                borderRadius: "9px",
                backgroundColor: "#111827",
                color: "#FFFFFF",
                textTransform: "none",
                fontSize: 14,
                fontWeight: 650,
                boxShadow: "none",

                "&:hover": {
                  backgroundColor: "#1F2937",
                  boxShadow:
                    "0 6px 18px rgba(17, 24, 39, 0.15)",
                },

                "&.Mui-disabled": {
                  backgroundColor: "#D6D3CE",
                  color: "#FFFFFF",
                },
              }}
            >
              {loading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                "Generate reply"
              )}
            </Button>
          </Box>
        </Box>

        {/* Generated Reply */}
        {generatedReply && (
          <Box
            sx={{
              mt: 3,
              backgroundColor: "#FFFFFF",
              border: "1px solid #E7E3DC",
              borderRadius: "14px",
              p: { xs: 2.5, sm: 3.5 },
              boxShadow: "0 8px 30px rgba(17, 24, 39, 0.05)",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                mb: 2,
              }}
            >
              <Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: 15,
                      fontWeight: 650,
                      color: "#111827",
                    }}
                  >
                    Generated reply
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: "#B08D57",
                      border: "1px solid #D8C5A5",
                      borderRadius: "999px",
                      px: 1,
                      py: 0.2,
                    }}
                  >
                    AI
                  </Typography>
                </Box>

                <Typography
                  sx={{
                    fontSize: 13,
                    color: "#9CA3AF",
                    mt: 0.4,
                  }}
                >
                  Review before sending.
                </Typography>
              </Box>
            </Box>

            <TextField
              fullWidth
              multiline
              rows={8}
              value={generatedReply}
              slotProps={{
             input: {
               readOnly: true,
             },
           }}
                
              
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "9px",
                  backgroundColor: "#FAFAF8",
                  fontSize: 15,
                  lineHeight: 1.65,

                  "& fieldset": {
                    borderColor: "#E7E3DC",
                  },
                },
              }}
            />

            <Button
              variant="outlined"
              disabled={!generatedReply}
              onClick={handleCopy}
              sx={{
                mt: 2,
                height: 40,
                px: 2,
                borderRadius: "8px",
                borderColor: "#D6D3CE",
                color: "#374151",
                textTransform: "none",
                fontSize: 14,
                fontWeight: 600,

                "&:hover": {
                  borderColor: "#B08D57",
                  color: "#8A6A3F",
                  backgroundColor: "#FBF8F2",
                },
              }}
            >
              Copy reply
            </Button>
          </Box>
        )}

        {/* Footer */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 1,
            mt: 5,
          }}
        >
          <Typography
            sx={{
              fontSize: 12,
              color: "#9CA3AF",
            }}
          >
            Powered by AI
          </Typography>

          <Box
            sx={{
              width: 3,
              height: 3,
              borderRadius: "50%",
              backgroundColor: "#B08D57",
            }}
          />

          <Typography
            sx={{
              fontSize: 12,
              color: "#9CA3AF",
            }}
          >
            MailAssist
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

export default App;
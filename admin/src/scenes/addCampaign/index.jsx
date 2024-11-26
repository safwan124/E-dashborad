import { Box, Typography, Button, useTheme, TextField } from "@mui/material";
import { Header } from "../../components";
import { useState } from "react";
import { tokens } from "../../theme";
import { useNavigate } from "react-router-dom";
import { Card, Container } from "react-bootstrap";

const AddCampaigns = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const apiUrl = import.meta.env.REACT_APP_API_URL || "https://api.theeaglesrealty.com";
  
  const [campaignData, setCampaignData] = useState({
    name: "",
    description: "",
    banner_image: null,
    gallery: null,
    location_image: null,
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setCampaignData((prev) => ({ ...prev, [name]: files }));
    } else {
      setCampaignData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    const formData = new FormData();
    formData.append("name", campaignData.name);
    formData.append("description", campaignData.description);
    if (campaignData.banner_image) formData.append("banner_image", campaignData.banner_image[0]);
    if (campaignData.location_image) formData.append("location_image", campaignData.location_image[0]);
    if (campaignData.gallery) {
      Array.from(campaignData.gallery).forEach((file) =>
        formData.append("gallery", file)
      );
    }

    try {
      const response = await fetch(`${apiUrl}/campaign`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create campaign.");
      }

      const data = await response.json();
      setSuccessMessage(data.message || "Campaign created successfully.");
      setCampaignData({ name: "", description: "", banner_image: null, gallery: null, location_image: null });
    } catch (error) {
      setErrorMessage(error.message || "An unexpected error occurred.");
    }
  };

  return (
    <Container>
      <Card>
        <Box m="20px">
        <Header title="Campaigns" subtitle="Add a New Campaign" />
        <form onSubmit={handleSubmit}>
            <Box display="flex" flexDirection="column" gap="20px">
            <TextField
                label="Name"
                name="name"
                value={campaignData.name}
                onChange={handleChange}
                fullWidth
                required
            />
            <TextField
                label="Description"
                name="description"
                value={campaignData.description}
                onChange={handleChange}
                fullWidth
                multiline
                rows={4}
                required
            />
            <Box>
                <Typography variant="subtitle1">Banner Image</Typography>
                <input
                type="file"
                name="banner_image"
                accept="image/*"
                onChange={handleChange}
                required
                />
            </Box>
            <Box>
                <Typography variant="subtitle1">Gallery Images</Typography>
                <input
                type="file"
                name="gallery"
                accept="image/*"
                multiple
                onChange={handleChange}
                />
            </Box>
            <Box>
                <Typography variant="subtitle1">Location Image</Typography>
                <input
                type="file"
                name="location_image"
                accept="image/*"
                onChange={handleChange}
                required
                />
            </Box>
            {errorMessage && (
                <Typography color="error" variant="body2">
                {errorMessage}
                </Typography>
            )}
            {successMessage && (
                <Typography color="primary" variant="body2">
                {successMessage}
                </Typography>
            )}
            <Button variant="contained" color="primary" type="submit">
                Submit Campaign
            </Button>
            </Box>
        </form>
        </Box>
      </Card>
    </Container>
  );
};

export default AddCampaigns;

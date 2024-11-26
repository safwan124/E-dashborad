import { useState } from "react";
import { Box, Button, Card, Container, TextField, Typography } from "@mui/material";

const AddBlogsPage = () => {
  const [blogData, setBlogData] = useState({ headline: "", description: "" });
  const [imageFile, setImageFile] = useState(null);
  const apiUrl = import.meta.env.REACT_APP_API_URL || "https://api.theeaglesrealty.com"; // Replace with your API endpoint

  // Handle input field changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBlogData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle image file selection
  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]); // Single file for the image
  };

  // Submit the blog data
  const handleAddBlog = async () => {
    const formData = new FormData();

    // Append text fields
    formData.append("headline", blogData.headline);
    formData.append("description", blogData.description);

    // Append image file
    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      const response = await fetch(`${apiUrl}/blogs`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("Blog added successfully");
        setBlogData({ headline: "", description: "" }); // Reset fields
        setImageFile(null); // Reset image file
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error || "Failed to add blog"}`);
      }
    } catch (error) {
      console.error("Error occurred while adding blog:", error);
      alert("An error occurred while adding the blog");
    }
  };

  return (
    <Container>
      <Card>
        <Box m="20px">
          <Typography variant="h4" gutterBottom>
            Add New Blog
          </Typography>
          <Box mb="20px">
            <Typography variant="body1" gutterBottom>
              Headline
            </Typography>
            <TextField
              name="headline"
              variant="outlined"
              fullWidth
              value={blogData.headline}
              onChange={handleInputChange}
              placeholder="Enter blog headline"
            />
          </Box>
          <Box mb="20px">
            <Typography variant="body1" gutterBottom>
              Description
            </Typography>
            <TextField
              name="description"
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              value={blogData.description}
              onChange={handleInputChange}
              placeholder="Enter blog description"
            />
          </Box>
          <Box mb="20px">
            <Typography variant="body1" gutterBottom>
              Upload Image
            </Typography>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: "block", margin: "10px 0" }}
            />
          </Box>
          <Button variant="contained" color="primary" onClick={handleAddBlog}>
            Add Blog
          </Button>
        </Box>
      </Card>
    </Container>
  );
};

export default AddBlogsPage;
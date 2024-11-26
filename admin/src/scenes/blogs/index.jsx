import { Box, Typography, Button, useTheme } from "@mui/material";
import { Header } from "../../components";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { tokens } from "../../theme";
import { useNavigate } from "react-router-dom";

const Blogs = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();

  const [blogs, setBlogs] = useState([]);
  const apiUrl = import.meta.env.REACT_APP_API_URL || "https://api.theeaglesrealty.com"; //http://localhost:5000

  const columns = [
    { field: "id", headerName: "ID" },
    { field: "headline", headerName: "Headline", flex: 1 },
    { field: "desccription", headerName: "Description", flex: 1 },
    { field: "title", headerName: "Title", flex: 1 },
    {
      field: "media",
      headerName: "Blogs Media",
      flex: 1,
      renderCell: ({ row }) => {
        return (
          <Box display="flex" gap={1} flexWrap="wrap">
            {Array.isArray(row.media) && row.media.length > 0 ? (
              <img
                src={row.media[1]} // Display the first image
                alt="Blogs"
                style={{ width: "100px", height: "100px", objectFit: "cover" }}
              />
            ) : (
              "No Media Available"
            )}
          </Box>
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: ({ row }) => (
        <Button
          variant="contained"
          color="secondary"
          onClick={() => navigate(`/edit-blog/${row.id}`, { state: { blogData: row } })}
        >
          Edit
        </Button>
      ),
    }
  ];

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch(`${apiUrl}/blogs`, {
          method: "GET",
      });
  
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        const data = await response.json();
        console.log("Fetched Blogs:", data.data); // Debugging line
  
        // Assuming row.images is a JSON string, parse it
        const formattedBlogs = data.data.map(blogs => ({
          ...blogs,
          media: JSON.parse(blogs.images), // Parse images if stored as a JSON string
        }));
  
        setBlogs(formattedBlogs);
      } catch (error) {
        console.error("Error fetching Blogs:", error);
      }
    };
  
    fetchBlogs();
  }, [apiUrl]);
  

  return (
    <Box m="20px">
      <Header title="Blogs" subtitle="Managing Blogs" />
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate("/add-blog")}
        sx={{ mb: 2 }}
      >
        Add Blogs
      </Button>
      <Box
        mt="40px"
        height="75vh"
        flex={1}
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            border: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[200],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
          "& .MuiDataGrid-iconSeparator": {
            color: colors.primary[100],
          },
        }}
      >
        <DataGrid
          rows={blogs}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
          }}
          // checkboxSelection
        />
      </Box>
    </Box>
  );
};

export default Blogs;

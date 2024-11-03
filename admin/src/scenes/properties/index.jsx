import { Box, Typography, Button, useTheme } from "@mui/material";
import { Header } from "../../components";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { tokens } from "../../theme";
import { useNavigate } from "react-router-dom";

const Properties = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();

  const [properties, setProperties] = useState([]);

  const columns = [
    { field: "id", headerName: "ID" },
    { field: "city", headerName: "City", flex: 1 },
    { field: "category", headerName: "Category", flex: 1 },
    { field: "title", headerName: "Title", flex: 1 },
    {
      field: "media",
      headerName: "Property Media",
      flex: 1,
      renderCell: ({ row }) => (
        <Box display="flex" gap={1} flexWrap="wrap">
          {Array.isArray(row.media) && row.media.length > 0 ? (
            row.media.map((media, index) => (
              media.endsWith('.jpg') || media.endsWith('.png') || media.endsWith('.jpeg') ? (
                <Box
                  key={index}
                  component="img"
                  src={media}
                  alt={`media-${index}`}
                  sx={{
                    width: 200,
                    height: 50,
                    borderRadius: 4,
                    objectFit: 'contain',
                    cursor: 'pointer',
                    '&:hover': {
                      opacity: 0.8
                    }
                  }}
                  onClick={() => window.open(media, '_blank')}
                />
              ) : (
                <Box
                  key={index}
                  component="video"
                  controls
                  src={media}
                  alt={`media-${index}`}
                  sx={{
                    width: 200,
                    height: 50,
                    borderRadius: 4,
                    objectFit: 'contain',
                    cursor: 'pointer',
                    '&:hover': {
                      opacity: 0.8
                    }
                  }}
                  onClick={() => window.open(media, '_blank')}
                />
              )
            ))
          ) : (
            <Typography>No Media Available</Typography>
          )}
        </Box>
      ),
    },      
    { field: "pricePerGunta", headerName: "Price per Gunta", type: "number", flex: 1 },
    { field: "totalPrice", headerName: "Total Price", type: "number", flex: 1 },
    { field: "featured", headerName: "Featured", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: ({ row }) => (
        <Button
          variant="contained"
          color="secondary"
          onClick={() => navigate(`/edit-property/${row.id}`, { state: { propertyData: row } })}
        >
          Edit
        </Button>
      ),
    }
  ];

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch("http://localhost:5000/properties", {
          method: "GET",
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        const data = await response.json();
        console.log("Fetched Properties:", data.data); // Debugging line
  
        // Assuming row.images is a JSON string, parse it
        const formattedProperties = data.data.map(property => ({
          ...property,
          images: JSON.parse(property.images), // Parse images if stored as a JSON string
        }));
  
        setProperties(formattedProperties);
      } catch (error) {
        console.error("Error fetching properties:", error);
      }
    };
  
    fetchProperties();
  }, []);
  

  return (
    <Box m="20px">
      <Header title="Properties" subtitle="Managing Properties" />
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate("/add-property")}
        sx={{ mb: 2 }}
      >
        Add Properties
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
          rows={properties}
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

export default Properties;

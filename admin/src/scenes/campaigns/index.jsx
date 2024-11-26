import { Box, Typography, Button, useTheme } from "@mui/material";
import { Header } from "../../components";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { tokens } from "../../theme";
import { useNavigate } from "react-router-dom";

const Campaigns = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();

  const [campaigns, setCampaigns] = useState([]);
  const apiUrl = import.meta.env.REACT_APP_API_URL || "https://api.theeaglesrealty.com"; // Update as needed

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "name", headerName: "Campaign Name", flex: 1 },
    { field: "description", headerName: "Description", flex: 1 },
    {
      field: "banner_image",
      headerName: "Banner Image",
      flex: 1,
      renderCell: ({ row }) => (
        row.banner_image ? (
          <img
            src={row.banner_image}
            alt={`Banner for ${row.name}`}
            style={{ width: "100px", height: "100px", objectFit: "cover" }}
          />
        ) : "No Banner Available"
      ),
    },
    {
      field: "gallery",
      headerName: "Gallery",
      flex: 1,
      renderCell: ({ row }) => (
        <Box display="flex" gap={1} flexWrap="wrap">
          {Array.isArray(row.gallery) && row.gallery.length > 0 ? (
            row.gallery.slice(0, 3).map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Gallery ${index + 1}`}
                style={{ width: "50px", height: "50px", objectFit: "cover" }}
              />
            ))
          ) : (
            "No Gallery Images"
          )}
        </Box>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: ({ row }) => (
        <Button
          variant="contained"
          color="secondary"
          onClick={() => navigate(`/edit-campaign/${row.id}`, { state: { campaignData: row } })}
        >
          Edit
        </Button>
      ),
    },
  ];

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await fetch(`${apiUrl}/campaign`, {
          method: "GET",
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        const data = await response.json();
        console.log("Fetched Campaigns Response:", data); // Log full response for debugging
  
        if (data && data.data && Array.isArray(data.data)) {
          // Parse gallery (if JSON string) and map fields
          const formattedCampaigns = data.data.map((campaign) => ({
            ...campaign,
            gallery: JSON.parse(campaign.gallery || "[]"), // Parse gallery JSON
          }));
          setCampaigns(formattedCampaigns);
        } else {
          console.warn("No campaigns found in the response.");
          setCampaigns([]); // Set empty array if no campaigns
        }
      } catch (error) {
        console.error("Error fetching campaigns:", error);
      }
    };
  
    fetchCampaigns();
  }, [apiUrl]);
  

  return (
    <Box m="20px">
      <Header title="Campaigns" subtitle="Managing Campaigns" />
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate("/add-campaign")}
        sx={{ mb: 2 }}
      >
        Add Campaign
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
          rows={campaigns}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default Campaigns;
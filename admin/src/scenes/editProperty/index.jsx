import { useEffect, useState } from "react";
import { Box, Button, Card, Container, TextField, Typography, MenuItem, Select } from "@mui/material";
import { Row, Col } from "react-bootstrap";
import { useParams, useLocation } from "react-router-dom";

const cities = ["Mysore", "Bangalore"];
const categories = [
  { value: "Agricultural Land", fields: ["title", "extent", "planlandplantation", "location", "distance", "village", "road", "riversidebackwater", "soil", "facing", "coconut", "arecanut", "mango", "sapota", "pomegranate", "teak", "silveroak", "fencing", "borewell", "openWell", "farmhouse", "pumpHouse", "cowShed", "pricePerGunta", "totalPrice", "featured"] },
  { value: "River Side Property", fields: ["title", "extent", "planlandplantation", "location", "distance", "village", "road", "riversidebackwater", "soil", "facing", "coconut", "arecanut", "mango", "sapota", "pomegranate", "teak", "silveroak", "fencing", "borewell", "openWell", "farmhouse", "pumpHouse", "cowShed", "pricePerGunta", "totalPrice", "featured"] },
  { value: "Commercial Plot", fields: ["title", "location", "layoutName", "siteDimension", "totalArea", "siteFacing", "siteNumber", "roadWidth", "mudaAllotted", "mudaApproved", "dtcpApproved", "pricePerSqft", "totalPrice", "featured"] },
  { value: "Residential Plot", fields: ["title", "location", "layoutName", "siteDimension", "totalArea", "siteFacing", "siteNumber", "roadWidth", "mudaAllotted", "mudaApproved", "dtcpApproved", "pricePerSqft", "totalPrice", "featured"] },
  { value: "Residential House/Villa", fields: ["title", "bhk", "groundduplex", "buildersFloor", "area", "siteDimension", "siteFacing", "mainDoorFacing", "roadWidth", "mudaAllotted", "mudaApproved", "dtcpApproved", "bedrooms", "attachBathrooms", "commonBathroom", "poojaRoom", "totalBuiltUpArea", "balconies", "totalFloors", "semiFurnished", "fullyFurnished", "carParking", "totalPrice", "featured"] },
  { value: "Apartments", fields: ["title", "location", "projectname", "bhks", "bedrooms", "facing", "Bathroom", "Balconie", "Totalnumberofflats", "ageoftheapartment", "TotalfloorsintheApartment", "Flatonfloornumber", "Flatsonthatfloor", "SemiFurnished", "Furnished", "Builtuparea", "Carpetarea", "Superarea", "Lift", "carparkingopenorcovered", "Monthlymaintainacecharges", "ageofthebuilding", "Price", "featured"] },
  { value: "Industrial Land", fields: ["title", "extent", "location", "approvals", "distance", "road", "facing", "plainlandorIndustary", "industrydetails", "shedsize", "powersanction", "borewell", "pricePerGunta", "totalPrice", "featured"] }
];

const EditProperty = () => {
  const { id } = useParams();
  const location = useLocation();
  const [propertyData, setPropertyData] = useState(location.state?.propertyData || {});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!propertyData) {
      fetchPropertyData(id);
    }
  }, [id, propertyData]);

  const fetchPropertyData = async (id) => {
    try {
      const response = await fetch(`/api/properties/${id}`);
      const data = await response.json();
      setPropertyData(data);
    } catch (error) {
      console.error("Failed to fetch property data", error);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setPropertyData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSaveChanges = async () => {
    setLoading(true);

    // Create FormData object
    const formData = new FormData();

    // Append only fields with non-null, non-empty values
    Object.keys(propertyData).forEach((key) => {
      const value = propertyData[key];
      
      if (value !== null && value !== "" && value !== undefined) {
        if (Array.isArray(value)) {
          // Append each file in case of arrays like images, videos
          value.forEach((item) => {
            formData.append(key, item);
          });
        } else {
          formData.append(key, value);
        }
      }
    });

    try {
      const response = await fetch(`http://localhost:5000/properties/${id}`, {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to update property");
      }

      alert("Changes saved successfully!");
    } catch (error) {
      console.error("Error updating property:", error);
      alert("Failed to save changes.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Card>
        <Box m="20px">
          <Typography variant="h4" gutterBottom>Edit Property</Typography>
          <Typography>City</Typography>
          <Select
            value={propertyData.city || ""}
            onChange={(e) => handleInputChange({ target: { name: "city", value: e.target.value } })}
            fullWidth
          >
            {cities.map((city) => (
              <MenuItem key={city} value={city}>{city}</MenuItem>
            ))}
          </Select>
          <Typography>Category</Typography>
          <Select 
            value={propertyData.category || ""} 
            onChange={(e) => handleInputChange({ target: { name: "category", value: e.target.value } })} 
            fullWidth
          >
            {categories.map((category) => (
              <MenuItem key={category.value} value={category.value}>{category.value}</MenuItem>
            ))}
          </Select>
          
          {/* Render fields based on selected category in two columns */}
          {propertyData.category &&
            categories.find((cat) => cat.value === propertyData.category).fields.reduce((acc, field, index, array) => {
              if (index % 2 === 0) {
                acc.push(
                  <Row key={field}>
                    <Col md={6} sm={12}>
                      <TextField
                        label={field.replace(/([A-Z])/g, " $1").trim()}
                        name={field}
                        value={propertyData[field] || ""}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                      />
                    </Col>
                    {/* Render the next field in the second column if it exists */}
                    {array[index + 1] && (
                      <Col md={6} sm={12}>
                        <TextField
                          label={array[index + 1].replace(/([A-Z])/g, " $1").trim()}
                          name={array[index + 1]}
                          value={propertyData[array[index + 1]] || ""}
                          onChange={handleInputChange}
                          fullWidth
                          margin="normal"
                        />
                      </Col>
                    )}
                  </Row>
                );
              }
              return acc;
            }, [])}
          
          <Button
            variant="contained"
            color="primary"
            onClick={handleSaveChanges}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </Box>
      </Card>
    </Container>
  );
};

export default EditProperty;

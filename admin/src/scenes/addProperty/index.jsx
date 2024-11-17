import { useEffect, useState } from "react";
import { Box, Button, Card, Container, TextField, Typography, MenuItem, Select } from "@mui/material";
import { Row, Col } from "react-bootstrap";
import { useParams, useLocation } from "react-router-dom";

const cities = ["Mysore", "Bangalore"];
const categories = [
  { value: "Agricultural Land", fields: ["title", "extent", "planlandplantation","location", "distance", "village", "road","riversidebackwater", "soil", "facing", "coconut","arecanut","mango","sapota","pomegranate","teak", "silveroak", "fencing", "borewell", "openWell", "farmhouse", "pumpHouse", "cowShed", "pricePerGunta", "totalPrice", "featured"] },
  { value: "River Side Property", fields: ["title", "extent", "planlandplantation","location", "distance", "village", "road","riversidebackwater", "soil", "facing", "coconut","arecanut","mango","sapota","pomegranate","teak", "silveroak", "fencing", "borewell", "openWell", "farmhouse", "pumpHouse", "cowShed", "pricePerGunta", "totalPrice", "featured"] },
  { value: "Commercial Plot", fields: ["title", "location", "layoutName", "siteDimension", "totalArea", "siteFacing", "siteNumber", "roadWidth", "mudaAllotted", "mudaApproved", "dtcpApproved", "pricePerSqft", "totalPrice", "featured"] },
  { value: "Residential Plot", fields: ["title", "location", "layoutName", "siteDimension", "totalArea", "siteFacing", "siteNumber", "roadWidth", "mudaAllotted", "mudaApproved", "dtcpApproved", "pricePerSqft", "totalPrice", "featured"] },
  { value: "Residential House/Villa", fields: ["title", "bhk", "groundduplex", "buildersFloor", "area", "siteDimension", "siteFacing", "mainDoorFacing", "roadWidth", "mudaAllotted", "mudaApproved", "dtcpApproved", "bedrooms", "attachBathrooms", "commonBathroom", "poojaRoom", "totalBuiltUpArea", "balconies", "totalFloors", "semiFurnished", "fullyFurnished", "carParking", "totalPrice", "featured"] },
  { value: "Apartments", fields: ["title", "location", "projectname", "bhks", "bedrooms", "facing", "Bathroom", "Balconie", "Totalnumberofflats", "ageoftheapartment", "TotalfloorsintheApartment", "Flatonfloornumber", "Flatsonthatfloor", "SemiFurnished", "Furnished", "Builtuparea", "Carpetarea", "Superarea", "Lift", "carparkingopenorcovered", "Monthlymaintainacecharges", "ageofthebuilding", "Price", "featured"] },
  { value: "Industrial Land", fields: ["title", "extent", "location", "approvals", "distance",  "road", "facing", "plainlandorIndustary", "industrydetails", "shedsize", "powersanction", "borewell", "pricePerGunta", "totalPrice", "featured"] }
];

const AddPropertyPage = () => {
  const [propertyData, setPropertyData] = useState({ city: "", category: "", images: [], videos: [] });
  const [selectedFiles, setSelectedFiles] = useState({ images: null, videos: null });
  const [repeatedFields, setRepeatedFields] = useState([]);
  const apiUrl = import.meta.env.REACT_APP_API_URL || "https://api.theeaglesrealty.com"; //http://localhost:5000
  
  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setPropertyData({ ...propertyData, category });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPropertyData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e, type) => {
    const files = Array.from(e.target.files);
    setSelectedFiles((prev) => ({
      ...prev,
      [type]: [...(prev[type] || []), ...files], // Append new files to existing ones
    }));
  };

  const addField = () => {
    setRepeatedFields([...repeatedFields, ""]);
  };

  const handleAddProperty = async () => {
    const formData = new FormData();

    // Append each propertyData field directly
    Object.entries(propertyData).forEach(([key, value]) => {
        formData.append(key, value);
    });

    // Append selected files for images and videos
    if (selectedFiles.images) {
        Array.from(selectedFiles.images).forEach((file) => formData.append("images", file));
    }
    if (selectedFiles.videos) {
        Array.from(selectedFiles.videos).forEach((file) => formData.append("videos", file));
    }

    try {
      const response = await fetch(`${apiUrl}/properties`, {
          method: "POST",
          body: formData,
      });

        if (response.ok) {
            alert("Property added successfully");
        } else {
            const errorData = await response.json();
            alert(`Error: ${errorData.error || 'Failed to add property'}`);
        }
    } catch (error) {
        console.error('Error occurred while adding property:', error);
        alert('An error occurred while adding the property');
    }
};

  return (
    <Container>
      <Card>
        <Box m="20px">
          <Typography variant="h4" gutterBottom>Add New Property</Typography>
          <Typography>City</Typography>
          <Select
            value={propertyData.city}
            onChange={(e) => handleInputChange({ target: { name: "city", value: e.target.value } })}
            fullWidth
          >
            {cities.map((city) => (
              <MenuItem key={city} value={city}>{city}</MenuItem>
            ))}
          </Select>
          <Typography>Category</Typography>
          <Select value={propertyData.category} onChange={handleCategoryChange} fullWidth>
            {categories.map((category) => (
              <MenuItem key={category.value} value={category.value}>{category.value}</MenuItem>
            ))}
          </Select>

          {propertyData.category && 
          categories.find((cat) => cat.value === propertyData.category).fields.reduce((acc, field, index, array) => {
            if (index % 2 === 0) {
              // Every two fields, push a Row with two Cols to the accumulator
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
                  {/* Check if the next field exists for the second column */}
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
          <Typography>Upload Images</Typography>
          <Button onClick={addField} variant="outlined" color="secondary">Add Field</Button>
          {repeatedFields.map((_, index) => (
            <input key={`image-field-${index}`} type="file" multiple accept="image/*" onChange={(e) => handleFileChange(e, "images")} style={{ display: "block", margin: "10px 0" }} />
          ))}

          <input type="file" multiple accept="image/*" onChange={(e) => handleFileChange(e, "images")} style={{ display: "block", margin: "10px 0" }} />
          <Typography>Upload Video</Typography>
          <input type="file" multiple accept="video/*" onChange={(e) => handleFileChange(e, "videos")} style={{ display: "block", margin: "10px 0" }} />

          <Button variant="contained" color="primary" onClick={handleAddProperty}>Add Property</Button>
        </Box>
      </Card>
    </Container>
  );
};

export default AddPropertyPage;

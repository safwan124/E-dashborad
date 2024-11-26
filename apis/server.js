const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors({
  origin: '*', // Allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "uploads/";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

const db = new sqlite3.Database("./real_estate.db", (err) => {
  if (err) console.error(err.message);
  console.log("Connected to the SQLite database.");
});

db.run(
  `CREATE TABLE IF NOT EXISTS properties (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    city TEXT NOT NULL,
    category TEXT NOT NULL,
    title TEXT NOT NULL,
    images TEXT NULL,
    videos TEXT NULL,
    extent TEXT NULL,
    planlandplantation TEXT NULL,
    riversidebackwater TEXT NULL,
    location TEXT NULL,
    distance TEXT NULL,
    village TEXT NULL,
    road TEXT NULL,
    soil TEXT NULL,
    facing TEXT NULL,
    plantation TEXT NULL,
    coconut TEXT NULL,
    arecanut TEXT NULL,
    mango TEXT NULL,
    sapota TEXT NULL,
    pomegranate TEXT NULL,
    teak TEXT NULL,
    silveroak TEXT NULL,
    fencing TEXT NULL,
    borewell TEXT NULL,
    openWell TEXT NULL,
    farmhouse TEXT NULL,
    pumpHouse TEXT NULL,
    cowShed TEXT NULL,
    pricePerGunta TEXT NULL,
    totalPrice TEXT NULL,
    layoutName TEXT NULL,
    siteDimension TEXT NULL,
    totalArea TEXT NULL,
    siteFacing TEXT NULL,
    siteNumber TEXT NULL,
    roadWidth TEXT NULL,
    mudaAllotted TEXT NULL,
    mudaApproved TEXT NULL,
    dtcpApproved TEXT NULL,
    bhk TEXT NULL,
    groundduplex TEXT NULL,
    buildersFloor TEXT NULL,
    area TEXT NULL,
    mainDoorFacing TEXT NULL,
    bedrooms TEXT NULL,
    attachBathrooms TEXT NULL,
    commonBathroom TEXT NULL,
    poojaRoom TEXT NULL,
    totalBuiltUpArea TEXT NULL,
    balconies TEXT NULL,
    totalFloors TEXT NULL,
    semiFurnished TEXT NULL,
    fullyFurnished TEXT NULL,
    carParking TEXT NULL,
    projectname TEXT NULL,
    bhks TEXT NULL,
    Bathrooms TEXT NULL,
    Balconie TEXT NULL,
    Totalnumberofflats TEXT NULL,
    ageoftheapartment TEXT NULL,
    TotalfloorsintheApartment TEXT NULL,
    Flatonfloornumber TEXT NULL,
    Flatsonthatfloor TEXT NULL,
    Furnished TEXT NULL,
    Builtuparea TEXT NULL,
    Carpetarea TEXT NULL,
    Superarea TEXT NULL,
    Lift TEXT NULL,
    carparkingopenorcovered TEXT NULL,
    Monthlymaintainacecharges TEXT NULL,
    ageofthebuilding TEXT NULL,
    Price TEXT NULL,
    plainlandorIndustary TEXT NULL,
    industrydetails TEXT NULL,
    shedsize TEXT NULL,
    powersanction TEXT NULL,
    approvals TEXT NULL,
    featured BOOLEAN
  )`
);

db.run(
  `CREATE TABLE IF NOT EXISTS blogs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    image TEXT NULL,
    headline TEXT NOT NULL,
    description TEXT NULL
  )`
);

db.run(
  `CREATE TABLE IF NOT EXISTS campaign (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT NULL,
    banner_image TEXT,
    gallery TEXT,
    location_image TEXT 
  )`
);

app.get("/properties", (req, res) => {
  console.log("Received GET request for /properties");
  const sql = `SELECT 
    id, 
    city, 
    category, 
    title, 
    JSON_extract(images, '$') as images, 
    JSON_extract(videos, '$') as videos,
    extent, 
    planlandplantation, 
    riversidebackwater, 
    location, 
    distance, 
    village, 
    road, 
    soil, 
    facing, 
    plantation,
    coconut,
    arecanut,
    mango,
    sapota,
    pomegranate,
    teak,
    silveroak, 
    fencing, 
    borewell, 
    openWell, 
    farmhouse, 
    pumpHouse, 
    cowShed, 
    pricePerGunta, 
    totalPrice, 
    layoutName, 
    siteDimension, 
    totalArea, 
    siteFacing, 
    siteNumber, 
    roadWidth, 
    mudaAllotted, 
    mudaApproved, 
    dtcpApproved, 
    bhk, 
    groundduplex, 
    buildersFloor, 
    area,
    mainDoorFacing, 
    bedrooms,
    attachBathrooms, 
    commonBathroom, 
    poojaRoom, 
    totalBuiltUpArea, 
    balconies,
    totalFloors, 
    semiFurnished, 
    fullyFurnished, 
    carParking, 
    projectname, 
    bhks, 
    Bathrooms,
    Balconie, 
    Totalnumberofflats, 
    ageoftheapartment, 
    TotalfloorsintheApartment,
    Flatonfloornumber, 
    Flatsonthatfloor, 
    Furnished, 
    Builtuparea,
    Carpetarea, 
    Superarea, 
    Lift, 
    carparkingopenorcovered, 
    Monthlymaintainacecharges,
    ageofthebuilding, 
    Price, 
    plainlandorIndustary,
    industrydetails,
    shedsize,
    powersanction,
    approvals,
    featured
  FROM properties`;

  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error("Error fetching properties:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    res.json({ data: rows });
  });
});

app.get("/blogs", (req, res) => {
  console.log("Received GET request for /blogs");
  const sql = `SELECT
  id,
  image,
  headline,
  description
  FROM blogs`;
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error("Error fetching properties:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    res.json({ data: rows });
  });
})

app.get("/campaign", (req, res) => {
  console.log("Received GET request for /campaign");
  const sql = `
    SELECT
      id,
      name,
      description,
      banner_image,
      gallery,
      location_image
    FROM campaign
    ORDER BY id DESC
    LIMIT 1
  `;

  db.get(sql, [], (err, row) => {
    if (err) {
      console.error("Error fetching latest campaign:", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    if (!row) {
      return res.json({ data: null }); // Return null if no campaign exists
    }

    // Ensure gallery is properly formatted as a string
    const campaign = {
      ...row,
      gallery: row.gallery ? row.gallery.toString() : null,
    };

    res.json({ data: campaign });
  });
});

// Route to fetch a specific property by ID
app.get("/properties/:id", (req, res) => {
  const { id } = req.params; // Extract 'id' from the URL parameters

  const sql = `SELECT * FROM properties WHERE id = ?`; // SQL query to get property by ID
  db.get(sql, [id], (err, row) => {
    if (err) {
      console.error("Error fetching property:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    if (!row) {
      return res.status(404).json({ error: "Property not found" });
    }
    res.json(row); // Send the single property data as response
  });
});


app.post("/properties", upload.fields([{ name: "images", maxCount: 5 }, { name: "videos", maxCount: 1 }]), (req, res) => {
  const { city, category, title, extent, planlandplantation, riversidebackwater, location, distance, village, road, soil, facing, plantation, coconut, arecanut, mango, sapota, pomegranate, teak, silveroak, fencing, borewell, openWell, farmhouse, pumpHouse, cowShed, pricePerGunta, totalPrice, layoutName, siteDimension, totalArea, siteFacing, siteNumber, roadWidth, mudaAllotted, mudaApproved, dtcpApproved, bhk, groundduplex, buildersFloor, area, mainDoorFacing, bedrooms, attachBathrooms, commonBathroom, poojaRoom, totalBuiltUpArea, balconies, totalFloors, semiFurnished, fullyFurnished, carParking, projectname, bhks, Bathrooms, Balconie, Totalnumberofflats, ageoftheapartment, TotalfloorsintheApartment, Flatonfloornumber, Flatsonthatfloor, Furnished, Builtuparea, Carpetarea, Superarea, Lift, carparkingopenorcovered, Monthlymaintainacecharges, ageofthebuilding, Price,     plainlandorIndustary, industrydetails, shedsize, powersanction, approvals,featured } = req.body;
  console.log(req.body);

  const images = req.files.images ? req.files.images.map(file => `/${file.path}`) : [];
  const videos = req.files.videos ? req.files.videos.map(file => `/${file.path}`) : [];

  const sql = `INSERT INTO properties (
    city, category, title, images, videos, extent, planlandplantation, riversidebackwater,
    location, distance, village, road, soil, facing, plantation, coconut, arecanut, mango, sapota, pomegranate, teak, silveroak,fencing, borewell, openWell, farmhouse, pumpHouse, cowShed, pricePerGunta, totalPrice, layoutName,
    siteDimension, totalArea, siteFacing, siteNumber, roadWidth, mudaAllotted, mudaApproved,
    dtcpApproved, bhk, groundduplex, buildersFloor, area, mainDoorFacing, bedrooms,
    attachBathrooms, commonBathroom, poojaRoom, totalBuiltUpArea, balconies,
    totalFloors, semiFurnished, fullyFurnished, carParking, projectname, bhks, Bathrooms,
    Balconie, Totalnumberofflats, ageoftheapartment, TotalfloorsintheApartment,
    Flatonfloornumber, Flatsonthatfloor, Furnished, Builtuparea,
    Carpetarea, Superarea, Lift, carparkingopenorcovered, Monthlymaintainacecharges,
    ageofthebuilding, Price, plainlandorIndustary, industrydetails, shedsize, powersanction, approvals, featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  const params = [
    city, category, title, JSON.stringify(images), JSON.stringify(videos), extent, planlandplantation, riversidebackwater,
    location, distance, village, road, soil, facing, plantation, coconut, arecanut, mango, sapota, pomegranate, teak, silveroak, fencing, borewell, openWell, farmhouse, pumpHouse,cowShed, pricePerGunta, totalPrice, layoutName, siteDimension, totalArea, siteFacing, siteNumber, roadWidth, mudaAllotted, mudaApproved, dtcpApproved, bhk, groundduplex, buildersFloor, area, mainDoorFacing, bedrooms, attachBathrooms, commonBathroom, poojaRoom, totalBuiltUpArea, balconies, totalFloors, semiFurnished, fullyFurnished, carParking, projectname, bhks, Bathrooms, Balconie, Totalnumberofflats, ageoftheapartment,TotalfloorsintheApartment, Flatonfloornumber, Flatsonthatfloor, Furnished, Builtuparea, Carpetarea, Superarea, Lift, carparkingopenorcovered, Monthlymaintainacecharges, ageofthebuilding, Price, plainlandorIndustary, industrydetails, shedsize,
    powersanction, approvals, featured === "FALSE"
  ];

  db.run(sql, params, function (err) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      id: this.lastID,
      ...req.body,
      images,
      videos
    });
  });
});

app.post("/blogs", upload.single("image"), (req, res) => {
  console.log("Received POST request for /blogs");

  const { headline, description } = req.body;
  const image = req.file ? req.file.filename : null;

  if (!headline || !description || !image) {
    return res.status(400).json({ error: "All fields are required." });
  }

  const sql = `
    INSERT INTO blogs (image, headline, description)
    VALUES (?, ?, ?)`;

  db.run(sql, [image, headline, description], function (err) {
    if (err) {
      console.error("Error inserting blog entry:", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    res.status(201).json({
      message: "Blog created successfully",
      blogId: this.lastID, // Return the ID of the newly created blog
    });
  });
});

app.post(
  "/campaign",
  upload.fields([
    { name: "banner_image", maxCount: 1 },
    { name: "gallery", maxCount: 10 }, // Gallery supports multiple images
    { name: "location_image", maxCount: 1 },
  ]),
  (req, res) => {
    console.log("Received POST request for /campaign");

    const { name, description } = req.body;
    const bannerImage = req.files["banner_image"]
      ? req.files["banner_image"][0].filename
      : null;
    const galleryImages = req.files["gallery"]
      ? req.files["gallery"].map((file) => file.filename).join(",")
      : null;
    const locationImage = req.files["location_image"]
      ? req.files["location_image"][0].filename
      : null;

    if (!name || !description || !bannerImage || !locationImage) {
      return res.status(400).json({
        error: "Name, description, banner_image, and location_image are required.",
      });
    }

    const sql = `
      INSERT INTO campaign (name, description, banner_image, gallery, location_image)
      VALUES (?, ?, ?, ?, ?)`;

    db.run(
      sql,
      [name, description, bannerImage, galleryImages, locationImage],
      function (err) {
        if (err) {
          console.error("Error inserting campaign:", err);
          return res.status(500).json({ error: "Internal server error" });
        }

        res.status(201).json({
          message: "Campaign created successfully",
          campaignId: this.lastID, // ID of the newly created campaign
        });
      }
    );
  });

app.put("/properties/:id", upload.fields([{ name: "images", maxCount: 10 }, { name: "videos", maxCount: 1 }]), (req, res) => {
  const { id } = req.params;
  const {
    city, category, title, extent, planlandplantation, riversidebackwater, location, distance, village, road, soil, facing,
    plantation, coconut, arecanut, mango, sapota, pomegranate, teak, silveroak, fencing, borewell, openWell, farmhouse,
    pumpHouse, cowShed, pricePerGunta, totalPrice, layoutName, siteDimension, totalArea, siteFacing, siteNumber, roadWidth,
    mudaAllotted, mudaApproved, dtcpApproved, bhk, groundduplex, buildersFloor, area, mainDoorFacing, bedrooms,
    attachBathrooms, commonBathroom, poojaRoom, totalBuiltUpArea, balconies, totalFloors, semiFurnished, fullyFurnished,
    carParking, projectname, bhks, Bathrooms, Balconie, Totalnumberofflats, ageoftheapartment, TotalfloorsintheApartment,
    Flatonfloornumber, Flatsonthatfloor, Furnished, Builtuparea, Carpetarea, Superarea, Lift, carparkingopenorcovered,
    Monthlymaintainacecharges, ageofthebuilding, Price, plainlandorIndustary, industrydetails, shedsize, powersanction,
    approvals, featured
  } = req.body;

  // Mapping files and setting relative paths
  const images = req.files.images ? req.files.images.map(file => path.join("/", file.path)) : null;
  const videos = req.files.videos ? req.files.videos.map(file => path.join("/", file.path)) : null;

  // Boolean value handling for featured
  const isFeatured = featured === "TRUE" ? 1 : 0;

  const sql = `UPDATE properties SET 
    city = ?, category = ?, title = ?, images = ?, videos = ?, extent = ?, planlandplantation = ?, riversidebackwater = ?, location = ?, distance = ?, village = ?, road = ?, soil = ?, facing = ?, plantation = ?, coconut = ?, arecanut = ?, mango = ?, sapota = ?, pomegranate = ?, teak = ?, silveroak = ?, fencing = ?, borewell = ?, openWell = ?, farmhouse = ?, pumpHouse = ?, cowShed = ?, pricePerGunta = ?, totalPrice = ?, layoutName = ?, siteDimension = ?, totalArea = ?, siteFacing = ?, siteNumber = ?, roadWidth = ?, mudaAllotted = ?, mudaApproved = ?, dtcpApproved = ?, bhk = ?, groundduplex = ?, buildersFloor = ?, area = ?, mainDoorFacing = ?, bedrooms = ?, attachBathrooms = ?, commonBathroom = ?, poojaRoom = ?, totalBuiltUpArea = ?, balconies = ?, totalFloors = ?, semiFurnished = ?, fullyFurnished = ?, carParking = ?, projectname = ?, bhks = ?, Bathrooms = ?, Balconie = ?, Totalnumberofflats = ?, ageoftheapartment = ?, TotalfloorsintheApartment = ?, Flatonfloornumber = ?, Flatsonthatfloor = ?, Furnished = ?, Builtuparea = ?, Carpetarea = ?, Superarea = ?, Lift = ?, carparkingopenorcovered = ?, Monthlymaintainacecharges = ?, ageofthebuilding = ?, Price = ?, plainlandorIndustary = ?, industrydetails = ?, shedsize = ?, powersanction = ?, approvals = ?, featured = ?
    WHERE id = ?`;

  const params = [
    city, category, title, JSON.stringify(images), JSON.stringify(videos), extent, planlandplantation, riversidebackwater,
    location, distance, village, road, soil, facing, plantation, coconut, arecanut, mango, sapota, pomegranate, teak,
    silveroak, fencing, borewell, openWell, farmhouse, pumpHouse, cowShed, pricePerGunta, totalPrice, layoutName,
    siteDimension, totalArea, siteFacing, siteNumber, roadWidth, mudaAllotted, mudaApproved, dtcpApproved, bhk,
    groundduplex, buildersFloor, area, mainDoorFacing, bedrooms, attachBathrooms, commonBathroom, poojaRoom, totalBuiltUpArea,
    balconies, totalFloors, semiFurnished, fullyFurnished, carParking, projectname, bhks, Bathrooms, Balconie, Totalnumberofflats,
    ageoftheapartment, TotalfloorsintheApartment, Flatonfloornumber, Flatsonthatfloor, Furnished, Builtuparea, Carpetarea,
    Superarea, Lift, carparkingopenorcovered, Monthlymaintainacecharges, ageofthebuilding, Price, plainlandorIndustary,
    industrydetails, shedsize, powersanction, approvals, isFeatured, id
  ];

  db.run(sql, params, function (err) {
    if (err) {
      console.error("Error updating property:", err.message);
      return res.status(500).json({ error: "Internal server error" });
    }
    res.json({ message: "Property updated successfully", changes: this.changes });
  });
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

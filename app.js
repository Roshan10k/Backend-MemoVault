const path = require('path');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sequelize = require('./database/db.js');
const userRoutes = require('./routes/userRoutes.js');
const memoryRoutes = require('./routes/memoryRoutes.js'); 
const bucketlistRoutes = require('./routes/bucketlistRoutes.js');
const lettertoselfRoutes = require('./routes/lettertoselfRoutes.js');
const yearlygoalsRoutes = require('./routes/yearlygoalsRoutes.js')
require("dotenv").config();

// Creating a server
const app = express();

// Creating a port
const port = 8080;

// CORS configuration
app.use(cors({
    origin: "http://localhost:5173", // Your React app's URL
    methods: ["GET", "POST", "PUT", "DELETE"], // Allow required methods
    credentials: true // Enable sending cookies
}));

// Middleware for JSON and URL encoding
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Add this middleware to serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Sample route
app.get('/notice', (req, res) => {
    res.send("This is notice");
});

// User routes
app.use('/users', userRoutes);


// Memory routes
app.use('/memories', memoryRoutes);

//BucketList routes
app.use("/bucketlist", bucketlistRoutes);

//Letter To Self routes
app.use("/lettertoself", lettertoselfRoutes);

//Yearly Goals routes
app.use("/yearlygoals",yearlygoalsRoutes );

// Running the server and syncing the database
sequelize.sync({ alter: true }).then(() => {
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
}).catch(err => {
    console.log("Database sync error:", err);
});

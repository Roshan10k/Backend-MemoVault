const express = require("express");
const router = express.Router();
const bucketController = require("../controllers/bucketlistController");
const authMiddleware = require("../middleware/authMiddleware"); 

router.get("/items", authMiddleware, bucketController.getBucketList); // Get all items for user
router.post("/items", authMiddleware, bucketController.addBucketTask); // Add new item
router.put("/items/:id/done", authMiddleware, bucketController.completeBucketTask); // Mark item as done

module.exports = router;

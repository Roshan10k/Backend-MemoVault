const BucketItem = require("../Model/bucketlistModel");

// Get all bucket items for a logged-in user
const getBucketList = async (req, res) => {
  try {
    const items = await BucketItem.findAll({ where: { userId: req.user.id } });
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve bucket list items" });
  }
};

// Create a new bucket item
const addBucketTask = async (req, res) => {
    const { content } = req.body;
    console.log("Received new bucket item:", content);
    try {
      if (!content) {
        console.log("Content is empty");
        return res.status(400).json({ message: "Content is required" });
      }

      const newItem = await BucketItem.create({ 
        userId: req.user.id, 
        content 
      });

      console.log("New item created:", newItem);
      res.status(201).json(newItem);
    } catch (error) {
      console.error("Error adding bucket item:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
};

// Move item to done
const completeBucketTask = async (req, res) => {
  const { id } = req.params;
  console.log(`Moving item with ID: ${id} to done`);
  try {
    const item = await BucketItem.findOne({ where: { id, userId: req.user.id } });

    if (!item) {
      console.error("Item not found");
      return res.status(404).json({ message: "Item not found" });
    }

    item.status = "done";
    await item.save();
    console.log("Item moved to done:", item);
    res.status(200).json(item);
  } catch (error) {
    console.error("Error moving item to done:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getBucketList,
  addBucketTask,
  completeBucketTask,
};

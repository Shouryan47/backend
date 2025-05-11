const mongoose = require("mongoose");

async function connectDB() {
  try {
    await mongoose.connect(
      "mongodb+srv://pc2356640:Prince123@clusterforcommerce.11gfv.mongodb.net/"
    );
  } catch (err) {
    console.log(err);
  }
}

module.exports = connectDB;

// init/index.js
require("dotenv").config({ path: '../.env' });
const mongoose = require("mongoose");
const initData = require("./data");
const Listing = require("../models/listing.js");
const User = require("../models/user.js"); // <--- CONFIRM THIS LINE IS ADDED
const dbUrl = process.env.ATLASDB_URL;

main()
  .then(() => {
    console.log("connected to Atlas DB for initialization");
  })
  .catch((err) => {
    console.log("Atlas DB initialization connection error:", err);
  });

async function main() {
  await mongoose.connect(dbUrl);
}

const initDB = async () => {
    await Listing.deleteMany({});
    await User.deleteMany({}); // <--- CONFIRM THIS LINE IS ADDED (clears all existing users)
    
    // Create a new sample user
    let sampleUser = new User({
        email: "developer@example.com",
        username: "developer"
    });
    // Register the user (hashes password, saves to DB)
    let registeredUser = await User.register(sampleUser, "devPassword"); // <--- CONFIRM THIS LINE IS ADDED
    console.log("Sample user created:", registeredUser); // Added for debug

    // Map through listings data and assign the new user as owner
    initData.data = initData.data.map((obj) => ({...obj, owner: registeredUser._id })); // <--- CONFIRM THIS LINE IS MODIFIED
    
    await Listing.insertMany(initData.data);
    console.log("data was initialized to Atlas DB with new owner");
};

initDB();
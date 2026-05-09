const mongoose = require("mongoose");
async function connectDB() {
    await mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected Successfully!"))
    .catch((err) => console.error("MongoDB Connection Error:", err));
}

module.exports=connectDB;
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const MONGO_URI = "mongodb+srv://hari333333om:3y32irCKtdH8BGvL@cluster0.7p4sjtg.mongodb.net/Odoo-Online?retryWrites=true&w=majority&appName=Cluster0";
const JWT_SECRET = "dfsdjkfsfsdfh1223";

async function run() {
  await mongoose.connect(MONGO_URI);
  const user = await mongoose.connection.db.collection('users').findOne({ role: "Admin" });
  console.log("Found user:", user.email);
  
  const token = jwt.sign({
    id: user._id,
    organization: user.organization,
    role: user.role
  }, JWT_SECRET, { expiresIn: '1h' });
  
  await mongoose.connection.db.collection('sessions').insertOne({
    userId: user._id,
    token: token,
    createdAt: new Date()
  });

  try {
    const response = await fetch("http://localhost:8001/api/analytics", {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await response.json();
    console.log("Status:", response.status);
    console.log("Success:", JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("API Error:", err);
  }
  
  mongoose.connection.close();
}

run();

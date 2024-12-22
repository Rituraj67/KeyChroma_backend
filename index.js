import express from "express";
import dotenv from "dotenv";

import mongoose from "mongoose";

import bodyParser from "body-parser";
import cors from "cors";
dotenv.config({
  path: "./.env",
});

const dbName = "CryptoApp";

const app = express();
app.use(express.json());

const allowedOrigins = ['https://keychroma.vercel.app'];

const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};

app.use(cors());
app.use(bodyParser.json());

const port = 8000;
main().catch((err) => console.log(err));
async function main() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("Connected to database....");
  } catch (error) {
    console.log("Connection failed", error);
  }

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

import User from "./models/User.js";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken';
import Password from "./models/Password.js";


app.get("/", async (req, res) => {
  console.log("Running...");
  res.json({message: "Running"})
});

app.post("/signup", async (req, res) => {
  const { username, password } = req.body;
  console.log(username, password);

  // 1. Check if the username is already taken
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return res.status(400).json({ error: "Username is already taken" });
  }

  // 2. Hash the password before saving
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    // 3. Create and save the new user
    const newUser = new User({
      username,
      password: hashedPassword, // Store hashed password
    });

    await newUser.save();

    // 4. Respond with success message
    res
      .status(201)
      .json({ success: true, message: "User created successfully!" });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/signin", async(req,res)=>{
  const { username, password } = req.body;

  try {
    // Find the user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Compare the entered password with the hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d', // Token expiration time
    });

    // Send the token and user info back to the client
    res.json({ token, message: 'Signin successful!' });
  } catch (error) {
    console.error('Error during signin:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.post('/savepassword', async (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Authorization token is required' });
  }

  try {
    // Verify token to extract the user ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    const { url, username, password } = req.body;

    // Check if user exists (optional, for additional validation)
    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Save the password entry with userId reference
    const newPasswordEntry = new Password({
      url,
      username,
      password,
      userId,
    });

    await newPasswordEntry.save();
    res.status(200).json({ message: 'Password saved successfully' });
  } catch (error) {
    console.error(error);
    res.status(403).json({ message: 'Invalid or expired token' });
  }
});

// Backend endpoint to get passwords for the signed-in user
app.get('/getpasswords', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    console.log(token);
    if (!token) return res.status(401).json({ message: 'No token provided.' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;
    console.log(decoded);
    // Find passwords belonging to the logged-in user
    const passwords = await Password.find({ userId: userId });
    console.log(passwords);
    res.json({ success: true, passwords });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error retrieving passwords.' });
  }
});


// Backend endpoint to delete a password
app.delete('/deletepassword/:id', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided.' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;
    const passwordId = req.params.id;

    // Find and delete the password entry for the authenticated user
    const password = await Password.findOneAndDelete({ _id: passwordId, userId: userId });

    if (!password) {
      return res.status(404).json({ success: false, message: 'Password not found or unauthorized' });
    }

    res.json({ success: true, message: 'Password deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error deleting password.' });
  }
})




app.post('/verifytoken', async (req, res) => {
  // Get the token from the request headers (or body, depending on your setup)
  const token = req.headers.authorization?.split(" ")[1]; // Assumes 'Bearer <token>' format

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    // Verify the token using the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // If token is valid, send success response with the decoded token data
    res.json({ message: 'Token is valid', user: decoded });
  } catch (error) {
    // If token verification fails, send an unauthorized response
    res.status(401).json({ error: 'Invalid or expired token' });
  }
});



app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`);
})

import mongoose from 'mongoose';

// Define the schema for the user
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true, // name is required
    minlength: 3,   // at least 3 characters long
  },
  password: {
    type: String,
    required: true,  // password is required
    minlength: 6,    // password should be at least 6 characters long
  },
  createdAt: {
      type: Date,
      default: Date.now, // Automatically sets the current date/time
    },
},
{ timestamps: true }
);

const User = mongoose.model('User', userSchema);
export default User;
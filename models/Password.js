import mongoose from 'mongoose';


// Define the schema for the user
const PasswordSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true, // name is required
  },
  username:{
    type: String
  },
  password: {
    type: String,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  // Reference to User model
    required: true,
  },
});

const Password = mongoose.model('Password', PasswordSchema);
export default Password;
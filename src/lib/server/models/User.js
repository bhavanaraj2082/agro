import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true, unique: true },
    hashed_password: { type: String, required: false }, // or 'null' if not required
    email: { type: String, required: false }, // Removed `unique: false`
    username: { type: String, required: false }, // Removed `unique: false`
    phone: { type: String, required: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
    collection: "users",
  }
);

export const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;

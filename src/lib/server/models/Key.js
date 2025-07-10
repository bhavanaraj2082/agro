import mongoose from "mongoose";

const keySchema = new mongoose.Schema(
  {
    _id: { type: String, required: true }, // Key ID (e.g., providerId + providerUserId)
    user_id: { type: String, required: true }, // References the User ID
    hashed_password: { type: String }, // Optional for keys that don’t require passwords
  },
  { timestamps: true,
    collection: "keys",
  }
);

export const Key = mongoose.models.Key || mongoose.model("Key", keySchema);

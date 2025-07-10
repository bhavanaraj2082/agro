import mongoose from "mongoose";

const { Schema } = mongoose;

const contactUSSchema = new Schema(
  {
    name: {
      type: String,
      required: false, // corresponds to "required": false
      trim: true,
    },
    email: {
      type: String,
      required: false, // corresponds to "required": false
      match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, // Basic email validation
      trim: true,
    },
    country: {
      type: String,
      required: false,
      trim: true,
    },
    subject: {
      type: String,
      required: false,
      trim: true,
    },
    message: {
      type: String,
      required: false,
      trim: true,
    },
    phone: {
      type: Number,
      required: false,
      min: null, // Set to `null` to mimic Pocketbase's structure; can be adjusted as needed
      max: null,
    },
    status: {
      type: String,
      required: false,
      trim: true,
    },
  },
  {
    timestamps: true,
    collection: "contactus",
  }
);


const Contact = mongoose.models.Contact || mongoose.model("Contact", contactUSSchema);

export default Contact;

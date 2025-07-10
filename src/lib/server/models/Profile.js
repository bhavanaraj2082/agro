import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  companyName: { type: String, required: true },
  mobileNr: { type: String, required: true },
  country: { type: String },
  addressLine1: { type: String, required: true },
  addressLine2: { type: String },
  pinCode: { type: String, required: true },
  city: { type: String },
  district: { type: String, required: true },
  state: { type: String, required: true },
  companyWebUrl: { type: String },
  type: { type: String, required: true }
}, { timestamps: true });

const profileSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    fullName: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    companyName: { type: String },
    cellPhone: { type: String },
    mobileNr: { type: String },
    email: { type: String },
    alternateNr: { type: String },
    isEmailVerified: { type: Boolean, default: false },
    isPhoneVerified: { type: Boolean, default: false },
    gstNumber: { type: String },
    tanNumber: { type: String },
    country: { type: String },
    currency: { type: String },
    companyUrl: { type: String },
    addresses: [addressSchema],
    billingAddress:mongoose.Schema.Types.Mixed,
    shippingAddress:mongoose.Schema.Types.Mixed
  },
  {
    timestamps: true,
    collection: "profiles",
  }
);

delete mongoose.models.Profile

const Profile = mongoose.models.Profile || mongoose.model("Profile", profileSchema);

export default Profile;
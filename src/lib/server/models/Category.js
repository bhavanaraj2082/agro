import mongoose from "mongoose";

const { Schema } = mongoose;

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: false,
      trim: true,
    },
    url: {
      type: String,
      required: false,
      trim: true,
    },


  },
  {
    timestamps: true,      
    collection: "category", 
  }
);

categorySchema.index({ name: 1 });
categorySchema.index({ url: 1 });


const Category =mongoose.models.Category || mongoose.model("Category", categorySchema);

export default Category;

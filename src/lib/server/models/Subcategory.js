import mongoose from "mongoose";

const { Schema } = mongoose;

const subCategorySchema = new Schema(
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
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category"
        },


    },
    {
        timestamps: true,
        collection: "subcategory",
    }
);

subCategorySchema.index({ name: 1 });
subCategorySchema.index({ url: 1 });
subCategorySchema.index({ category: 1 });

const SubCategory = mongoose.models.SubCategory || mongoose.model("SubCategory", subCategorySchema);

export default SubCategory;

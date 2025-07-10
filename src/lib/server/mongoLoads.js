import Category from "$lib/server/models/Category.js";
import SubCategory from "$lib/server/models/Subcategory.js";
import Product from "$lib/server/models/Product.js";
import Profile from '$lib/server/models/Profile.js';
import { error } from "@sveltejs/kit";
import Cart from '$lib/server/models/Cart.js';
export async function getProductdatas() {
    const records = await Category.find();
    
    if (records.length === 0) {
      throw { status: 404, message: "Product not found" };
    }
    console.log(records,"i am from loads");
    
    return JSON.parse(JSON.stringify(records));
  }
  
  export async function getSubCategoryDatas(subid) {
    console.log(subid,"subid");
    
    try {
      const category = await Category.findOne({ url: subid });
      console.log(category,"category based on subid");
      
      if (!category) {
        throw { status: 404, message: "No Category found with the specified urlName" };
      }
      
      const records = await SubCategory.find({ category: category._id }).populate("category");
      console.log(records,"records");
      
      if (records.length === 0) {
        throw { status: 404, message: "No SubCategories found matching the category" };
      }
      
      return { records: JSON.parse(JSON.stringify(records)) };
    } catch (err) {
      console.error("Error fetching subcategory data:", err);
  
      if (err.status && err.body) {
        throw err;
      }
      
      throw error(err.status || 500, err.message || "Failed to retrieve subcategory data");
    }
  }



  export async function DifferentProds(productId) {
    console.log(productId,"productId");
    
    const product = JSON.parse(
      JSON.stringify(
        await Product.findOne({ product_number: productId })
          .populate("category")
          .populate("subcategory")
      )
    );
    console.log(product,"product");
    
  

    const formattedRecord = {
      productId: product?._id?.toString() || "",
      productName: product?.name || "--",
      productNumber: product?.product_number || "N/A",
      description: product?.description || "",
      price: product?.price || 0,
      imageSrc: product?.image || product?.imageSrc || "",
      properties: product?.properties || {},
      stockQuantity: product.stockQuantity || 0,
      availableStock: product.stockQuantity || 0,
      category: product?.category || {},
      subcategory: product?.subcategory || {},
    };
  
    return { records: [formattedRecord] };
  }


  
export async function getProfileDetails(userId) {
  console.log(userId,"userId")
  try {
    const record = await Profile.findOne({ userId });
    if (record) {
      return { profileData: JSON.parse(JSON.stringify(record)) };
    } else {
      return { success: false, message: "Profile not found" };
    }
  } catch (error) {
    return {
      success: false,
      message: "Something went wrong",
      error: error.message,
    };
  }
}


  // export const loadProductsubcategory = async (suburl) => {
  //   console.log("Received suburl parameter:", suburl);
  
  //   try {
  //     // Step 1: Find subcategory and populate category
  //     const subcategory = await SubCategory.findOne({ url: suburl }).populate("category");
  
  //     if (!subcategory) {
  //       console.error("Subcategory not found for:", suburl);
  //       throw error(404, "Subcategory not found");
  //     }
  
  //     console.log("✅ Subcategory:", subcategory);
  
  //     // Step 2: Build details object
  //     const subCategoryDetails = {
  //       subCatName: subcategory.name,
  //       subCatUrlName: subcategory.url,
  //       catName: subcategory.category?.name || "",
  //       catUrlName: subcategory.category?.url || "",
  //     };
  
  //     console.log("📦 subCategoryDetails:", subCategoryDetails);
  
  //     // Step 3: Prepare aggregation pipeline
  //     const matchCondition = {
  //       subcategory: subcategory._id,
  //     };
  //     console.log("🔍 matchCondition:", matchCondition);
  
  //     const aggregation = [
  //       { $match: matchCondition },
  //       {
  //         $lookup: {
  //           from: "subcategories",
  //           localField: "subcategory",
  //           foreignField: "_id",
  //           as: "subcategoryDetails",
  //         },
  //       },
  //       {
  //         $lookup: {
  //           from: "categories",
  //           localField: "category",
  //           foreignField: "_id",
  //           as: "categoryDetails",
  //         },
  //       },
  //       { $unwind: { path: "$subcategoryDetails", preserveNullAndEmptyArrays: true } },
  //       { $unwind: { path: "$categoryDetails", preserveNullAndEmptyArrays: true } },
  //       {
  //         $project: {
  //           _id: 1,
  //           name: 1,
  //           description: 1,
  //           price: 1,
  //           product_number: 1,
  //           properties: 1,
  //           "categoryDetails.name": 1,
  //           "categoryDetails.url": 1,
  //           "subcategoryDetails.name": 1,
  //           "subcategoryDetails.url": 1,
  //         },
  //       },
  //     ];
  
  //     const products = await Product.aggregate(aggregation);
  //     const totalCount = await Product.countDocuments(matchCondition);
  
  //     console.log(`📦 Found ${products.length} products`);
  
  //     // Step 4: Format products
  //     const formattedProducts = products.map(product => {
  //       const {
  //         _id,
  //         name,
  //         description,
  //         price,
  //         product_number,
  //         properties,
  //         categoryDetails = {},
  //         subcategoryDetails = {},
  //       } = product;
  
  //       return {
  //         _id,
  //         name: name || "",
  //         description: description || "",
  //         price: price || 0,
  //         product_number: product_number || "",
  //         properties: properties || {},
  //         category: {
  //           name: categoryDetails?.name || "",
  //           url: categoryDetails?.url || ""
  //         },
  //         subcategory: {
  //           name: subcategoryDetails?.name || "",
  //           url: subcategoryDetails?.url || ""
  //         }
  //       };
  //     });
  //     console.log(formattedProducts,"formattedProducts");
      
  // // return formattedProducts;/
  //     const result = {
  //       products: formattedProducts,
  //       productCount: totalCount,
  //       subCategoryDetails,         // Main expected structure
  //       subcategory: subCategoryDetails, // Fallback (for compatibility)
  //       specifications: {},
  //       subSubCategory: [],
  //       manufacturers: []
  //     };
  
  //     console.log("✅ Final returned data:", result,"result  rom loads");
  
  //     return result;
  
  //   } catch (err) {
  //     console.error("❌ Error loading products by subcategory:", err);
  //     throw error(err.status || 500, err.message || "Failed to load products by subcategory");
  //   }
  // };
  // export const loadProductsubcategory = async (
  //   suburl,
  //   pageNum,
  //   manufacturer,
  //   search,
  //   price,
  //   userId,
  //   filter
  // ) => {
  //   console.log("Received request parameters:", {
  //     suburl,
  //     pageNum,
  //     manufacturer,
  //     filter
  //   });
    
  //   const page = pageNum || 1;
  //   const pageSize = 5;
    
  //   try {
  //     // Find the subcategory by URL
  //     const subcategory = await SubCategory.findOne({ url: suburl })
  //       .populate({ path: "category" });
      
  //     if (!subcategory) {
  //       throw error(404, "Subcategory not found for URL");
  //     }
      
  //     // Create subCategoryDetails with serializable values
  //     const subCategoryDetails = {
  //       subCatName: subcategory.name,
  //       subCatUrlName: subcategory.url,
  //       catName: subcategory.category?.name || "",
  //       catUrlName: subcategory.category?.url || "",
  //     };

      
  //     // Query products matching this subcategory
  //     const matchCondition = {
  //       subcategory: subcategory._id,
  //     };
      
  //     if (manufacturer) {
  //       matchCondition.manufacturer = manufacturer;
  //     }
      
  //     if (search) {
  //       matchCondition.$or = [
  //         { product_number: { $regex: search, $options: "i" } },
  //         { name: { $regex: search, $options: "i" } },
  //         { description: { $regex: search, $options: "i" } },
  //       ];
  //     }
      
  //     if (Object.entries(filter).length > 0) {
  //       // Apply the filter
  //       Object.entries(filter).forEach(([key, value]) => {
  //         matchCondition[key] = value;
  //       });
  //     }
      
  //     let sortConditions = {};
      
  //     if (price === "asc") {
  //       sortConditions.price = 1;
  //     } else if (price === "desc") {
  //       sortConditions.price = -1;
  //     } else {
  //       sortConditions.product_number = 1;
  //     }
      
  //     // Perform the query
  //     const totalCount = await Product.countDocuments(matchCondition);
  //     console.log(totalCount,"totalCount");
      
      
  //     // Get paginated products
  //     const products = await Product.find(matchCondition)
  //       .sort(sortConditions)
  //       .skip((Number(page) - 1) * Number(pageSize))
  //       .limit(Number(pageSize))
  //       .populate('category')
  //       .populate('subcategory')
  //       .lean(); // Use lean() to get plain JavaScript objects
      
  //     // Convert all MongoDB ObjectIds to strings to make them serializable
  //     const serializedProducts = products.map(product => {
  //       return {
  //         _id: product._id.toString(), // Convert ObjectId to string
  //         name: product.name || "",
  //         description: product.description || "",
  //         price: product.price || 0,
  //         product_number: product.product_number || "",
  //         properties: product.properties || {},
  //         category: product.category ? {
  //           _id: product.category._id.toString(),
  //           name: product.category.name ,
  //           url: product.category.url || ""
  //         } : {},
  //         subcategory: product.subcategory ? {
  //           _id: product.subcategory._id.toString(),
  //           name: product.subcategory.name || "",
  //           url: product.subcategory.url || ""
  //         } : {}
  //       };
  //     });
      
  //     // If no products found
  //     if (!serializedProducts.length) {
  //       return {
  //         products: [],
  //         productCount: 0,
  //         subCategoryDetails,
  //         specifications: {},
  //         subSubCategory: []
  //       };
  //     }
      
  //     // Return the serialized data
  //     return {
  //       products: serializedProducts,
  //       productCount: totalCount,
  //       subCategoryDetails,

     
  //     };
      
  //   } catch (err) {
  //     console.error("Error loading products by subcategory:", err);
      
  //     if (err.status && err.body) {
  //       throw err;
  //     }
  
  //     throw error(err.status || 500, err.message || "Failed to load products by subcategory");
  //   }
  // };

  export const loadProductsubcategory = async (
  suburl,
  pageNum,
  manufacturer,
  search,
  price,
  userId,
  filter
) => {
  console.log("Received request parameters:", {
    suburl,
    pageNum,
    manufacturer,
    filter
  });
  
  const page = pageNum || 1;
  const pageSize = 5;
  
  try {
    // Find the subcategory by URL with proper population
    const subcategory = await SubCategory.findOne({ url: suburl })
      .populate({ 
        path: "category",
        select: "_id name url" // Explicitly select fields you need
      })
      .lean(); // Add lean() for better performance
    
    if (!subcategory) {
      throw error(404, "Subcategory not found for URL");
    }
    
    console.log("Found subcategory:", subcategory); // Debug log
    
    // Create subCategoryDetails with serializable values
    const subCategoryDetails = {
      subCatName: subcategory.name,
      subCatUrlName: subcategory.url,
      catName: subcategory.category?.name || "",
      catUrlName: subcategory.category?.url || "",
    };
    
    // Create separate category details
    const categoryDetails = {
      _id: subcategory.category?._id?.toString() || "",
      name: subcategory.category?.name || "",
      url: subcategory.category?.url || ""
    };
    
    console.log("SubCategory details:", subCategoryDetails); // Debug log
    console.log("Category details:", categoryDetails); // Debug log
    
    // Query products matching this subcategory
    const matchCondition = {
      subcategory: subcategory._id,
    };
    
    if (manufacturer) {
      matchCondition.manufacturer = manufacturer;
    }
    
    if (search) {
      matchCondition.$or = [
        { product_number: { $regex: search, $options: "i" } },
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }
    
    if (filter && Object.entries(filter).length > 0) {
      // Apply the filter
      Object.entries(filter).forEach(([key, value]) => {
        matchCondition[key] = value;
      });
    }
    
    let sortConditions = {};
    
    if (price === "asc") {
      sortConditions.price = 1;
    } else if (price === "desc") {
      sortConditions.price = -1;
    } else {
      sortConditions.product_number = 1;
    }
    
    // Perform the query
    const totalCount = await Product.countDocuments(matchCondition);
    console.log(totalCount, "totalCount");
    
    // Get paginated products with proper population
    const products = await Product.find(matchCondition)
      .sort(sortConditions)
      .skip((Number(page) - 1) * Number(pageSize))
      .limit(Number(pageSize))
      .populate({
        path: 'category',
        select: '_id name url' // Explicitly select fields
      })
      .populate({
        path: 'subcategory',
        select: '_id name url' // Explicitly select fields
      })
      .lean(); // Use lean() to get plain JavaScript objects
    
    console.log("Found products:", products.length); // Debug log
    if (products.length > 0) {
      console.log("Sample product category:", products[0].category); // Debug log
    }
    
    // Convert all MongoDB ObjectIds to strings to make them serializable
    const serializedProducts = products.map(product => {
      // Use category from subcategory if product category is not populated
      let categoryData = {};
      if (product.category && typeof product.category === 'object' && product.category._id) {
        // Category is populated
        categoryData = {
          _id: product.category._id.toString(),
          name: product.category.name || "",
          url: product.category.url || ""
        };
      } else {
        // Use category from subcategory as fallback
        categoryData = {
          _id: subcategory.category?._id?.toString() || "",
          name: subcategory.category?.name || "",
          url: subcategory.category?.url || ""
        };
      }
      
      // Handle subcategory
      let subcategoryData = {};
      if (product.subcategory) {
        if (typeof product.subcategory === 'object' && product.subcategory._id) {
          subcategoryData = {
            _id: product.subcategory._id.toString(),
            name: product.subcategory.name || "",
            url: product.subcategory.url || ""
          };
        } else {
          subcategoryData = {
            _id: product.subcategory.toString(),
            name: "",
            url: ""
          };
        }
      }
      
      return {
        _id: product._id.toString(), // Convert ObjectId to string
        name: product.name || "",
        description: product.description || "",
        price: product.price || 0,
        product_number: product.product_number || "",
        properties: product.properties || {},
        category: categoryData,
        subcategory: subcategoryData,
        // Add any other fields you need
        manufacturer: product.manufacturer || "",
        image: product.image || "",
        imageSrc: product.imageSrc || ""
      };
    });
    
    // If no products found
    if (!serializedProducts.length) {
      return {
        products: [],
        productCount: 0,
        subCategoryDetails,
        categoryDetails,
        specifications: {},
        subSubCategory: []
      };
    }
    
    // Return the serialized data
    return {
      products: serializedProducts,
      productCount: totalCount,
      subCategoryDetails,
      categoryDetails, // Add category details separately
    };
    
  } catch (err) {
    console.error("Error loading products by subcategory:", err);
    
    if (err.status && err.body) {
      throw err;
    }

    throw error(err.status || 500, err.message || "Failed to load products by subcategory");
  }
};

  export const getSingleCartDetails = async (userEmail) => {
    try {
      const carts = await Cart.find({ userEmail })
      .sort({ createdAt: -1 }) // Sort by createdAt in descending order
      .exec();
      return carts;
    } catch (error) {
      console.error('Error fetching cart details:', error);
      throw error;
    }
  };
  
  export const singleCartForCount = async (userEmail) => {
    try {
      const carts = await Cart.findOne({ userEmail, isActiveCart: true })
        .exec();
        return JSON.parse(JSON.stringify(carts));
    } catch (error) {
      console.error('Error fetching cart details:', error);
      throw error;
    }
  };
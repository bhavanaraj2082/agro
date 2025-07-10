import { DifferentProds } from "$lib/server/mongoLoads.js";
// import { favorite, checkavailabilityproduct,addToCart } from "$lib/server/mongoActions.js";
import { error } from "@sveltejs/kit";
import { addItemInCart } from '$lib/server/mongoActions.js';
export async function load({ params, locals }) {
    console.log(params, "params");
    
    let authedUser = {};
    if (locals.authedUser?.username) {
      authedUser = locals?.authedUser;
    }
    
    try {
      const results = await Promise.allSettled([
        DifferentProds(params.product),
        // RelatedProductData(params.product),
        // CompareSimilarityData(params.product),
        // isProductFavorite(params.product, locals),
      ]);
      
      const [productDataResult, relatedProducts, compareSimilarity, isFavorite] =
        results.map((result) => (result.status === "fulfilled" ? result.value : []));
      
      // Extract records directly from productData
      if (!productDataResult || 
          productDataResult.type === "error" || 
          !productDataResult.records || 
          productDataResult.records.length === 0) {
        throw error(404, "Product not found");
      }
      
      // Send records directly instead of nested structure
      const records = productDataResult.records;
      
      return {
        records, // Now this is directly accessible
        // relatedProducts,
        // compareSimilarity,
        isFavorite,
        authedUser,
      };
    } catch (err) {
      console.error("Error loading product data:", err);
      if (err.status === 404) {
        throw err;
      }
      throw error(500, "Failed to load product data.");
    }
  }



export const actions = {
	async addItemToCart({ request }) {
		try {
			const body = Object.fromEntries(await request.formData());
      // console.log("body",body);
      
			const res = await addItemInCart(body);
			return{res};
		} catch (error) {
			console.error('Error fadding item in cart:', error);
			return { error: 'Failed to add item' };
		}
	},

};
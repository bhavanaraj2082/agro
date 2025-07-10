import { addToCart,favorite } from '$lib/server/mongoActions.js';
import { loadProductsubcategory } from '$lib/server/mongoLoads.js';
import { error } from '@sveltejs/kit';

export async function load({ params,url,depends,locals }) {
	try {
		let userId = locals?.authedUser?.id || ""
		let filter = {}
		let searchParams = new URLSearchParams(url.searchParams);
		console.log(searchParams,"searchParams");
		
			searchParams.forEach((value, key) => {
				// Skip certain keys
				if (key !== "manufacturer" && key !== "page" && key !== "search" && key !== "price") {
				  // Check if `filter['properties.' + key]` exists and is an array
				  if (filter[`properties.${key}`]) {
					// If it's an array, add the value to it
					filter[`properties.${key}`].$in.push(value)
					filter[`properties.${key}`].$in.flat()
				  } else {
					// Otherwise, initialize it as an array with the value
					filter[`properties.${key}`] = { $in: [value] };
				  }
				}
			  });
			  
		const page = parseInt(url.searchParams.get('page')) || 1
		const search = url.searchParams.get('search') || ""
		const manufacturer = url.searchParams.get('manufacturer') || null
		const price = url.searchParams.get('price') || ""
        depends("page:data")

		const result = await loadProductsubcategory(params.subsubid, page, manufacturer, search, price, userId,filter);
console.log(result,"result");

   		if (result.status && result.status === 404) {
   		  throw error(404, result.body?.message || "Subcategory not found");
   		}
	
   		return result;
		
	} catch (err) {
		console.error('Error loading product data:', err);
		if (err.status === 404) {
			throw error(404, err.body?.message || err.message || "Resource not found");
		  }
		  
		  throw error(500, err.message || "Failed to load product data");
	}
}

export const actions = {
	pageChange: async ({ request, params }) => {
		const body = Object.fromEntries(await request.formData());

		try {
			const { products, totalCount } = await loadProductsubcategory(params.subsubid, body.page);

			return products;
		} catch (error) {
			//console.error('Error removing item:', error);
			return {
				status: 500,
				body: { message: 'Failed to get data' }
			};
		}
	},
	addtocart:async({request,locals})=>{
	
		
		try {
		
			const userEmail = request?.formData?.userEmail || "N/A"
			const body = Object.fromEntries(await request.formData())
			const data = JSON.parse(body.item)
			//console.log(data);
			return await addToCart(data,userEmail)
		} catch (error) {
			console.log(error);
			return {success:false,message:"Something went wrong"}
		}
	},
	favorite: async ({ request }) => {
			const favdata = Object.fromEntries(await request.formData());
			console.log("Form Data Received:", favdata);
			// const {productDesc, id, imgUrl,productName,productNumber,priceSize,quantity,stock,size,price,} = favdata;
			try {
			  const result = await favorite(favdata);
			  return result;
			} catch (error) {
			  console.error("Error adding to favourites:", error.message);
			  return {
				success: false,
				type: "error",
				message: "Something went wrong please try again later!",
			  };
			}
		  },
};

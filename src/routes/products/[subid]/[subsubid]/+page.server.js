import { addToCart, favorite } from '$lib/server/mongoActions.js';
import { loadProductsubcategory } from '$lib/server/mongoLoads.js';
import { error } from '@sveltejs/kit';

export async function load({ params, url, depends, locals }) {
    console.log(params, "params");
    
    try {
        let userId = locals?.authedUser?.id || ""
        let filter = {}
        let searchParams = new URLSearchParams(url.searchParams);
        console.log(searchParams, "searchParams");
       
        searchParams.forEach((value, key) => {
            // Skip certain keys
            if (key !== "manufacturer" && key !== "page" && key !== "search" && key !== "price") {
                if (filter[`properties.${key}`]) {
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
        
        console.log("Load function - calling with params:", {
            subsubid: params.subsubid,
            page,
            manufacturer,
            search,
            price,
            userId,
            filter
        });
        
        depends("page:data")
        const result = await loadProductsubcategory(params.subsubid, page, manufacturer, search, price, userId, filter);
        
        console.log("Load function - result:", result);
        
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
    pageChange: async ({ request, params, url }) => {
        const body = Object.fromEntries(await request.formData());
        console.log("PageChange action - received body:", body);
        
        try {
            // Extract all the parameters like in the load function
            let filter = {}
            
            // Parse the current URL to get search params
            const currentUrl = new URL(request.url);
            const searchParams = currentUrl.searchParams;
            
            // Build filter from search params (same logic as load function)
            searchParams.forEach((value, key) => {
                if (key !== "manufacturer" && key !== "page" && key !== "search" && key !== "price") {
                    if (filter[`properties.${key}`]) {
                        filter[`properties.${key}`].$in.push(value)
                        filter[`properties.${key}`].$in.flat()
                    } else {
                        filter[`properties.${key}`] = { $in: [value] };
                    }
                }
            });
            
            // Get all parameters
            const page = parseInt(body.page) || 1;
            const search = searchParams.get('search') || body.search || "";
            const manufacturer = searchParams.get('manufacturer') || body.manufacturer || null;
            const price = searchParams.get('price') || body.price || "";
            const userId = body.userId || "";
            
            console.log("PageChange action - calling loadProductsubcategory with:", {
                subsubid: params.subsubid,
                page,
                manufacturer,
                search,
                price,
                userId,
                filter
            });
            
            const result = await loadProductsubcategory(params.subsubid, page, manufacturer, search, price, userId, filter);
            
            console.log("PageChange action - result:", result);
            
            return {
                success: true,
                data: result
            };
            
        } catch (error) {
            console.error('Error in pageChange action:', error);
            return {
                success: false,
                status: 500,
                body: { message: 'Failed to get data' }
            };
        }
    },
    
    addtocart: async ({ request, locals }) => {
        try {
            const userEmail = request?.formData?.userEmail || "N/A"
            const body = Object.fromEntries(await request.formData())
            const data = JSON.parse(body.item)
            return await addToCart(data, userEmail)
        } catch (error) {
            console.log(error);
            return { success: false, message: "Something went wrong" }
        }
    },
    
    favorite: async ({ request }) => {
        const favdata = Object.fromEntries(await request.formData());
        console.log("Form Data Received:", favdata);
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
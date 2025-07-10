import { getSubCategoryDatas } from "$lib/server/mongoLoads.js"
import { error } from '@sveltejs/kit';

export const load = async ({ params }) => {
    try {
      const data = await getSubCategoryDatas(params.subid);

      if (data.status && data.status !== 200) {
        throw error(data.status, data.error || "Failed to load data");
      }


      return data;
    } catch (err) {
      console.error("Unexpected error in load function:", err);
      
       if (err.status === 404) {
      throw error(404, err.body?.message || err.message || "Category not found");
    }

    throw error(err.status || 500, err.message || "Failed to load subcategory data");
    }
  }
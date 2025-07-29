
import { searchByQuery } from "$lib/server/mongoActions.js";
// import { singleCartForCount, getCart } from "$lib/server/mongoLoads.js";



export const actions = {
  search: async ({ request }) => {
    const body = Object.fromEntries(await request.formData());
    try {
      const searchResults = await searchByQuery(body);
      console.log(searchResults,'form actionfor search');
      return { searchResults };
    } catch (err) {
      console.error("Error fetching search results:", err);
    }
  },


  // getCartValue: async ({ request }) => {
  //   const body = Object.fromEntries(await request.formData());
  //   try {
  //     const cartData = await singleCartForCount(body.loggedInUser);
  //     return { cartData };
  //   } catch (err) {
  //     console.log("--error--", err);
  //     return fail(400, err);
  //   }
  // },
  // getCartData: async ({ request }) => {
  //   const body = Object.fromEntries(await request.formData());
  //   try {
  //     const cartData = await getCart(body.loggedInUser);
  //     return cartData;
  //   } catch (err) {
  //     console.log("--error--", err);
  //     return fail(400, err);
  //   }
  // },
  // getFavorites: async ({ request, locals }) => {
  //   const userId = locals.authedUser.id;
  //   return await getMyFavorites(userId);
  // },
};

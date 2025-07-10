// import { popularProducts } from "$lib/server/mongoLoads.js";
import { searchByQuery } from "$lib/server/mongoActions.js";

// import FooterLink from "$lib/server/models/FooterLink.js";
import { singleCartForCount, getCart } from "$lib/server/mongoLoads.js";
import {} from "../lib/server/mongoActions.js";

// export async function load() {
//   try {
//     const PopularProductsData = await popularProducts();
//     const foolterLinksData = await getFooterLinks();

//     return { PopularProductsData, foolterLinksData };
//   } catch (error) {
//     console.error("Error loading products:", error);
//     return { success: false, message: "Error loading products" };
//   }
// }

// const getFooterLinks = async () => {
//   try {
//     const footerLinks = await FooterLink.find().sort({ name: 1 }).lean();
//     if (footerLinks) {
//       return JSON.parse(JSON.stringify(footerLinks));
//     } else {
//       return [];
//     }
//   } catch (error) {
//     console.error("Error fetching footer links");
//   }
// };

export const actions = {
  search: async ({ request }) => {
    const body = Object.fromEntries(await request.formData());
    try {
      const responce = await searchByQuery(body);
      console.log(responce,'form actionfor search');
      return { responce };
    } catch (err) {
      console.error("Error fetching search results:", err);
    }
  },

  // subscribe: async ({ request }) => {
  //   const { email } = Object.fromEntries(await request.formData());
  //   const API_KEY = MAILCHIMP_API_KEY;
  //   const LIST_ID = MAILCHIMP_LIST_ID;
  //   const SERVER_PREFIX = MAILCHIMP_SERVER_PREFIX;

  //   try {
  //     const response = await fetch(
  //       `https://${SERVER_PREFIX}.api.mailchimp.com/3.0/lists/${LIST_ID}/members`,
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Basic ${Buffer.from(`anystring:${API_KEY}`).toString("base64")}`,
  //         },
  //         body: JSON.stringify({
  //           email_address: email,
  //           status: "subscribed",
  //         }),
  //       }
  //     );

  //     if (!response.ok) {
  //       const errorData = await response.json();

  //       if (errorData.title === "Member Exists") {
  //         return {
  //           status: 200,
  //           body: { success: true, message: "Already subscribed!" },
  //         };
  //       }

  //       return {
  //         status: 500,
  //         body: {
  //           success: false,
  //           message: "Subscription failed, please try again later.",
  //         },
  //       };
  //     }

  //     return {
  //       status: 200,
  //       body: { success: true, message: "Successfully subscribed!" },
  //     };
  //   } catch (error) {
  //     return {
  //       status: 500,
  //       body: { success: false, message: "Something went wrong with server." },
  //     };
  //   }
  // },
  getCartValue: async ({ request }) => {
    const body = Object.fromEntries(await request.formData());
    try {
      const cartData = await singleCartForCount(body.loggedInUser);
      return { cartData };
    } catch (err) {
      console.log("--error--", err);
      return fail(400, err);
    }
  },
  getCartData: async ({ request }) => {
    const body = Object.fromEntries(await request.formData());
    try {
      const cartData = await getCart(body.loggedInUser);
      return cartData;
    } catch (err) {
      console.log("--error--", err);
      return fail(400, err);
    }
  },
  getFavorites: async ({ request, locals }) => {
    const userId = locals.authedUser.id;
    return await getMyFavorites(userId);
  },
};

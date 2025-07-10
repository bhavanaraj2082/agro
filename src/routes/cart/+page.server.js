
// import Cart from '$lib/server/models/Cart.js'

// export async function load({ locals }) {
//   try {
//     const userId = locals?.authedUser?.id || ""
//     console.log(userId, "userId");
   
//     if (!userId) {
//       return { cartData: [] }
//     }
    
//     const cart = await Cart.findOne({ userId: userId });
//     console.log("cart items fetched", cart);
    
//     // Check if cart exists and has items
//     if (!cart || !cart.cartItems) {
//       return { cartData: [] };
//     }
    
//     // Return the cart data
//     const cartData = cart.cartItems || [];
//     console.log("data in cart page server ", cartData);
    
//     return { cartData }
//   } catch (error) {
//     console.log("Error fetching cart:", error);
//     return { cartData: [] };
//   }
// }


import Cart from '$lib/server/models/Cart.js'
import Product from "$lib/server/models/Product.js";
import Category from "$lib/server/models/Category.js";
import SubCategory from "$lib/server/models/Subcategory.js";

export async function load({ locals }) {
  try {
    const userId = locals?.authedUser?.id || ""
    console.log(userId, "userId");
   
    if (!userId) {
      return { cartData: [] }
    }
   
    const cart = await Cart.findOne({ userId: userId });
    console.log("cart items fetched", cart);
   
    // Check if cart exists and has items
    if (!cart || !cart.cartItems || cart.cartItems.length === 0) {
      return { cartData: [] };
    }
   
    // Fetch product details for each cart item
    const cartData = await Promise.all(
      cart.cartItems.map(async (item) => {
        const product = await Product.findById(item.productId);
        if (product) {
          // Fetch category and subcategory details
          const [category, subcategory] = await Promise.all([
            Category.findById(product.category),
            SubCategory.findById(product.subcategory)
          ]);
          
          return {
            ...product.toObject(), // Convert mongoose document to plain object
            category: category ? category.toObject() : null,
            subcategory: subcategory ? subcategory.toObject() : null,
            qty: item.qty
          };
        }
        return null; // Return null if product not found
      })
    );
    
    // Filter out null values (products that weren't found)
    const validCartData = cartData.filter(item => item !== null);
    
    console.log("data in cart page server ", validCartData);
   
    return { cartData: JSON.parse(JSON.stringify(validCartData ))}
  } catch (error) {
    console.log("Error fetching cart:", error);
    return { cartData: [] };
  }
}
export const actions = {
  async getGuestComps({ request }) {
    try {
      const body = Object.fromEntries(await request.formData());
      console.log("body", body);

      const fetchUrl = `${API_URL}/cart`;

      const res = await fetch(fetchUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: body.guestComps
      });
      console.log("resresresresresresresresresresresresres", res);

      if (!res.ok) {
        return { success: false, error: "Failed to check parts availability" };
      }

      const cartData = await res.json();
      console.log("data in cart page seever ", cartData);
      return { cartData }
    } catch (error) {
      console.error('Error fadding item in cart:', error);
      return { error: 'Failed to add item' };
    }
  },

  async updateCartData({ request }) {
    try {
      const body = Object.fromEntries(await request.formData());
      // console.log("body",body.cartData);
      let parsedCartData = JSON.parse(body.cartData || "[]");
      parsedCartData = parsedCartData.map((item) => ({
        compId: item._id,
        stockId: item.stock._id,
        qty: item.qty
      }))
      console.log("Parsed cartData:", parsedCartData);
      // Find the cart and update it
      const isActive = parsedCartData.length > 0;
      const cart = await Cart.findOneAndUpdate(
        { userId: body.userId },
        { cartItems: parsedCartData,
          isActive
         },
        { new: true, upsert: true } // creates a new cart if none exists
      );

      return {
        success: true,
        message: "Cart updated successfully",
      };
    } catch (error) {
      console.error('Error fadding item in cart:', error);
      return { error: 'Failed to add item' };
    }
  },

  async mergeGuestComps({ request }) {
    try {
      const body = Object.fromEntries(await request.formData());
      let parsedGuestComps = JSON.parse(body.guestComps || "[]");
      const userId = body.userId;

      if (!userId) {
        return { status: 400, error: "UserId missing" };
      }

      console.log("Parsed guestComps:", parsedGuestComps);

      // For each guest item, add to cartItems if compId doesn't exist already
      for (const guestItem of parsedGuestComps) {
        await Cart.updateOne(
          { userId, "cartItems.compId": { $ne: guestItem.compId } },
          { $push: { cartItems: guestItem } }
        );
      }

      // Fetch updated cart after merge
      const updatedCart = await Cart.findOne({ userId });


      console.log("resresresresresresresresresresresresres", res);

      if (!res.ok) {
        return { success: false, error: "Failed to check parts availability" };
      }

      const cartData = await res.json();
      console.log("data in cart page seever ", cartData);

      return {
        status: 200,
        body: { cartData: cartData },
      };
    } catch (error) {
      console.error("Error merging guest comps:", error);
      return { status: 500, error: "Failed to merge carts" };
    }
  }

};
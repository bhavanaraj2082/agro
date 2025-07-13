
import Cart from '$lib/server/models/Cart.js'
import Profile from '$lib/server/models/Profile.js';
import { createOrder, updateBillingAddressCart, updateShippingAddressCart } from '$lib/server/mongoActions.js';
import Product from "$lib/server/models/Product.js";
// export async function load({ locals }) {
//     try {

//         const userId = locals?.authedUser?.id || ""
//         if (!userId) {
//             let cartData
//             return { cartData: [] }
//         }
//         console.log("userId",userId);
//         const cartData = await Cart.findOne({ userId: userId });
// console.log(cartData,"cart");
//        return { 
//     cartData: cartData ? JSON.parse(JSON.stringify(cartData)) : [] 
// }

//     } catch (error) {
//         console.log(error);
//     }

// }
export async function load({ locals }) {
    try {
        const userId = locals?.authedUser?.id || ""
        if (!userId) {
            return { cart: null }
        }
        
        console.log("userId", userId);
        const cart = await Cart.findOne({ userId: userId });
        console.log(cart, "cart");
        
        if (!cart || !cart.cartItems || cart.cartItems.length === 0) {
            return { cart: null }
        }
        
        // Extract product IDs from cart items
        const productIds = cart.cartItems.map(item => item.productId);
        
        // Fetch all products at once
        const products = await Product.find({ _id: { $in: productIds } });
        
        // Create a map for quick product lookup
        const productMap = new Map(products.map(product => [product._id.toString(), JSON.parse(JSON.stringify(product))]));
        
        // Enhance cart items with product details
        const enhancedCartItems = cart.cartItems.map(item => {
            const product = productMap.get(item.productId.toString());
            return {
                productId: item.productId,
                qty: item.qty,
                stockId: item.stockId || null,
                product: product || null
            };
        });
        
        // Convert cart to plain object and update cartItems
        const cartObject = JSON.parse(JSON.stringify(cart));
        cartObject.cartItems = enhancedCartItems;
        
        return { cartData: cartObject }
    } catch (error) {
        console.log(error);
        return { cart: null }
    }
}
export const actions = {
    getHash: async ({ request, locals }) => {
        try {
            const body = Object.fromEntries(await request.formData());
            // console.log("bodybody",body);

            let parsedBody = JSON.parse(body.orderdetails);

            parsedBody = parsedBody.map((item) => ({
                componentId: item._id,
                stockId: item.stock._id,
                orderQty: item.qty,
                manufacturerProductName: item.productName,
                manufacturerName: item.manufacturerName,
                unitPrice:item.unitPrice
            }))
            // console.log('----parsedBody---', parsedBody);

            const data = {
                orderdetails: parsedBody,
                userId: locals?.authedUser?.id || '',
                userEmail: locals?.authedUser?.email || '',
                firstname:body.firstname,
                lastname:body.lastname,
                billingAddress:body.billingAddress,
                shipmentAddress:body.shipmentAddress,
                totalprice:body.totalprice,
                phoneNumber:body.phoneNumber,
                taxNumber:body.taxNumber ? body.taxNumber : ""
            };

            // console.log('parsedBody', data);
            const order = await createOrder(data);

            if (order._id) {
                return { success: true, orderId: order.orderid, email: order.email }
            } else {
                return { success: false }
            }

        } catch (error) {
            //console.log('error', error);
            return { err: error.response.message };
        }
    },

    shippingaddress: async ({ request }) => {
        let body = Object.fromEntries(await request.formData());
        // console.log(" in shipping", body);
        return await updateShippingAddressCart(body);
    },

    billingaddress: async ({ request }) => {
        let body = Object.fromEntries(await request.formData());
        console.log("in billing", body);
        return await updateBillingAddressCart(body);
    },
};
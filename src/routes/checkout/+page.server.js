import { API_URL } from "$env/static/private"
import { token } from '$lib/server/utils/jwtToken.js';
import Cart from '$lib/server/models/Cart.js'
import Profile from '$lib/server/models/Profile.js';
import { createOrder, updateBillingAddressCart, updateShippingAddressCart } from '$lib/server/mongoActions.js';

export async function load({ locals }) {
    try {

        const userId = locals?.authedUser?.id || ""
        if (!userId) {
            let cartData
            return { cartData: [] }
        }
        // console.log("userId",userId);
        const cart = await Cart.findOne({ userId: userId });
        // console.log("cart ietms fectehdd",cart);

        const fetchUrl = `${API_URL}/cart`;

        const res = await fetch(fetchUrl, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(cart.cartItems)
        });
        // console.log("resresresresresresresresresresresresres", res);

        if (!res.ok) {
            return { success: false, error: "Failed to check parts availability" };
        }

        const cartData = await res.json();
        // console.log("data in cart page seever ", cartData);
        return { cartData }

    } catch (error) {
        console.log(error);
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
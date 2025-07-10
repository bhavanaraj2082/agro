import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
   cartItems:{type: mongoose.Schema.Types.Mixed, },
   userId:{
     type:String
   },
   userEmail:{
    type:String
   },
   isActive :{
    type:Boolean  
   },
},
{
    timestamps:true,
    collection:"carts"
})
delete mongoose.models.Cart
const Cart = mongoose.models.Cart || mongoose.model("Cart",cartSchema)
export default Cart

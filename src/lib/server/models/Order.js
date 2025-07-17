import mongoose from 'mongoose';
import mongooseSequence from 'mongoose-sequence';

const orderDetailsSchema = new mongoose.Schema({
    componentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "products"
    },
    unitPrice: {
        type: Number,
    },
    orderQty: {
        type: Number,
    },
    _id: false
})

const OrdersSchema = new mongoose.Schema(
    {
        orderid: { type: Number, unique: true },
        Invoice: { type: String },
        totalprice: { type: Number },
        firstname:{ type: String },
        lastname:{ type: String },
        subtotalprice: { type: Number },
        shippingprice: { type: Number },
        phoneNumber:{type:String},
        orderdetails: [orderDetailsSchema],
        userId: { type: String },
        userEmail: { type: String },
        profileid: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile' },
        shipmentAddress: {
            type: String
        },
        billingAddress: {
            type: String,
        },
        taxNumber: {
            type: String
        },
    },
    {
        timestamps: true,
        collection: 'orders'
    }
);

delete mongoose.models.Order
export const Order = mongoose.models.Order || mongoose.model('Order', OrdersSchema);
export default Order;
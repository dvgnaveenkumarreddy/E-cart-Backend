const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;
const ProductCartSchema = new mongoose.Schema({
    prduct: {
        type: ObjectId,
        ref: "Product"
    },
    name: String,
    count: Number,
    price: Number
});

const productCart = mongoose.model("ProductCart", ProductCartSchema)
const orderSchema = new mongoose.Schema({
    products: [ProductCartSchema],
    transactionId: {},
    amount: {
        type: Number
    },
    adress: String,
    status: {
        type: String,
        default: 'Recieved',
        enum: ['Cancelled', 'Delivered', 'Shipped', 'Processing', 'Recieved']
    },
    updates: Date,
    user: {
        type: ObjectId,
        ref: "User",
    }
}, { timestamps: true });
const order = mongoose.model("Order", orderSchema);


module.exports = { order, productCart };
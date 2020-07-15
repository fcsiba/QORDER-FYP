const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
    Customer_id: {
        ref: 'customer',
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    Waiter: {
        type: String,
        trim: true
    },
    Status: {
        type: String,
        default: 'inque'
    },
    paid: {
        type: String,
        default: 'UNPAID'
    },
    Item: [{
        Item_id: {
            ref: 'Item',
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        Qty: {
            type: Number,
            required: true
        }
    }]
}, {
    timestamps: true
});

const Order = mongoose.model("Order", OrderSchema);

module.exports = Order;
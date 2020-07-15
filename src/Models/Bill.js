const mongoose = require("mongoose");

const BillSchema = new mongoose.Schema({
    Customer_id: {
        ref: 'customer',
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    total: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
});

const Bill = mongoose.model("Bill", BillSchema);

module.exports = Bill;
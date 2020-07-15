const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema({
    Bill_id: {
        ref: 'Bill',
        type: mongoose.Schema.Types.ObjectId
    },
    Customer_id: {
        ref: 'customer',
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
}, {
    timestamps: true
});

const Notification = mongoose.model("Notification", NotificationSchema);

module.exports = Notification;

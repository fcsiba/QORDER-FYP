const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
    Name: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    Item: [{
        ItemID: {
            ref: 'Item',
            type: mongoose.Schema.Types.ObjectId,
            required: true
        }
    }]

}, {
    timestamps: true
});


const Category = mongoose.model("category", categorySchema);

module.exports = Category;

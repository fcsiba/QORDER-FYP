const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema({
    ItemName: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        min: 0,
        validate(value) {
            if (value < 0) {
                throw new Error('Price Could not be in negative');
            }
        }
    },
    serve: {
        type: Number
    }
}, {
    timestamps: true
});

const item = mongoose.model('Item', ItemSchema);
module.exports = item;

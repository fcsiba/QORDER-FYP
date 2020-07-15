const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({

    Owner: {
        ref: 'Admins',
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },

    Token: [{
        token: {
            type: String,
            required: true
        },
        expiresIn: {
            type: Date,
            default: Date.now() + 24 * 60 * 60 * 1000
        }
    }]
},
    {
        timestamps: true
    })


const token = mongoose.model('Tokens', tokenSchema);
module.exports = token;
const mongoose = require("mongoose");
const validator = require("validator");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Tokens = require('./token');

const AdminSchema = new mongoose.Schema({
    FirstName: {
        type: String,
        required: true,
        trim: true
    },
    LastName: {
        type: String,
        required: true,
        trim: true
    },
    Birthday: {
        type: Date,
        required: true
    },
    Gender: {
        type: String,
        required: true
    },
    Phone: {
        type: Number,
        default: 0
    },
    Role: {
        type: String,
        required: true
    },
    Email: {
        type: String,
        required: true,
        unique: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email format not found!');
            }

        }
    },
    Password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7
    },
    Dp: {
        type: Buffer
    }
}, {
    timestamps: true
});

AdminSchema.methods.toJSON = function () {
    const Admin = this;
    const Adminobj = Admin.toObject();
    delete Adminobj.tokens;
    delete Adminobj.password;
    // delete Adminobj.profile;
    return Adminobj;
};

AdminSchema.virtual('token', {
    ref: 'Tokens',
    localField: '_id',
    foreignField: 'Owner'
});

AdminSchema.methods.generatejwt = async function () {
    const admin = this;
    let t;
    const findUserToken = await Tokens.findOne({ Owner: admin._id });
    if (!findUserToken) {
        t = new Tokens({ Owner: admin._id });
    }
    else {
        t = findUserToken;
    }
    const token = jwt.sign({ _id: admin._id }, process.env.JWT_SECRET, {
        expiresIn: "1 days"
    });
    t.Token = t.Token.concat({ token });

    await admin.save();
    await t.save();
    return token;
};

AdminSchema.statics.findbycredentials = async (Email, password) => {
    const admin = await Admin.findOne({ Email });
    if (!admin) {
        throw new error("Unable to login");
    }
    const match = await bcryptjs.compare(password, admin.Password);
    if (!match) {
        throw new error("Unable to login");
    }
    return admin;
};

//hash password before saving
AdminSchema.pre("save", async function (next) {
    const Admin = this;
    if (Admin.isModified("Password")) {
        Admin.Password = await bcryptjs.hash(Admin.Password, 8);
    }
    next();
});

const Admin = mongoose.model("Admin", AdminSchema);

module.exports = Admin;

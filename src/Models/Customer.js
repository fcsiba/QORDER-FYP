const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const customerSchema = new mongoose.Schema({
  tablecode: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true
  },
  phoneno: {
    type: String,
    required: true
  },
  Token: {
    type: String
  }
}, {
  timestamps: true
});

customerSchema.methods.toJSON = function () {
  const user = this;
  const userobj = user.toObject();
  return userobj;
};

customerSchema.methods.generatejwt = async function () {
  const customer = this;
  const token = jwt.sign({ phoneno: customer.phoneno }, process.env.JWT_SECRET, {
    expiresIn: '6h'
  });

  customer.Token = token;
  await customer.save();
  return token;
};
const Customer = mongoose.model("customer", customerSchema);

module.exports = Customer;

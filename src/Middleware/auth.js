const Admin = require("../Models/Admin");
const Token = require("../Models/token")
const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
  try {
    const token = await req.session.token;
    const decode = jwt.verify(token, process.env.JWT_SECRET);

    const admin = await Admin.findOne({ _id: decode._id });
    const t = await Token.find({ Owner: admin._id, 'Token.token': token, 'Token.expiresIn': { $gt: Date.now() } })
    if (!admin) {
      throw new Error();
    }
    req.token = t;
    req.admin = admin;
    next();
  } catch (e) {
    res.status(401).send({ error: "plz authenticate properly" });
  }
};

module.exports = auth;

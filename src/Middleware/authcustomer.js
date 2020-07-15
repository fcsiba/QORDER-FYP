const Customer = require('../Models/Customer')
const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
    try {
        const token = await req.session.token;
        const decode = jwt.verify(token, process.env.JWT_SECRET);

        const customer = await Customer.findOne({ phoneno: decode.phoneno });
        const t = await customer.Token;
        if (!customer) {
            throw new Error();
        }
        req.token = t;
        req.customer = customer;
        next();
    } catch (e) {
        res.status(401).send({ error: "plz authenticate properly" });
    }
};

module.exports = auth;

const role = async (req, res, next) => {
    try {
        if (req.admin.Role === 'Chef') {
            res.redirect("/chiefScreen");
        }
        next();
    } catch (e) {
        // res.status(401).send({ error: "plz authenticate properly" });
    }
};

module.exports = role;

const express = require("express");
const auth = require('../middleware/auth');
const router = new express.Router();

router.get("/*", auth, async (req, res) => {

    try {
        res.render('404');
    } catch (e) {
        res.send(e);
    }
});


module.exports = router;
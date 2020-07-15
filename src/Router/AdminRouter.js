const express = require("express");
const Admin = require("../Models/Admin");
const Bill = require('../Models/Bill');
const Order = require('../Models/Order')
const Notification = require('../Models/Notification')


const roles = require('../Middleware/Roles')
const auth = require("../Middleware/auth");
const router = express.Router();

router.get("/Admin/login", (req, res) => {
  res.render("login");
});

router.get("/Admin/signup", (req, res) => {
  res.render("signup");
});

router.post("/Admin/Signup", async (req, res) => {
  const admin = new Admin(req.body);
  try {
    await admin.save();
    const token = await admin.generatejwt();
    req.session.token = await token;
    res.redirect("/dashboard");
  } catch (e) {
    res.send(e);
  }
});

router.post("/Admin/Login", async (req, res) => {
  try {
    const result = await Admin.findbycredentials(
      req.body.Email,
      req.body.Password
    );
    if (!result) {
      return res.redirect("/Admin/Login");
    }
    const token = await result.generatejwt();
    req.session.token = await token;
    res.redirect("/dashboard");
  } catch (e) {
    res.send(e);
  }
});

router.get("/dashboard", auth, roles, async (req, res) => {
  try {
    const countallorder = await Order.countDocuments({})
    const countallpaid = await Order.countDocuments({ paid: 'Cash' })
    const countallcheque = await Order.countDocuments({ paid: 'Cheque' })
    const countallunpaid = await Order.countDocuments({ paid: 'UNPAID' })

    orderdetail = {
      countallorder, countallpaid: countallcheque + countallpaid, countallunpaid
    }
    const bills = await Bill.find({});
    if (bills.length > 0) {
      count = 0;
      bill = []

      bills.forEach(async bil => {
        await bil.populate("Customer_id").execPopulate();
        bill = bill.concat({ bil })
        ++count
        if (count == bills.length) {
          res.render("dashboard", { bill, orderdetail });
        }
      })

    } else {
      res.render("dashboard");
    }
  } catch (e) {
    console.log(e)
  }
});



router.get('/print/:id', auth, async (req, res) => {
  try {

    if (!req.params.id) {
      res.redirect('/dashboard')
    }
    order = await Order.findOne({ Customer_id: req.params.id });
    await order.populate("Item.Item_id").execPopulate();

    const bill = await Bill.findOne({ Customer_id: req.params.id })
    await bill.populate("Customer_id").execPopulate();
    res.render("print", { bill, order });
  } catch (e) {
    res.send(e);
  }
})
router.get('/Notification', auth, async (req, res) => {
  const notitfications = await Notification.find({});
  let length = notitfications.length;
  if (length > 0) {
    let count = 0;
    let not = []
    notitfications.forEach(async notification => {
      await notification.populate("Customer_id").execPopulate();
      if (notification.Bill_id) {
        await notification.populate("Bill_id").execPopulate();
      }
      not = not.concat({ notification })
      ++count

      if (count == length) {

        res.render('Notification', { not })
      }
    })
  } else {
    res.render('Notification')
  }
})

router.get('/Logout', auth, async (req, res) => {
  try {

    let token = await Token.findOne({ Owner: req.admin._id });
    token.Token = token.Token.filter((value) => {
      return value.token !== req.session.token;
    });

    await token.save();
    req.session.token = await null;
    await req.session.destroy();
    res.redirect('/Admin/login');

  } catch (e) {
    console.log(e)
    res.redirect('/Admin/login');
  }
})

module.exports = router;

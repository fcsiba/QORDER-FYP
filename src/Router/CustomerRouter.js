const express = require("express");
const mongoose = require("mongoose");

const router = new express.Router();
const Category = require("../Models/Category");
const Order = require("../Models/Order");
const Customer = require("../Models/Customer");
const Bill = require('../Models/Bill');

//Middleware check for user token
const authcustomer = require("../Middleware/authcustomer");

// signup page for customer public access
router.get("", (req, res) => {
  res.render("customersignup");
});

// Signup post request for new customer
router.post("/customer/signup", async (req, res) => {
  const customer = new Customer(req.body);
  try {
    const token = await customer.generatejwt();
    req.session.token = await token;
    res.redirect("/customer");
  } catch (e) {
    res.send(e);
  }
});

// customer order page
router.get("/customer", authcustomer, async (req, res) => {
  try {
    let count = 0;
    let listitem = [];
    const category = await Category.find({});
    if (category.length <= 0) {
      res.render("order");
    } else {
      category.forEach(async (cat) => {
        await cat.populate("Item.ItemID").execPopulate();
        listitem.push({ Name: cat.Name, item: cat.Item });
        ++count;
        if (count == category.length) {
          res.render("order", { listitem });
        }
      });
    }
  } catch (e) {
    res.send(e);
  }
});

// customer order
router.post("/customer/order", authcustomer, async (req, res) => {
  let num = Object.keys(req.body).length;
  if (num == 0) {
    res.redirect("/customer");
  } else {
    order = await Order.findOne({ Customer_id: req.customer._id });
    if (order) {
      try {
        if (Array.isArray(req.body.id)) {
          num = req.body.id.length;
          for (let i = 0; i < num; i++) {
            order.Item = order.Item.concat({
              Item_id: req.body.id[i],
              Qty: req.body.Qty[i],
            });
          }
        } else {
          order.Item = order.Item.concat({
            Item_id: req.body.id,
            Qty: req.body.Qty,
          });
        }

        await order.save();
        res.redirect("/customer/order");
      } catch (e) {
        res.send(e);
      }
      //update the old one
    } else {
      //creating new order
      const order = new Order({ Customer_id: req.customer.id });
      try {
        if (Array.isArray(req.body.id)) {
          num = req.body.id.length;
          for (let i = 0; i < num; i++) {
            order.Item = order.Item.concat({
              Item_id: req.body.id[i],
              Qty: req.body.Qty[i],
            });
          }
        } else {
          order.Item = order.Item.concat({
            Item_id: req.body.id,
            Qty: req.body.Qty,
          });
        }

        await order.save();
        res.redirect("/customer/order");
      } catch (e) {
        res.send(e);
      }
    }
  }
});

router.get("/customer/order", authcustomer, async (req, res) => {
  try {
    order = await Order.findOne({ Customer_id: req.customer._id });
    await order.populate("Customer_id").execPopulate();
    await order.populate("Item.Item_id").execPopulate();
    res.render("customerorder", order);
  } catch (e) {
    res.send(e);
  }
});

router.get("/customer/bill", authcustomer, async (req, res) => {
  try {
    order = await Order.findOne({ Customer_id: req.customer._id });
    await order.populate("Item.Item_id").execPopulate();

    const bill = await Bill.findOne({ Customer_id: req.customer._id })
    await bill.populate("Customer_id").execPopulate();
    res.render("bill", { bill, order });
  } catch (e) {
    res.send(e);
  }
});

router.get('/customer/getorder', authcustomer, async (req, res) => {
  try {
    total = 0;
    order = await Order.findOne({ Customer_id: req.customer._id });
    await order.populate("Customer_id").execPopulate();
    await order.populate("Item.Item_id").execPopulate();
    order.Item.forEach(item => {
      total += item.Item_id.price * item.Qty
    })
    const bill = new Bill({ Customer_id: req.customer._id, total })
    await bill.populate("Customer_id").execPopulate();
    await bill.save()
    res.send(bill)

  } catch (e) {
    res.send(e)
  }

})

router.post('/requestbill', authcustomer, async (req, res) => {
  res.redirect('/customer/bill')
})

module.exports = router;

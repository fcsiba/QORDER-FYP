const express = require('express');
const auth = require('../middleware/auth');

const router = express.Router();
const Category = require('../Models/Category')
const Item = require('../Models/Item');
const Order = require('../Models/Order')



router.get('/menu', auth, async (req, res) => {
    try {
        let count = 0;
        let listitem = [];
        const category = await Category.find({});
        if (category.length <= 0) {
            res.render('menu');
        } else {
            category.forEach(async (cat) => {
                await cat.populate('Item.ItemID').execPopulate();
                listitem.push({ Name: cat.Name, item: cat.Item });
                ++count;
                if (count == category.length) {
                    res.render('menu', { listitem });
                }
            });
        }
    }
    catch (e) {
        res.send(e);
    }
});

router.post('/itemupdate', auth, async (req, res) => {
    try {
        if (Array.isArray(req.body._id)) {
            req.body._id.forEach(async (id, index) => {

                let item = await Item.findByIdAndUpdate(id,
                    {
                        ItemName: req.body.ItemName[index],
                        serve: req.body.serve[index],
                        price: req.body.price[index]
                    }
                )
                item.save()
            })
        } else {
            const item = await Item.findByIdAndUpdate(req.body._id, req.body)
            item.save()
        }
        res.redirect('/menu');
    }
    catch (e) {
        res.send(e);
    }
});

router.post('/deleteItem', auth, async (req, res) => {
    try {
        const cateory = await Category.find({ "Item.ItemID": req.body._id })
        cateory[0].Item.forEach(async (item) => {
            if (item.ItemID == req.body._id) {
                cateory[0].Item.pull({ _id: item._id })
                await cateory[0].save()
            }
        })

        await Item.findByIdAndDelete(req.body._id)
        res.redirect('/menu');
    }
    catch (e) {
        res.send(e);
    }
});

router.post('/category', auth, async (req, res) => {
    const category = new Category(req.body);

    try {
        await category.save();
        res.redirect('/menu');

    }
    catch (e) {
        res.send(e);
    }
});

router.post('/item', auth, async (req, res) => {

    try {
        if (req.body.serve === '') {
            req.body.serve = 1
        }
        const item = new Item(req.body)
        const category = await Category.findOne({ Name: req.body.Name })
        category.Item = await category.Item.concat({ ItemID: item._id })

        await category.save();
        await item.save();
        res.redirect('/menu');
    }
    catch (e) {

        res.send(e);
    }
});


router.get('/orders', auth, async (req, res) => {
    try {
        orders = await Order.find({});
        let ord = []
        let count = 0
        if (orders.length <= 0) {
            res.render('orders');
        } else {
            orders.forEach(async order => {
                await order.populate('Customer_id').execPopulate()
                await order.populate('Item.Item_id').execPopulate()
                ord = ord.concat({ order })
                ++count;
                if (count == orders.length) {
                    res.render('orders', { ord });
                }
            })
        }
    }
    catch (e) {
        res.send(e);
    }
});

router.post('/Pay', auth, async (req, res) => {
    console.log(req.body)
    const order = await Order.findById(req.body.myId)
    order.paid = req.body.val
    await order.save()
    res.send(order)
})

router.get('/chief', auth, async (req, res) => {
    try {
        orders = await Order.find({});
        let ord = []
        let count = 0
        if (orders.length <= 0) {
            res.render('chief');
        } else {
            orders.forEach(async order => {
                await order.populate('Customer_id').execPopulate()
                await order.populate('Item.Item_id').execPopulate()
                ord = ord.concat({ order })
                ++count;
                if (count == orders.length) {
                    res.render('chief', { ord });
                }
            })
        }
    }
    catch (e) {
        res.send(e);
    }
});

router.get('/chiefScreen', auth, async (req, res) => {
    try {
        orders = await Order.find({});
        let ord = []
        let count = 0
        if (orders.length <= 0) {
            res.render('cheifscreen');
        } else {
            orders.forEach(async order => {
                await order.populate('Customer_id').execPopulate()
                await order.populate('Item.Item_id').execPopulate()
                ord = ord.concat({ order })
                ++count;
                if (count == orders.length) {
                    res.render('cheifscreen', { ord });
                }
            })
        }
    }
    catch (e) {
        res.send(e);
    }
});



module.exports = router;
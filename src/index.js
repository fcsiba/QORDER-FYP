const express = require("express");
const http = require('http')
const path = require("path");
const hbs = require("hbs");
const session = require('express-session');
const mongoose = require('mongoose');
const sessionStore = require('connect-mongo')(session);
const flash = require('connect-flash');
const socketio = require('socket.io');


require("./db/mongoose");

const Order = require('./Models/Order');
const Bill = require('./Models/Bill');
const Notification = require('./Models/Notification')


const CustomerRouter = require("./Router/CustomerRouter");
const AdminRouter = require("./Router/AdminRouter");
const ResturentRouter = require("./Router/ResturentRouter");
const StatusRouter = require("./Router/Status");

const app = express();
const server = http.createServer(app)
const io = socketio(server)
const port = process.env.PORT || 3000;

const pathroutetopublic = path.join(__dirname, "../public");

const viewhbs = path.join(__dirname, "../templete/view");

const hbspartial = path.join(__dirname, "../templete/partial");

app.set("view engine", "hbs");
app.set("views", viewhbs);

// for patial views like header and footer
hbs.registerPartials(hbspartial);
// use for static assests
app.use(express.static(pathroutetopublic));



app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({

    store: new sessionStore({ mongooseConnection: mongoose.connection }),
    name: 'Qorder',
    resave: false,
    saveUninitialized: false,
    secret: process.env.SSECRECT,
    maxAge: 86400000,

    cookie: {
        maxAge: 86400000,
        sameSite: true,
        secure: false
    }




}));
app.use(flash())
app.use(CustomerRouter);
app.use(AdminRouter);
app.use(ResturentRouter);
app.use(StatusRouter);



io.on('connection', (socket) => {
    // console.log('user add')

    socket.on('updatecus', async data => {
        const change = await Order.findById(data.myId)
        change.Status = data.val
        await change.save()

        if (data.val === 'ready') {
            await change.populate("Customer_id").execPopulate();
            const notification = new Notification(
                {
                    Customer_id: change.Customer_id._id
                })
            notification.save()
            io.emit('sendnotification', change)
        }
        io.emit('customerupdate', data)
    })

    socket.on('Requestbill', async data => {
        // console.log(data)
        const notification = new Notification(
            {
                Bill_id: data._id,
                Customer_id: data.Customer_id._id
            })
        notification.save()
        io.emit('sendnotification', data)
    })
})


server.listen(port, () => {
    console.log("start server at port " + port);
});

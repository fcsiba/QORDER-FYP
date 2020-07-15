

const socket = io()

$(document).ready(function () {
    $('.status').on('change', function () {
        val = this.value
        var myId = $(this).attr('id');
        update = { val, myId }
        socket.emit('updatecus', update)

    });

    $('.payment').on('change', function () {
        val = this.value
        var myId = $(this).attr('id');
        data = { val, myId }

        $.post("/Pay", data, function (data, status) {
        });
    });
});

md = {
    showNotification: function (from, align, html) {
        type = ['', 'info', 'danger', 'success', 'warning', 'rose', 'primary'];

        color = Math.floor((Math.random() * 6) + 1);

        $.notify({
            icon: "add_alert",
            message: html

        }, {
            type: type[color],
            timer: 3000,
            placement: {
                from: from,
                align: align
            }
        });
    }
}
socket.on('sendnotification', (data) => {

    if (data.total) {
        const messageTemplate = document.querySelector('#Notification-template').innerHTML
        const html = Mustache.render(messageTemplate, {
            table: data.Customer_id.tablecode,
            Name: data.Customer_id.name,
            total: data.total
        })
        md.showNotification('bottom', 'right', html)

    } else {

        const messageTemplate = document.querySelector('#Notification-ready-template').innerHTML
        const html = Mustache.render(messageTemplate, {
            table: data.Customer_id.tablecode,
            Name: data.Customer_id.name,
        })
        md.showNotification('bottom', 'right', html)
    }


})



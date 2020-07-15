const socket = io()

$(document).ready(function () {
    $('.status').on('change', function () {
        console.log('dsasd')
        val = this.value
        var myId = $(this).attr('id');
        update = { val, myId }
        socket.emit('updatecus', update)

    });
});
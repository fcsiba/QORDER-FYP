const socket = io()

billrequest = (event) => {
    event.preventDefault();
    // href="/customer/bill" 
    $.get('/customer/getorder', undefined, (data, status, xhr) => {
        if (status === 'success') {
            socket.emit('Requestbill', data)
        }
    })
    const form = document.getElementById('billform-form')
    form.submit();

}

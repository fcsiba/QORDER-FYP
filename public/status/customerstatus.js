
socket.on('customerupdate', (data) => {
    const $messages = document.getElementById(data.myId)
    console.log(data)
    let messageTemplate = ''
    if (data.val == 'inque') {
        messageTemplate = document.querySelector('#inque-template').innerHTML
    } else if (data.val == 'onstove') {
        messageTemplate = document.querySelector('#onstove-template').innerHTML
    } else {
        messageTemplate = document.querySelector('#readytoserve-template').innerHTML
    }
    const olstatus = document.querySelector('#status')
    olstatus.remove()
    const html = Mustache.render(messageTemplate, {
        status: data.val
    })
    $messages.insertAdjacentHTML('beforeend', html)
})

billrequest = (event) => {
    event.preventDefault();
    $.get('/customer/getorder', undefined, (data, status, xhr) => {
        if (status === 'success') {
            socket.emit('Requestbill', data)
        }
    })
    const form = document.getElementById('billform-form')
    form.submit();
}
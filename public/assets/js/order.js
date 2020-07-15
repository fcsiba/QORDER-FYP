function downup() {

    console.log('dadsgv')

}

function orderformsubmit() {
    const inputs = document.querySelectorAll('.ïnputform')

    inputs.forEach(inp => {
        inp.removeAttribute('disabled')
    })
}

const element = document.querySelectorAll('.edit');

element.forEach(el => el.addEventListener('click', event => {
    event.preventDefault()
    event.target.parentElement.parentElement.children[0].children[0].removeAttribute("disabled");
    event.target.parentElement.parentElement.children[0].children[1].removeAttribute("disabled");
    event.target.parentElement.parentElement.children[1].children[0].removeAttribute("disabled");
    event.target.parentElement.parentElement.children[2].children[0].removeAttribute("disabled");

}));

ondelete = (event) => {
    event.preventDefault();
    const form = document.getElementById('delete-form')
    console.log(event.target.parentElement.parentElement.children[0].children[0].value)
    form.children[0].value = event.target.parentElement.parentElement.children[0].children[0].value;
    form.submit();

}



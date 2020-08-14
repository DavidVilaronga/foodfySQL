const modalOverlay = document.querySelector('.modal_overlay')
const items = document.querySelectorAll('.receita')
const ingredientsDetail = document.querySelector('.ingredients_detail')
const preparationDetail = document.querySelector('.preparation_detail')
const informationDetail = document.querySelector('.information_detail')
const show1 = document.querySelector('.show_1')
const show2 = document.querySelector('.show_2')
const show3 = document.querySelector('.show_3')


for (let item of items) {
    item.addEventListener("click", function(){
        const recipeId = item.getAttribute('id')
        window.location.href = `/detail/${recipeId}`
    })
}



show1.addEventListener('click', function(){
    if (show1.innerHTML=="MOSTRAR") {
        ingredientsDetail.classList.remove('hide')
        show1.innerHTML = "ESCONDER"

    } else {
        ingredientsDetail.classList.add('hide')
        show1.innerHTML = "MOSTRAR"
    }
})

show2.addEventListener('click', function(){
    if (show2.innerHTML=="MOSTRAR") {
        preparationDetail.classList.remove('hide1')
        
        show2.innerHTML = "ESCONDER"
    } else {
        preparationDetail.classList.add('hide1')
        show2.innerHTML = "MOSTRAR"
    }
})

show3.addEventListener('click', function(){
    if (show3.innerHTML=="MOSTRAR"){
        informationDetail.classList.remove('hide2')
        show3.innerHTML = "ESCONDER"
    } else {
        informationDetail.classList.add('hide2')
        show3.innerHTML = "MOSTRAR"
    }
})
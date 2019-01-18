import { hiddenShowLoader } from './loader.js';

export const renderHeroesList = heroesArray => {
    document.querySelector('#homePage').insertAdjacentHTML('beforeend',  `
        <div class="heroes">
            ${heroesArray.map((hero, key) => 
                `<div key=${key} class="heroes__item" id='${hero.name}')">
                    <img class="heroes__img" src="${hero.image}" alt="${hero.name}" />
                    <div class="heroes__textWrapper">
                        <h1 class="heroes__title">${hero.name}</h1>
                        <p class="heroes__price">Cena Wynajmu ${hero.price} zł/h</p>
                    </div>
                </div>`
            ).join('')}
        </div>
    `);
    hiddenShowLoader();
};

export const renderHeroDetails = (hero, cartArray = []) => {
    document.querySelector('body').insertAdjacentHTML('afterbegin', `
        <div class="hero">
            <div class="hero__wrapper">
                <img class="hero__img" src="${hero.image}" alt="${hero.name}" />
                <div class="hero__content">
                    <h1 class="hero__title">i'm the ${hero.name}!</h1>
                    <p class="hero__description">${hero.description}</p>
                    <span class="hero__price">Cena Wynajmu: ${hero.price} zł/h</span>
                    ${hero.isAvailable && ((cartArray.findIndex(cartItem => cartItem.name === hero.name)) === -1) ? `<button class="hero__btn">dodaj do koszyka</button>` : `<span class="hero__status">bohater chwilo nie dostepny</span>`}
                </div>
                <button class="hero__close"></span>
            </div>
        </div>
    `);
    hiddenShowLoader();
};


// add to DOM cart main element
export const renderCartMain = cartArray => {
    document.querySelector('.cart').insertAdjacentHTML('beforeend', `     
        <div class="cart__main">
            ${!cartArray[0]? 'Twój koszyk jest pusty.' : renderCartContent(cartArray)}
        </div>  
    `);
};

//rendering all cart content items
const renderCartContent = cartArray => {
    return cartArray.map((cartItem, key) => `
        <div class="cart__item">
            <img class="cart__img" src="${cartItem.image}" alt="${cartItem.name}" />
            <div class="cart__itemContent">
                <h3 class="cart__title">${cartItem.name}</h3>
                <p class="cart__description">${cartItem.description}</p>
                <button id="${key}" class="cart__btn">
                    <span class="cart__btnText">usuń z koszyka</span>
                    <span class="cart__btnIcon"></span>
                </button>
            </div>
        </div> 
    `).join('');
};

export const renderCartValue = cartArray => {
    let cartValue =  0;
    cartArray.forEach(cartItem => {cartValue += parseInt(cartItem.price)});
    document.querySelector('.cart__value').textContent = cartValue + ',00 zł';
}

export const renderSelectListToForm = heroesList => {
    document.querySelectorAll('#editHeroForm h1, #deleteHeroForm h1').forEach(form => {
        form.insertAdjacentHTML("afterend", `
            <select name="select" class="form__select">
                ${heroesList.map(hero => (`
                    <option value="${hero.name}">${hero.name}</option>
                `)).join('')}
            </select>
        `);
    });
    hiddenShowLoader();
};
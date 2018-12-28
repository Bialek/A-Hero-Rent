// mobile menu script
document.querySelector('.nav__mobile').addEventListener('click', () => {
    const nav = document.querySelector('.nav');
    nav.classList.contains('nav--active') ? nav.classList.remove('nav--active') : nav.classList.add('nav--active');
});

// default heroes database and creating default localstorage arrays (heroes, cart) 
const loadDefaultHeroes = () => {
    const defaultHeroes = [
        {
            name: 'Superman',
            description: 'Et veniam anim qui proident cupidatat excepteur incididunt sint deserunt non.Officia commodo in nulla exercitation cupidatat nisi mollit.Velit excepteur cillum aute aliquip laborum veniam sunt dolore aliquip est magna aute tempor.Deserunt veniam adipisicing proident ipsum.',
            image: './images/superman.jpg',
            price: '3500',
            isAvailable: true
         },
         {
            name: 'Hulk',
            description: 'Et veniam anim qui proident cupidatat excepteur incididunt sint deserunt non.Officia commodo in nulla exercitation cupidatat nisi mollit.Velit excepteur cillum aute aliquip laborum veniam sunt dolore aliquip est magna aute tempor.Deserunt veniam adipisicing proident ipsum.',
            image: './images/hulk.jpg',
            price: '25000',
            isAvailable: false
         },
         {
            name: 'Thor',
            description: 'Et veniam anim qui proident cupidatat excepteur incididunt sint deserunt non.Officia commodo in nulla exercitation cupidatat nisi mollit.Velit excepteur cillum aute aliquip laborum veniam sunt dolore aliquip est magna aute tempor.Deserunt veniam adipisicing proident ipsum.',
            image: './images/thor.jpg',
            price: '55000',
            isAvailable: true
         },
         {
            name: 'Ironman',
            description: 'Et veniam anim qui proident cupidatat excepteur incididunt sint deserunt non.Officia commodo in nulla exercitation cupidatat nisi mollit.Velit excepteur cillum aute aliquip laborum veniam sunt dolore aliquip est magna aute tempor.Deserunt veniam adipisicing proident ipsum.',
            image: './images/ironman.jpg',
            price: '75000',
            isAvailable: true
         },
         {
            name: 'Potter',
            description: 'Et veniam anim qui proident cupidatat excepteur incididunt sint deserunt non.Officia commodo in nulla exercitation cupidatat nisi mollit.Velit excepteur cillum aute aliquip laborum veniam sunt dolore aliquip est magna aute tempor.Deserunt veniam adipisicing proident ipsum.',
            image: './images/potter.jpg',
            price: '125000',
            isAvailable: true
         },
         {
            name: 'Batman',
            description: 'Et veniam anim qui proident cupidatat excepteur incididunt sint deserunt non.Officia commodo in nulla exercitation cupidatat nisi mollit.Velit excepteur cillum aute aliquip laborum veniam sunt dolore aliquip est magna aute tempor.Deserunt veniam adipisicing proident ipsum.',
            image: './images/batman.jpg',
            price: '2000',
            isAvailable: false
         } 
    ];
    localStorage.setItem('heroes', JSON.stringify(defaultHeroes)); 
};

localStorage.setItem('cart', []); 
loadDefaultHeroes();

//heroes list and hero detail script 
const innerHeroes = () => {
    if (localStorage.heroes !== '') {
        const heroes = JSON.parse(localStorage.getItem('heroes'));
        document.querySelector('.main').innerHTML = `
            <div class="heroes">
                ${heroes.map((hero, k) => 
                    `<div key=${k} class="heroes__item" onclick="heroDetails(${k})">
                        <img class="heroes__img" src=${hero.image} alt=${hero.name} />
                        <div class="heroes__textWrapper">
                            <h1 class="heroes__title">${hero.name}</h1>
                            <p class="heroes__price">Cena Wynajmu ${hero.price} zł/h</p>
                        </div>
                    </div>`
                ).join('')}
            </div>
        `;
    }
    cartRender();
};

const heroDetails = (id, cartArray = []) => {
    const hero = JSON.parse(localStorage.getItem('heroes'))[id];
    if (localStorage.cart[0]) {
        cartArray = JSON.parse(localStorage.getItem('cart'));
    }
    document.querySelector('body').insertAdjacentHTML('afterbegin', `
        <div class="hero">
            <div class="hero__wrapper">
                <img class="hero__img" src=${hero.image} alt=${hero.name} />
                <div class="hero__content">
                    <h1 class="hero__title">i'm the ${hero.name}!</h1>
                    <p class="hero__description">${hero.description}</p>
                    <span class="hero__price">Cena Wynajmu: ${hero.price} zł/h</span>
                    ${hero.isAvailable && ((cartArray.findIndex(cartItem => cartItem.name === hero.name)) === -1) ? `<button onclick="addToCart(${id})" class="hero__btn">dodaj do koszyka</button>` : `<span>bohater chwilo nie dostepny</span>`}
                </div>
                <span onclick="closeDetails()" class="hero__close"></span>
            </div>
        </div>
    `);
};

const closeDetails = () => {
    document.querySelector('.hero').remove();
};

// cart script
const addToCart = (id) => {
    const hero = JSON.parse(localStorage.getItem('heroes'))[id];
    let oldCartArray = [];
    if (localStorage.cart !== '') {
        oldCartArray = JSON.parse(localStorage.getItem('cart'));
    }
    if ((oldCartArray.findIndex(cartItem => cartItem.name === hero.name)) === -1) { 
        const newCartArray = [...oldCartArray, hero];
        localStorage.setItem('cart', JSON.stringify(newCartArray)); 
        cartRender(newCartArray);
    }  
    closeDetails();
    heroDetails(id);
};

const cartRender = (cartArray = []) => {
    //remove old html cart
    const cart = document.querySelector('.cart');
    if (cart) {
        cart.remove();
    }

    if (localStorage.cart[0]) {
        cartArray = JSON.parse(localStorage.getItem('cart'));
    }

    let cartValue =  0;
    cartArray.map(cartItem => {cartValue += parseInt(cartItem.price)});

    const cartArrayRender = () => {
        return cartArray.map(cartItem => `
            <div class="cart__item">
                <img class="cart__img" src="${cartItem.image}" alt="${cartItem.name}">
                <div class="cart__itemContent">
                    <h3 class="cart__title">${cartItem.name}</h3>
                    <p class="cart__description">${cartItem.description}</p>
                    <button class="cart__btn">usuń z koszyka</button>
                </div>
            </div> 
        `).join('');
    }

    document.querySelector('.main').insertAdjacentHTML('afterbegin', `
        <div class="cart">
            <div class="cart__header">
                <h2 class="cart__text">koszyk</h2>
                <h2 class="cart__text">
                    do zapłaty: 
                    <span class="cart__value">${cartValue},00 zł</span>
                </h2>
            </div>
            <div class="cart__main">
                ${!cartArray[0]? 'Twój koszyk jest pusty.' : cartArrayRender()}
            </div>
        </div>    
    `);
};


// add hero script
const renderAddHeroPage = () => {
    document.querySelector('.main').innerHTML = `
        <form class="form" onsubmit="addHero()">
            <h1 class="form__title">Dodaj Herosa</h1>
            <input type="text" name="name" class="form__input" type="text" placeholder="Nazwa Bohatera" required>
            <input name="img" class="form__input" type="text" placeholder="Adres/nazwa zdjęcia">
            <input type="number" name="price" class="form__input" type="text" placeholder="Cena wynajmu /h" required>
            <textarea name="description" class="form__input" rows="3" placeholder="Opis Bohatera"></textarea>
            <span class="form__communicate"></span>
            <button class="form__btn" type="submit">Submit</button>
        </form>
    `
};

const addHero = (oldHeroesArray = []) => {
    event.preventDefault();
    if (localStorage.heroes[0]) {
        oldHeroesArray = JSON.parse(localStorage.getItem('heroes'));
    }    
    const communicate = document.querySelector('.form__communicate');
    if ((oldHeroesArray.findIndex(hero => hero.name === event.target[0].value)) === -1) {
        const newHero = {
            name: event.target[0].value,    
            image: event.target[1].value,
            price: event.target[2].value,
            description: event.target[3].value,
            isAvailable: true
        };
        const newHeroesArray = [...oldHeroesArray, newHero];
        localStorage.setItem('heroes', JSON.stringify(newHeroesArray));
        communicate.innerHTML="Bohater dodany do listy";
    } else {
        communicate.innerHTML="Bohater znajduje się już na liście";
    };
};

// clean heroes database
const cleanDB = () => {
    localStorage.setItem('heroes', []);
    localStorage.setItem('cart', []);
    document.querySelector('.heroes').remove();
};

// page content changing 
if (window.location.hash === '') {
    window.location.hash = '#/index';
};

const update_url = (url) => {
    window.location.hash = url;
};

const hashHandler = () => {
    const header = document.querySelector('.header');
    switch (window.location.hash) {
        case '#/add-hero':
           if (header.classList.contains('header--main')) header.classList.remove('header--main');    
           renderAddHeroPage();     
            break;

        case '#/clean-db':
            cleanDB();
            innerHeroes();
            break;

        case '#/load-default-hero':
            loadDefaultHeroes();
            break;

        default:
        case '#/index':
            if (!(header.classList.contains('header--main'))) header.classList.add('header--main');
            innerHeroes();
            break;
    }
};

window.addEventListener('hashchange', hashHandler, false);

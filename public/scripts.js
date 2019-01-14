let lastHeroFetched = [];
const URL = '/heroes/';
const loader = document.querySelector('.loader');

// mobile menu script
const openCloseMenu = () => {
    const nav = document.querySelector('.nav');
    nav.classList.toggle('nav--active');
} 
document.querySelector('.nav__mobile').addEventListener('click', openCloseMenu, false); 
//heroes list and hero detail script 

const fetchHeroes = () => {
    loader.classList.remove('hidden');
    return fetch('/heroes')
        .then(res => res.json())
        .then(data => { return data })
        .then(loader.classList.add('hidden'))
};

const addHeroesList = () => {
    fetchHeroes()
        .then(res => renderHeroesList(res))
}
const renderHeroesList = (heroesArray = []) => {
    document.querySelector('#homePage').insertAdjacentHTML('beforeend',  `
        <div class="heroes">
            ${heroesArray.map((hero, key) => 
                `<div key=${key} class="heroes__item" onclick="fetchHero('${hero.name}')">
                    <img class="heroes__img" src="${hero.image}" alt="${hero.name}" />
                    <div class="heroes__textWrapper">
                        <h1 class="heroes__title">${hero.name}</h1>
                        <p class="heroes__price">Cena Wynajmu ${hero.price} zł/h</p>
                    </div>
                </div>`
            ).join('')}
        </div>
    `)
}

const fetchHero = (name) => {
    fetch(URL + name)
        .then(res => res.json())
        .then(data => {
            renderHeroDetails(data)
            lastHeroFetched = data
        })
};

const renderHeroDetails = (hero, cartArray = []) => {
    if (localStorage.cart) {
        cartArray = JSON.parse(localStorage.getItem('cart'));
    }
    document.querySelector('body').insertAdjacentHTML('afterbegin', `
        <div class="hero">
            <div class="hero__wrapper">
                <img class="hero__img" src="${hero.image}" alt="${hero.name}" />
                <div class="hero__content">
                    <h1 class="hero__title">i'm the ${hero.name}!</h1>
                    <p class="hero__description">${hero.description}</p>
                    <span class="hero__price">Cena Wynajmu: ${hero.price} zł/h</span>
                    ${hero.isAvailable && ((cartArray.findIndex(cartItem => cartItem.name === hero.name)) === -1) ? `<button onclick="addToCart()" class="hero__btn">dodaj do koszyka</button>` : `<span class="hero__status">bohater chwilo nie dostepny</span>`}
                </div>
                <button onclick="closeDetails()" class="hero__close"></span>
            </div>
        </div>
    `);
}

const closeDetails = () => {
    document.querySelector('.hero').remove();
};

// cart script
const addToCart = (hero = lastHeroFetched, cartArray = []) => {
    //load data from localStorage
    if (localStorage.cart) {
        cartArray = JSON.parse(localStorage.getItem('cart'));
    }

    if ((cartArray.findIndex(cartItem => cartItem.name === hero.name)) === -1) { 
        const newCartArray = [...cartArray, hero];
        localStorage.setItem('cart', JSON.stringify(newCartArray)); 
        cartRender(newCartArray);
    }  
    closeDetails();
    renderHeroDetails(hero);
};

const cartRender = (cartArray = []) => {
    // remove old html cart
    const cart = document.querySelector('.cart__main');
    if (cart) {
        cart.remove();
    }
    // load data from localStorage
    if (localStorage.cart) {
        cartArray = JSON.parse(localStorage.getItem('cart'));
    }
    //sum all cart elements and render
    const cartValueRender = document.querySelector('.cart__value');
    let cartValue =  0;
    cartArray.forEach(cartItem => {cartValue += parseInt(cartItem.price)});
    cartValueRender.textContent = cartValue + ',00 zł';
    
    //rendering all cart elements
    const cartArrayRender = () => {
        return cartArray.map((cartItem, key) => `
            <div key=${key} class="cart__item">
                <img class="cart__img" src="${cartItem.image}" alt="${cartItem.name}" />
                <div class="cart__itemContent">
                    <h3 class="cart__title">${cartItem.name}</h3>
                    <p class="cart__description">${cartItem.description}</p>
                    <button class="cart__btn" onclick="removeFromCart(${key})">
                        <span class="cart__btnText">usuń z koszyka</span>
                        <span class="cart__btnIcon"></span>
                    </button>
                </div>
            </div> 
        `).join('');
    }
    //rendering cart  and main
    document.querySelector('.cart').insertAdjacentHTML('beforeend', `     
        <div class="cart__main">
            ${!cartArray[0]? 'Twój koszyk jest pusty.' : cartArrayRender()}
        </div>  
    `);
};

const removeFromCart = (id) => {
    //load data from localStorage
    const cartArray = JSON.parse(localStorage.getItem('cart'));
    //return cart item if key is different than id 
    const newCartArray = cartArray.filter((cartItem, key) => {
        if (key !== id) {
            return cartItem;
        }
    });
    localStorage.setItem('cart', JSON.stringify(newCartArray));
    cartRender();
}

// on submit form handler 

handlerOnSubmitForm = () => {
    event.preventDefault();
    switch (event.target.id) {
        case 'addHeroForm':
            fetchNewHero(event.target[0].value, event.target[1].value, event.target[2].value, event.target[3].value)     
            break;
        case 'editHeroForm':
            fetchEditHero(event.target[0].value, event.target[1].value, event.target[2].value, event.target[3].value);  
            break;
        case 'deleteHeroForm':
            fetchDeleteHero(event.target[0].value);
            break;
        default:
            break;
    }
}

document.querySelectorAll('.form').forEach(form => form.addEventListener('submit', handlerOnSubmitForm));
// add hero page script

const fetchNewHero = (name, image, price, description, isAvailable = true) => {
    fetch('/heroes', {
        headers: { "Content-Type": "application/json; charset=utf-8" },
        method: 'POST',
        body: JSON.stringify({
            name: name,    
            image: image,
            price: price,
            description: description,
            isAvailable: isAvailable
        })
    })
}

const fetchEditHero = (name, image, price, description,) => {
    fetch(URL + name, {
        headers: {"Content-type": "application/json; charset=utf-8" },
        method: 'PUT',
        body: JSON.stringify({
            name: name,
            image: image,
            price: price,
            description: description,
        })
    })
}

const fetchDeleteHero = (name = '') => {
    fetch(URL + name, {
        method: 'DELETE',
    })
}

//dynamic adding select hero list to edit and delete form 
const addSelectListToForm = () => {
    fetchHeroes()
    .then(res => renderSelectListToForm(res));
}

const renderSelectListToForm = (heroesList) => {
    document.querySelectorAll('#editHeroForm h1, #deleteHeroForm h1').forEach(form => {
        form.insertAdjacentHTML("afterend", `
            <select name="select" class="form__input">
                ${heroesList.map(hero => (`
                    <option value="${hero.name}">${hero.name}</option>
                `)).join('')}
            </select>
        `)
    })
}

// clean heroes database
const cleanDB = () => {
    fetchDeleteHero()
};
// default heroes database
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
//load default heroes db 
const loadDefaultDb = () => {
    defaultHeroes.forEach(hero => {
        fetchNewHero(hero.name, hero.image, hero.price, hero.description, hero.isAvailable);
    })
};

//menu link and changing page script
const hashHandler = () => {
    const header = document.querySelector('.header');
    switch (window.location.hash) {
        case '#/add-hero':
           header.classList.remove('header--main');   
           renderAddHeroPage();     
        break;
        case '#/edit-hero':
           header.classList.remove('header--main');   
           addSelectListToForm();
           renderEditHeroPage();     
        break;
        case '#/delete-hero':
            header.classList.remove('header--main');   
            addSelectListToForm();   
        break;
        case '#/clean-db':
            cleanDB();
            localStorage.clear();
            fetchHeroes();
            header.classList.add('header--main');
        break;
        case '#/load-default-hero':
            loadDefaultDb();
            fetchHeroes();
            header.classList.add('header--main');
        break;
        default:
        case '#/index':
            header.classList.add('header--main');
            addHeroesList();
        break;
    }
};
const init = () => {
    window.addEventListener('hashchange', hashHandler, false);
    
    //after page refresh always back or rerender index
    window.location.hash = '#/index';
    fetchHeroes();
}

init();

//add event listeners to a href
document.querySelectorAll('a[href').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.hash = `/${link.getAttribute('href')}`;
        openCloseMenu();
    });
});
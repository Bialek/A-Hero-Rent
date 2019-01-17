let lastHeroFetched = [];
const URL = '/heroes/';
const loader = document.querySelector('.loader');
let lastVisitedPage;
const homePage = document.querySelector('#homePage');
const addHeroPage = document.querySelector('#addHeroPage');
const editHeroPage = document.querySelector('#editHeroPage');
const deleteHeroPage = document.querySelector('#deleteHeroPage');

// mobile menu script
const openCloseMenu = () => {
    const nav = document.querySelector('.nav');
    nav.classList.toggle('nav--active');
} 
document.querySelector('.nav__mobile').addEventListener('click', openCloseMenu, false); 

// loader 
const hiddenShowLoader = () => {
    loader.classList.toggle('hidden')
}

//remove old html element 
const removeOldHtmlElement = (selector) => {
    document.querySelectorAll(`${selector}`).forEach(list => list.remove()); 
}
//heroes list and hero detail script 
const fetchHeroes = () => {
    hiddenShowLoader();
    return fetch('/heroes')
        .then(res => res.json())
        .then(data => { return data })
};
const addHeroesList = () => {
    fetchHeroes()
        .then(res => renderHeroesList(res))
        .then(cartRender());
}
const renderHeroesList = (heroesArray) => {
    removeOldHtmlElement('.heroes');
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
    `);
    hiddenShowLoader()
}

const fetchHero = (name) => {
    hiddenShowLoader();
    fetch(URL + name)
        .then(res => res.json())
        .then(data => {
            renderHeroDetails(data)
            lastHeroFetched = data
        });
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
    hiddenShowLoader();
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
    hiddenShowLoader();
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
    
    renderCartMain(cartArray);
};

// add to DOM cart main element
const renderCartMain = (cartArray) => {
    document.querySelector('.cart').insertAdjacentHTML('beforeend', `     
        <div class="cart__main">
            ${!cartArray[0]? 'Twój koszyk jest pusty.' : renderCartContent(cartArray)}
        </div>  
    `);
}

//rendering all cart content items
const renderCartContent = (cartArray) => {
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
    hiddenShowLoader();
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
    cleanInput();
    hiddenShowLoader();
}

document.querySelectorAll('.form').forEach(form => form.addEventListener('submit', handlerOnSubmitForm));

//clean input filds after sumit 
const cleanInput = () => {
    document.querySelectorAll('.form__input').forEach(input => {
        input.value = '';
    });
}

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
    .then(addSelectListToForm());
}

const fetchDeleteHero = (name = '') => {
    fetch(URL + name, {
        method: 'DELETE',
    })
    .then(addSelectListToForm());
}

//dynamic adding select hero list to edit and delete form 
const addSelectListToForm = () => {
    fetchHeroes()
    .then(res => renderSelectListToForm(res));
}

const renderSelectListToForm = (heroesList) => {
    document.querySelectorAll('.form__select').forEach(selectHtml => {
        selectHtml.remove();
    });
    document.querySelectorAll('#editHeroForm h1, #deleteHeroForm h1').forEach(form => {
        form.insertAdjacentHTML("afterend", `
            <select name="select" class="form__select">
                ${heroesList.map(hero => (`
                    <option value="${hero.name}">${hero.name}</option>
                `)).join('')}
            </select>
        `)
    });
    hiddenShowLoader();
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
const hiddenAllModals = () => {
    document.querySelectorAll('section').forEach(modal => modal.classList.add('hidden'));
}
//menu link and changing page script
const hashHandler = () => {
    const header = document.querySelector('.header');
    hiddenAllModals();  
    switch (window.location.hash) {
        case '#/add-hero':
           header.classList.remove('header--main');   
           addHeroPage.classList.remove('hidden');     
        break;
        case '#/edit-hero':
           header.classList.remove('header--main');   
           addSelectListToForm();
           editHeroPage.classList.remove('hidden');  
        break;
        case '#/delete-hero':
            header.classList.remove('header--main');   
            addSelectListToForm();   
            deleteHeroPage.classList.remove('hidden')
        break;
        case '#/clean-db':
            cleanDB();
            localStorage.clear();
            window.location.hash = '#/index';
        break;
        case '#/load-default-hero':
            loadDefaultDb();
            window.location.hash = '#/index';
        break;
        default:
        case '#/index':
            header.classList.add('header--main');
            addHeroesList();
            homePage.classList.remove('hidden')      
        break;
    }
};
const init = () => {
    window.addEventListener('hashchange', hashHandler, false);
    
    //after page refresh always back or rerender index
    window.location.hash = '#/index';
    addHeroesList();
}

init();

//add event listeners to a href
document.querySelectorAll('a[href').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.hash = `/${link.getAttribute('href')}`;
        if (link.getAttribute('href') !== 'index') {
            openCloseMenu();
        }    
    });
});
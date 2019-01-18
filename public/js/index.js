import { fetchHeroes, fetchHero, fetchNewHero, fetchEditHero, fetchDeleteHero } from './fetch.js';
import { hiddenShowLoader } from './loader.js';
import { renderHeroesList, renderHeroDetails, renderCartMain, renderCartValue, renderSelectListToForm } from './render.js';

//global variables
let lastHeroFetched = [];
const homePage = document.querySelector('#homePage');
const addHeroPage = document.querySelector('#addHeroPage');
const editHeroPage = document.querySelector('#editHeroPage');
const deleteHeroPage = document.querySelector('#deleteHeroPage');

// mobile menu script
const openCloseMenu = () => {
    const nav = document.querySelector('.nav');
    nav.classList.toggle('nav--active');
} 
document.querySelector('.nav__mobile').addEventListener('click', openCloseMenu); 

//remove old html element 
const removeOldHtmlElement = selector => {
    document.querySelectorAll(`${selector}`).forEach(list => list.remove()); 
}
//load data from local storage
const loadDataFromLocalStorage = () => {
    let cart = [];
    if (localStorage.cart) {
        cart = JSON.parse(localStorage.getItem('cart'));
    };
    return cart;
}

const displayHeroesList = () => {
    hiddenShowLoader();
    removeOldHtmlElement('.heroes');
    fetchHeroes()
        .then(data => renderHeroesList(data))
        .then(cartRender())
        .then(() => {
            document.querySelectorAll('.heroes__item').forEach(div => div.addEventListener('click', div => displayHeroDetails(div.target.alt)));
        });
};

const displayHeroDetails = name => {
    const cartArray = loadDataFromLocalStorage();
    fetchHero(name, cartArray)
        .then(data => {
            renderHeroDetails(data, cartArray);
            lastHeroFetched = data;
        })
        .then(() => addEventToHeroDetails());
}

const addEventToHeroDetails = () => {
    document.querySelectorAll('.hero__close').forEach(button => {
        button.addEventListener('click', closeDetails); 
    });
    document.querySelectorAll('.hero__btn').forEach(button => {
        button.addEventListener('click', () => addToCart());
    });
}

const closeDetails = () => {
    document.querySelector('.hero').remove();
};

const addToCart = (hero = lastHeroFetched, cartArray = []) => {
    cartArray = loadDataFromLocalStorage();
    if ((cartArray.findIndex(cartItem => cartItem.name === hero.name)) === -1) { 
        const newCartArray = [...cartArray, hero];
        localStorage.setItem('cart', JSON.stringify(newCartArray)); 
        cartRender(newCartArray);
        closeDetails();
        renderHeroDetails(hero, newCartArray);
        addEventToHeroDetails();
        hiddenShowLoader();
    };  
};

const cartRender = () => {
    // remove old html cart
    removeOldHtmlElement('.cart__main')
    const cartArray = loadDataFromLocalStorage();
    //sum all cart elements and render
    renderCartValue(cartArray);
    renderCartMain(cartArray);
    //add addEventListener
    document.querySelectorAll('.cart__btn').forEach(button => {
        button.addEventListener('click', button => {    
            removeFromCart(button.target.parentElement.id);    
        });
    });
};

const removeFromCart = id => {
    const cartArray = loadDataFromLocalStorage();
    //return cart item if key is different than id 
    const newCartArray = cartArray.filter((cartItem, key) => {
        if (key !== parseInt(id)) {
            return cartItem;
        }
    });
    localStorage.setItem('cart', JSON.stringify(newCartArray));
    cartRender();
};

// on submit form handler 

const handlerOnSubmitForm = () => {
    event.preventDefault();
    switch (event.target.id) {
        case 'addHeroForm':
            fetchNewHero(event.target[0].value, event.target[1].value, event.target[2].value, event.target[3].value)     
            break;
        case 'editHeroForm':
            fetchEditHero(event.target[0].value, event.target[1].value, event.target[2].value, event.target[3].value);  
            displaySelectListToForm();
            break;
        case 'deleteHeroForm':
            fetchDeleteHero(event.target[0].value);
            displaySelectListToForm();
            break;
        default:
            break;
    }
    cleanInput();
};

//clean input filds after sumit 
const cleanInput = () => {
    document.querySelectorAll('.form__input').forEach(input => {
        input.value = '';
    });
};

//dynamic adding select hero list to edit and delete form 
const displaySelectListToForm = () => {
    hiddenShowLoader();
    removeOldHtmlElement('.form__select');
    fetchHeroes()
    .then(data => {
        renderSelectListToForm(data);
    });
};



// clean heroes database
const cleanDB = () => {
    fetchDeleteHero();
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
    });
};
const hiddenAllModals = () => {
    document.querySelectorAll('section').forEach(modal => modal.classList.add('hidden'));
};
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
           displaySelectListToForm();
           editHeroPage.classList.remove('hidden');  
        break;
        case '#/delete-hero':
            header.classList.remove('header--main');   
            displaySelectListToForm();   
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
            displayHeroesList();
            homePage.classList.remove('hidden')      
        break;
    };
};

//page init script
const init = () => {
    window.addEventListener('hashchange', hashHandler);

    document.querySelectorAll('.form').forEach(form => {
        form.addEventListener('submit', handlerOnSubmitForm);
    });
    
    //after page refresh always back or rerender index
    window.location.hash === '#/index' ? displayHeroesList() : window.location.hash = '#/index';
    
    hiddenShowLoader();
}

init();

//add event listeners to a href
document.querySelectorAll('a[href').forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();
        window.location.hash = `/${link.getAttribute('href')}`;
        if (link.getAttribute('href') !== 'index') {
            openCloseMenu();
        }    
    });
});
let lastHeroFetched = [];
let lastHeroeslistfetched = [];

// mobile menu script
const openCloseMenu = () => {
    const nav = document.querySelector('.nav');
    nav.classList.toggle('nav--active');
} 
document.querySelector('.nav__mobile').addEventListener('click', openCloseMenu, false); 
//heroes list and hero detail script 

const fetchHeroes = () => {
    fetch('/heroes')
        .then(res => res.json())
        .then(data => {
            renderHeroes(data)
            lastHeroeslistfetched = data;
        })
        .then(() => cartRender())
};

const renderHeroes = (heroesArray = []) => {
    document.querySelector('.main').innerHTML = `
        <div class="heroes">
            ${heroesArray.map((hero, k) => 
                `<div key=${k} class="heroes__item" onclick="fetchHero('${hero.name}')">
                    <img class="heroes__img" src="${hero.image}"
                        srcset="${hero.image} 1024w,
                                ${hero.image} 640w,
                                ${hero.image} 320w"
                        sizes="(min-width: 36em) 33.3vw, 100vw"
                        alt="${hero.name}"
                    />
                    <div class="heroes__textWrapper">
                        <h1 class="heroes__title">${hero.name}</h1>
                        <p class="heroes__price">Cena Wynajmu ${hero.price} zł/h</p>
                    </div>
                </div>`
            ).join('')}
        </div>
    `;
}

const fetchHero = (name) => {
    fetch('/heroes/' + name)
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
                <img class="hero__img" src="${hero.image}"
                    srcset="${hero.image} 1024w,
                            ${hero.image} 640w,
                            ${hero.image} 320w"
                    sizes="(min-width: 36em) 33.3vw, 100vw"
                    alt="${hero.name}"
                />
                <div class="hero__content">
                    <h1 class="hero__title">i'm the ${hero.name}!</h1>
                    <p class="hero__description">${hero.description}</p>
                    <span class="hero__price">Cena Wynajmu: ${hero.price} zł/h</span>
                    ${hero.isAvailable && ((cartArray.findIndex(cartItem => cartItem.name === hero.name)) === -1) ? `<button onclick="addToCart()" class="hero__btn">dodaj do koszyka</button>` : `<span class="hero__status">bohater chwilo nie dostepny</span>`}
                </div>
                <span onclick="closeDetails()" class="hero__close"></span>
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
    //remove old html cart
    const cart = document.querySelector('.cart');
    if (cart) {
        cart.remove();
    }
    //load data from localStorage
    if (localStorage.cart) {
        cartArray = JSON.parse(localStorage.getItem('cart'));
    }
    //sum all cart elements
    let cartValue =  0;
    cartArray.map(cartItem => {cartValue += parseInt(cartItem.price)});
    
    //rendering all cart elements
    const cartArrayRender = () => {
        return cartArray.map((cartItem, k) => `
            <div key=${k} class="cart__item">
                <img class="cart__img" src="${cartItem.image}"
                    srcset="${cartItem.image} 1024w,
                            ${cartItem.image} 640w,
                            ${cartItem.image} 320w"
                    sizes="(min-width: 36em) 33.3vw, 100vw"
                    alt="${cartItem.name}"
                />
                <div class="cart__itemContent">
                    <h3 class="cart__title">${cartItem.name}</h3>
                    <p class="cart__description">${cartItem.description}</p>
                    <button class="cart__btn" onclick="removeFromCart(${k})">
                        <span class="cart__btnText">usuń z koszyka</span>
                        <span class="cart__btnIcon"></span>
                    </button>
                </div>
            </div> 
        `).join('');
    }
    //rendering cart header and main
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

const removeFromCart = (id) => {
    //load data from localStorage
    const cartArray = JSON.parse(localStorage.getItem('cart'));
    //return cart item if k is different than id 
    const newCartArray = cartArray.filter((cartItem, k) => {
        if (k !== id) {
            return cartItem;
        }
    });
    localStorage.setItem('cart', JSON.stringify(newCartArray));
    cartRender();
}

// add hero page script
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

const addHero = (heroeslist = lastHeroeslistfetched) => {
    const communicate = document.querySelector('.form__communicate');
    event.preventDefault();
    
    if ((heroeslist.findIndex(hero => hero.name === event.target[0].value)) === -1) { 
        fetchNewHero(event.target[0].value, event.target[1].value, event.target[2].value, event.target[3].value)
        communicate.textContent="bohater został dodany";
        communicate.classList.remove('form__error');
    } else {
        communicate.textContent = "bohater jest już na liście";
        communicate.classList.add('form__error');
    }
};
//display comunicat script

// const displayCommunicate = 


//edit hero page script

const renderEditHeroPage = () => {
    document.querySelector('.main').innerHTML = `
        <form id="editForm" class="form" onsubmit="editHero()">
            <h1 class="form__title">Edytuj Herosa</h1>
            <select name="select" class="form__input" form="editForm">
                ${lastHeroeslistfetched.map(hero => (`
                    <option value="${hero.name}">${hero.name}</option>
                `))}
            </select>
            <input name="img" class="form__input" type="text" placeholder="Adres/nazwa zdjęcia">
            <input type="number" name="price" class="form__input" type="text" placeholder="Cena wynajmu /h" required>
            <textarea name="description" class="form__input" rows="3" placeholder="Opis Bohatera"></textarea>
            <span class="form__communicate"></span>
            <button class="form__btn" type="submit">Edytuj</button>
        </form>
    `
};

const fetchEditHero = (name, image, price, description,) =>
    fetch('/heroes/' + name, {
        headers: {"Content-type": "application/json; charset=utf-8" },
        method: 'PUT',
        body: JSON.stringify({
            name: name,
            image: image,
            price: price,
            description: description,
        })
    })

const editHero = () => {
    event.preventDefault();
    fetchEditHero(event.target[0].value, event.target[1].value, event.target[2].value, event.target[3].value);  
}
//dont edit cart
// clean heroes database
const cleanDB = () => {
    fetch('/heroes', { 
        method: 'DELETE' 
    })
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
           renderEditHeroPage();     
            break;
        case '#/delete-hero':
            header.classList.remove('header--main');   
            renderAddHeroPage();     
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
            fetchHeroes();
            break;
    }
};

window.addEventListener('hashchange', hashHandler, false);

//after page refresh always back or rerender index
window.location.hash = '#/index';
fetchHeroes();

//add event listeners to a href
document.querySelectorAll('a[href').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.hash = `/${link.getAttribute('href')}`;
        openCloseMenu();
    });
});
document.querySelector('.nav__mobile').addEventListener('click', () => {
    const nav = document.querySelector('.nav');
    nav.classList.contains('nav--active') ? nav.classList.remove('nav--active') : nav.classList.add('nav--active');
    nav.style.width = document.width;
});

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
}

loadDefaultHeroes();

const innerHeroes = () => {
    const heroes = JSON.parse(localStorage.getItem('heroes'));
    document.querySelector('.main').innerHTML = `
        <div class="heroes">
            ${heroes.map((hero, k) => 
                `<div key=${k} class="heroes__item" onclick="heroesDetails(${k})">
                    <img class="heroes__img" src=${hero.image} alt=${hero.name} />
                    <div class="heroes__textWrapper">
                        <h1 class="heroes__header">${hero.name}</h1>
                        <p class="heroes__price">Cena Wynajmu ${hero.price} zł/h</p>
                    </div>
                </div>`
            ).join('')}
        </div>
    `;
}


const heroesDetails = (id) => {
    const hero = JSON.parse(localStorage.getItem('heroes'))[id];
    document.querySelector('body').insertAdjacentHTML('afterbegin', `
        <div class="hero">
            <div class="hero__wrapper">
                <img class="hero__img" src=${hero.image} alt=${hero.name} />
                <div class="hero__content">
                    <h1 class="hero__header">i'm the ${hero.name}!</h1>
                    <p class="hero__description">${hero.description}</p>
                    <span class="hero__price">Cena Wynajmu: ${hero.price} zł/h</span>
                    ${hero.isAvailable ? `<button class="hero__btn">dodaj do koszyka</button>` : `<span>bohater chwilo nie dostepny</span>`}
                </div>
                <span onclick="closeDetails()" class="hero__close"></span>
            </div>
        </div>
    `);
}

if (window.location.hash === '') {
    window.location.hash = '#/index.html';
}

const closeDetails = () => {
    document.querySelector('.hero').remove();
}

const update_url = (url) => {
    window.location.hash = url;
}

const renderAddHeroPage = () => {
    document.querySelector('.main').innerHTML = `
        <form class="form" onsubmit="addHero()">
            <h1 class="form__header">Dodaj Herosa</h1>
            <input name="name" class="form__input" type="text" placeholder="Nazwa Bohatera">
            <input name="img" class="form__input" type="text" placeholder="Adres/nazwa zdjęcia">
            <input name="price" class="form__input" type="text" placeholder="Cena wynajmu /h">
            <textarea name="description" class="form__input" rows="3" placeholder="Opis Bohatera"></textarea>
            <span class="form__communicate"></span>
            <button class="form__btn" type="submit">Submit</button>
        </form>
    `
}

const addHero = () => {
    event.preventDefault();
    const oldHeroesArray = JSON.parse(localStorage.getItem('heroes'));      
    const communicate = document.querySelector('.form__communicate')
    if ((oldHeroesArray.findIndex(hero => hero.name === event.target[0].value)) === -1) {
        const newHero = {
            name: event.target[0].value,    
            image: event.target[1].value,
            price: event.target[2].value,
            description: event.target[3].value,
            isAvailable: true
        };
        const NewheroesArray = [...oldHeroesArray, newHero];
        localStorage.setItem('heroes', JSON.stringify(NewheroesArray));
        communicate.innerHTML="Bohater dodany do listy";
    } else {
        communicate.innerHTML="Bohater znajduje się już na liście";
    } 
}

const hashHandler = () => {
    const header = document.querySelector('.header');
    switch (window.location.hash) {
        case '#/add-hero.html':
           if (header.classList.contains('header--main')) header.classList.remove('header--main');    
           renderAddHeroPage();     
            break;

        case '#/load-default-hero.html':
            loadDefaultHeroes();
            break;

        default:
        case '#/index.html':
            if (!(header.classList.contains('header--main'))) header.classList.add('header--main');
            innerHeroes();
            break;
    }
}

window.addEventListener('hashchange', hashHandler, false);

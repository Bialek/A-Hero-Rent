document.querySelector('.nav__mobile').addEventListener('click', function() {
    const nav = document.querySelector('.nav');
    nav.classList.contains('nav--active') ? nav.classList.remove('nav--active') : nav.classList.add('nav--active');
    nav.style.width = document.width;
});

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

const innerHeroes = (array) => {
    document.querySelector('.main').innerHTML = `
        <div class="heroes">
            ${array.map((hero, k) => 
                `<div key=${k} class="heroes__item" onclick="heroesDetail(${k})">
                    <img class="heroes__img" src=${hero.image} alt=${hero.name} />
                    <h1 class="heroes__header">${hero.name}</h1>
                    <p class="heroes__price">Cena Wynajmu ${hero.price} zł/h</p>
                </div>`
            ).join('')}
        </div>
    `;
}

innerHeroes(defaultHeroes);

const heroesDetail = (id) => {
    console.log(id);
    
    // document.querySelector('body').innerHTML = `
    //     <div class="hero">
            
    //     </div>
    // `;
}
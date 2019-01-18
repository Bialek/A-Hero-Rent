import { hiddenShowLoader } from './/loader.js';

const URL = '/heroes/';

export const fetchHeroes = () => {
    return fetch(URL)
        .then(res => res.json())
        .then(data => { return data });
};

export const fetchHero = name => {
    hiddenShowLoader();
    return fetch(URL + name)
        .then(res => res.json())
        .then(data => { return data });
};

export const fetchNewHero = (name, image, price, description, isAvailable = true) => {
    hiddenShowLoader();
    fetch(URL, {
        headers: { "Content-Type": "application/json; charset=utf-8" },
        method: 'POST',
        body: JSON.stringify({
            name: name,    
            image: image,
            price: price,
            description: description,
            isAvailable: isAvailable
        })
    }).then(()=> hiddenShowLoader());
};

export const fetchEditHero = (name, image, price, description,) => {
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
};

export const fetchDeleteHero = (name = '') => {
    fetch(URL + name, {
        method: 'DELETE',
    });
};
let pokeCount = 38;

const searchInput = document.getElementById('search-input');

const loader = document.querySelector('.lds-dual-ring');


let isLoadingMore = false;

const loadMorePokemon = async () => {
    if(pokeCount < 152) {
        if (isLoadingMore) {
            return;
        }
    
        isLoadingMore = true;
    
        const requests = [];
        const pokeCountNew = pokeCount + 38;
        for(let i = pokeCount + 1; i <= pokeCountNew; i++) {
            requests.push(getPokemon(i));
        }
        await Promise.all(requests);
        pokeCount += 38;
    
        isLoadingMore = false;
    }
};


const colors = {
    fire: "#FDDFDFB0",
    grass: "#DEFDE0B0",
    electric: "#FCF7DEB0",
    water: "#DEF3FDB0",
    ground: "#f4e7dab0",
    rock: "#d5d5d4b0",
    fairy: "#fceaffb0",
    poison: "#d6b3ffb0",
    bug: "#f8d5a3b0",
    dragon: "#97b3e6b0",
    psychic: "#eaeda1b0",
    flying: "#F5F5F5B0",
    fighting: "#E6E0D4B0",
    normal: "#F5F5F5B0",
    ice: "#e0f5ffb0",
}

const initPokemon = async () => {
    const requests = [];
    for(let i = 1; i <= pokeCount; i++) {
        requests.push(getPokemon(i));
    }
    await Promise.all(requests);
}

const getPokemon = async (id) => {
    showLoader();
    let url = `https://pokeapi.co/api/v2/pokemon/${id}`;
    let res = await fetch(url);
    let data = await res.json();

    createPokemonBox(data);
}
const searchPokemon = async (input) => {
   showLoader();
    let url = `https://pokeapi.co/api/v2/pokemon/${input}`;
    let res = await fetch(url);

    let data = await res.json();
 
    createPokemonBox(data);

}
const blurLoad = () => {
    const blurDivs = document.querySelectorAll(".blur-load");
    blurDivs.forEach(div => {
        const img = div.querySelector("img");
    
        function loaded() {
            div.classList.add("loaded")
        }
    
        if (img.complete) {
            loaded()
        } else {
            img.addEventListener("load", loaded)
        }
    });
}


const createPokemonBox = (pokemon) => {
   const name = pokemon.name[0].toUpperCase() + pokemon.name.slice(1);
   const id = pokemon.id.toString().padStart(3, '0');
   const weight = pokemon.weight;
   const type = pokemon.types[0].type.name;
   const color = colors[type];
   const abilities = pokemon.abilities;

   const div = document.createElement('div');
   div.classList.add('card');
   div.style.backgroundColor = color;
   div.innerHTML= `
   <div class="blur-load">
    <img src="https://assets.pokemon.com/assets/cms2/img/pokedex/full/${id}.png" loading="lazy" alt="${name}">
   </div>
   <h4 class="poke-name">${name}</h4>
   <p>${weight} kg</p>
   <p>Type: ${type}</p>
   <h5>Skills</h5>
   ${abilities.map((genre) => `<p>${genre.ability.name}</p>`).join('')}
   `;
   document.getElementById('main-grid').appendChild(div);
   blurLoad();
   hideLoader();
}

searchInput.addEventListener("input", function(e) {
    const search = searchInput.value.toLowerCase();
    document.getElementById('main-grid').innerHTML = '';
    if(search === '') {
        initPokemon();
    } else {
        searchPokemon(search);
    }
});

window.addEventListener('scroll', () => {
    const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight - 300) {
        loadMorePokemon();
    }
});

const showLoader = () => {
    loader.classList.remove('hidden');
}

const hideLoader = () => {
    loader.classList.add('hidden');
}


document.addEventListener('DOMContentLoaded', initPokemon);
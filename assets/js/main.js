

const pokemonList = document.getElementById('pokemonList');
const loadMoreButton = document.getElementById('loadMoreButton');
const profileContent = document.getElementById('profileContent');

const params = new URLSearchParams(window.location.search);
const id = params.get("id");

const maxRecords = 151;
const limit = 10;
let offset = 0;

if (id) {
    getProfilePokemon(id);
}

function getProfilePokemon(id) {
    pokeApi
        .getPokemonDetailsToProfile(id)
        .then((pokemon) => {

            const newHtml =
                `
        <!-- Seção de informações básicas -->
        
        <section class="details">
            <div class="basic">
                <div class="basic ${pokemon.type}">
                    <h1 class="name">${pokemon.name}</h1>
                    <p class="number">#${pokemon.number}</p>
                    <ul class="types">
                        ${pokemon.types
                            .map((type) => `<li class="type ${type}"> ${type}</li>`)
                            .join("")}
                    </ul>
                    <img class="img" src="${pokemon.photo}" alt="${pokemon.img}">
                </div>
            </div>
            <div class="menu_items" id="about">
                <ul class="atributes">
                    <li class="span-details" id="hp">HP <b>${pokemon.hp}</b></li>
                    <li class="span-details" id="attack">Attack <b>${pokemon.attack}</b></li>
                    <li class="span-details" id="defense">Defense <b>${pokemon.defense}</b></li>
                    <li class="span-details" id="height">Height <b>${pokemon.height}</b></li>
                    <li class="span-details" id="weight">Weight <b>${pokemon.weight}</b></li>
                </ul>
                        
                <ul class="skills">
                    <li class="skill" id="abilities">${pokemon.abilities}</li>
                </ul>
            </div>
            
        </div>
        `;
            if (profileContent) {
                profileContent.innerHTML = newHtml;
            }
        })
        .catch((error) => console.log(error));
}

function enterToProfile(id) {   //redirectToProfile
    const detailsURL = `details.html?id=${id}`;
    window.location.href = detailsURL;
}

function showItems(category) {    //showItems(about)
    let menuItems = document.querySelectorAll(".menu_items");  //menu_items
    menuItems.forEach((item) => {
        item.classList.remove("active");
    });

    document.getElementById(category).classList.add("active")
}

function loadPokemonItens(offset, limit) {   //loadMoreItems
    pokeApi
        .getPokemons(offset, limit)
        .then((pokemons = []) => {
            const newHtml = pokemons
                .map((pokemon) => {
                    return `
                <li class="pokemon ${pokemon.type}" onclick="enterToProfile(${pokemon.number})">
                    <span class="number">#${pokemon.number}</span>
                    <span class="name">${pokemon.name}</span>
        
                    <div class="detail">
                        <ol class="types">
                            ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                        </ol>
        
                        <img src="${pokemon.photo}"
                             alt="${pokemon.name}">
                    </div>
                </li>`
                })
                .join('')

            if (pokemonList) {
                pokemonList.innerHTML += newHtml
            }
        })
        .catch((error) => console.log(error))
}

loadPokemonItens(offset, limit) //loadMoreItems é a mesma coisa

if (loadMoreButton) {
    loadMoreButton.addEventListener('click', () => {
        offset += limit
        const qtdRecordsWithNexPage = offset + limit

        if (qtdRecordsWithNexPage >= maxRecords) {
            const newLimit = maxRecords - offset
            loadPokemonItens(offset, newLimit)

            loadMoreButton.parentElement.removeChild(loadMoreButton)
        } else {
            loadPokemonItens(offset, limit)
        }
    })
}

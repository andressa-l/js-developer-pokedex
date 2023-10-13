

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
        <section class="basic ${pokemon.type}">
            <h1 class="name">${pokemon.name}</h1>
            <ol class="types">
                ${pokemon.types
                    .map((type) => `<li class="type ${type}"> ${type}</li>`)
                    .join("")}
            </ol>
  
            <div class="img">
                <img src="${pokemon.photo}" alt="${pokemon.img}">
            </div>
        </section>
  
        <!-- Seção de detalhes -->
        <section class="details">
  
            <div class="menu">
                <div class="menu_option" onclick="showItems('about')">About</div>
                <div class="menu_option" onclick="showItems('base_stats')">Base Stats</div>
            </div>
            <div id="linha"></div>
            <div class="menu_items" id="about">
                <ol>
                    <li id="species">Species <span class="span-details">${pokemon.species}</span></li>
                    <li id="height">Height <span class="span-details">${pokemon.height}</span></li>
                    <li id="weight">Weight <span class="span-details">${pokemon.weight}</span></li>
                    <li id="abilities">Abilities <span class="span-details">${pokemon.abilities}</span></li>
                </ol>
            </div>
  
            <div class="menu_items" id="base_stats">
                <ol>
                    <li id="hp">HP <span class="span-details">${pokemon.hp}</span></li>
                    <li id="attack">Attack <span class="span-details">${pokemon.attack}</span></li>
                    <li id="defense">Defense <span class="span-details">${pokemon.defense}</span></li>
                </ol>
            </div>
  
        </section>
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




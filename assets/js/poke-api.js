const pokeApi = {}

function convertPokeApiDetailToPokemon(pokeDetail) {
    const pokemon = new Pokemon()
    pokemon.number = pokeDetail.id
    pokemon.name = pokeDetail.name

    const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name)
    const [type] = types

    pokemon.types = types
    pokemon.type = type

    pokemon.photo = pokeDetail.sprites.other.dream_world.front_default

    pokemon.height = pokeDetail.height
    pokemon.weight = pokeDetail.weight

    const abilities = pokeDetail.abilities
        .map((index) => index.ability.name)
        .join(', ')
    pokemon.abilities = abilities
    pokemon.hp = pokeDetail.stats.find(
        (element) => element.stat.name === "hp"
    ).base_stat;
    pokemon.defense = pokeDetail.stats.find(
        (element) => element.stat.name === "defense"
    ).base_stat;
    pokemon.attack = pokeDetail.stats.find(
        (element) => element.stat.name === "attack"
    ).base_stat;

    return pokemon
}

pokeApi.getPokemonDetail = (pokemon) => {
    return fetch(pokemon.url)
        .then((response) => response.json())
        .then((pokemon) => convertPokeApiDetailToPokemon(pokemon))
}

pokeApi.getPokemons = (offset = 0, limit = 5) => {
    const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`

    return (
        fetch(url)
            .then((response) => response.json())
            .then((jsonBody) => jsonBody.results)
            .then((pokemons) => pokemons.map(pokeApi.getPokemonDetail))
            .then((detailRequests) => Promise.all(detailRequests))
            .then((pokemonsDetails) => pokemonsDetails)
            .catch((error) => console.log(error))
    )
}

pokeApi.getPokemonDetailsToProfile = (id) => {
    const url = `https://pokeapi.co/api/v2/pokemon/${id}`;

    return (
        fetch(url)
            .then((response) => response.json())
            .then((pokemonDetails) => {
                return convertPokeApiDetailToPokemon(pokemonDetails)
            })
            .catch((error) => console.log(error))
    )
}

// Declare (and define) global variables
const textInput = document.getElementById("name");
const figcaption = document.getElementById("pokemonId");
const searchResult = document.getElementById("searchResult");
const img = document.getElementById("img");
let matchFound;
// An animatiion for signaling failure
const shake = [
    { transform: "translateX(0%)" },
    { transform: "translateX(10%)" },
    { transform: "translateX(-10%)" }
];

// Checks the cache before deciding if an API lookup is necessary
function checkCache(pokemonName) {
    // Disables text input to communicate a loading process and prevent 
    // the user from changing their input in the meanwhile. 
    textInput.disabled = true;
    let userInput = pokemonName.value.toLowerCase();
    matchFound = false;

    // If the cache is not empty, check to see if the requested pokemon 
    // happens to be saved in session storage.
    let cachedPokemon = sessionStorage.getItem("cachedPokemon");
    if (cachedPokemon) {
        let parsedPokemon = JSON.parse(cachedPokemon);
        parsedPokemon.forEach(element => {
            if (userInput == element.name.toLowerCase()) {
                // If the pokemon is found in the cache, 
                // display results using cache. 
                displayResult(element);
                matchFound = true;
            }
        });
    }
    // If no match was found, fetch API
    if (!matchFound) {
        fetchAPI(userInput);
    }
}
// Takes the user input to fetch a specific pokémon with the API
async function fetchAPI(userInput) {
    let url = "https://pokeapi.co/api/v2/pokemon/" + userInput + "/";
    // Resets the text input color
    textInput.style.backgroundColor = "#fff";
    // Tries to fetch API
    try {
        const response = await fetch(url);
        // Signals a negative response upon recieving a 404 and throws error
        if (!response.ok) {
            displayResult(null);
            throw new Error('Response status: ${response.status}');
        }

        let result = await response.json();
        // Caches the result
        cacheResult(result);
        // Sends the result to the displayResults() function upon receiving a 200 (ok)
        displayResult(result);

        // Catches any errors for debugging purposes
    } catch (error) {
        console.error(error.message);
    }
}

// Displays a pokémon sprite or feedback depending on the results
function displayResult(pokemon) {
    textInput.disabled = false;

    // If the fetch was successful, display the sprite
    if (pokemon) {
        img.src = pokemon.sprites.front_default;
        textInput.style.backgroundColor = "#fff";
        figcaption.textContent = "#" + pokemon.id;
        searchResult.textContent = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
    // Otherwise, communicate the failure through an animation and imagery. 
    } else {
        img.src = "cross.png";
        textInput.style.animation = 'none';
        textInput.style.backgroundColor = "#ff9f94";
        textInput.animate(shake, 200);
        figcaption.textContent = "Try searching for another pokémon. ";
        searchResult.textContent = "Not found!";
    }

}

// Tries to cache results. Deletes the cache upon failed attempt.
function cacheResult(result) {
    try {
        // Get previously cached pokemon (if any)
        let cachedPokemon = sessionStorage.getItem("cachedPokemon");
        let parsedCache;

        // If there are any cached pokemon, parse the data. 
        if (cachedPokemon) {
            parsedCache = JSON.parse(cachedPokemon);
        } else {
            parsedCache = [];
        }

        // loop through the cached pokemon to see if any match the current one (parameter)
        let alreadyExists = false;
        parsedCache.forEach(pokemon => {
            if (pokemon.name.toLowerCase() === result.name.toLowerCase()) {
                alreadyExists = true;
            }
        });

        // If it doesn't exist in cache, then make sure to store it
        if (!alreadyExists) {
            parsedCache.push(result);
            sessionStorage.setItem("cachedPokemon", JSON.stringify(parsedCache));
        }
    // Empty cache if it fails to successfully execute try block
    } catch (e) {
        sessionStorage.removeItem("cachedPokemon");
    }
}

// An animatiion for signaling failure
const shake = [
    { transform: "translateX(0%)"},
    { transform: "translateX(10%)"},
    { transform: "translateX(-10%)"}
];
// Declare (and define) global variables
const textInput = document.getElementById("name");
const figcaption = document.getElementById("pokemonId");
const searchResult = document.getElementById("searchResult");
const img = document.getElementById("img");
let previousResults = [];
let matchFound;

// Checks the cache before deciding if an API lookup is necessary
function checkCache(pokemonName){
    console.log("storage: "+ localStorage.getItem("cachedPokémon"));
    // Disables text input to communicate a loading process and prevent 
    // the user from changing their input in the meanwhile. 
    textInput.disabled = true;
    let userInput = pokemonName.value
    matchFound = false;
    console.log(previousResults);
    // If the cache is not empty, check to see if the requested pokemon 
    // happens to be saved in local storage.
    if(!previousResults || previousResults.length != 0){
        previousResults.forEach(element => {
                if(userInput == element.name){
                    // If the pokemon is found in the cache, 
                    // display results using cache. 
                    displayResult(element);
                    matchFound = true;
                    console.log("Match found!!");
                }
        });
    }
    // If no match was found, 
    if(!matchFound){
        fetchAPI(userInput);
    }
}
// Takes the user input to fetch a specific pokémon with the API
async function fetchAPI(userInput){
    let url = "https://pokeapi.co/api/v2/pokemon/" + userInput + "/";
    // Resets the text input color
    textInput.style.backgroundColor = "#fff";
    // Tries to fetch API
    try { 
        const response = await fetch(url);
        // Signals a negative response upon recieving a 404 and throws error
        if (!response.ok){
            displayResult(null);
            throw new Error('Response status: ${response.status}');
        }
        let result = await response.json();
        console.log(result);
        // Sends the result to the displayResults() function upon receiving a 200 (ok)
        displayResult(result);
        // Caches the result
        cacheResult(result);
        // Catches any errors for debugging purposes
        } catch (error) {
            console.error(error.message);
        }
}

// Displays a pokémon sprite or feedback depending on the results
function displayResult(pokemon){
    textInput.disabled = false;

    // If the fetch was successful, display the sprite
    if(pokemon){
        img.src = pokemon.sprites.front_default;
        textInput.style.backgroundColor = "#fff";
        figcaption.textContent = "#" + pokemon.id;
        searchResult.textContent = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
    // Otherwise, communicate the failure through an animation and imagery. 
    }else{
        img.src = "/cross.png";
        textInput.style.animation = 'none';
        textInput.style.backgroundColor = "#ff9f94";
        textInput.animate(shake, 200);
        figcaption.textContent = "Try searching for another pokémon. ";
        searchResult.textContent = "Not found!";
    }

}

// Tries to cache results. Deletes the cache upon failed attempt.
function cacheResult(result){
    try {
        previousResults.push(result);
        localStorage.setItem("cachedPokémon", previousResults);
    } catch (e){
        removeCache();
    }
}

// Removes cache
function removeCache(){
    previousResults = [];
    localStorage.clear();
}

// Calls the removal of cache before closing or reloading the website.
window.onbeforeunload = function() {
    removeCache();
    return null;
}


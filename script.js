// An animatiion for signaling failure
const shake = [
    { transform: "translateX(0%)"},
    { transform: "translateX(10%)"},
    { transform: "translateX(-10%)"}
];

// Takes the user input to fetch a specific pokémon with the API
async function fetchAPI(pokemonName){
    let name = pokemonName.value
    let url = "https://pokeapi.co/api/v2/pokemon/" + name + "/";

    // Tries to fetch API
    try { 
        const response = await fetch(url);
        // Signals a negative response upon recieving a 404 and throws error

        // NOTE FOR SELF: input loading animation and disable editing of input here?

        if (!response.ok){
            displayResult(null);
            throw new Error('Response status: ${response.status}');
        }

        let result = await response.json();
        console.log(result);
        // Sends the result to the displayResults() function upon receiving a 200 (ok)
        displayResult(result);

        // Catches any errors for debugging purposes
        } catch (error) {
            console.error(error.message);
        }
}

// Displays a pokémon sprite or feedback depending on the results
function displayResult(pokemon){
    let img = document.getElementById("img");
    let textInput = document.getElementById("name");

    // If the fetch was successful, display the sprite
    if(pokemon){
        img.src = pokemon.sprites.front_default;
        textInput.style.border = "black solid 2px";
    // Otherwise, communicate the failure through an animation and imagery. 
    }else{
        img.src = "/cross.png";
        textInput.style.animation = 'none';
        textInput.style.border = "red solid 2px";
        textInput.animate(shake, 200);
    }

}

// NOTE FOR SELF: ENTER key listener for submitting form?
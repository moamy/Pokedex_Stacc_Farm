# Pokedex for Stacc Farm!
This is a Pokédex demo created for Stacc Farm! :) 

I made the tests using Playwright, and everything else through pure JavaScript, HTML and CSS. I also used a font from Google Fonts, I hope that is okay with you guys since they are free to use. 

## Run the project
The project (without tests) can be run by downloading the project from GitHub as a ZIP-file and extracting it. Open the extracted folder and then open its `index.html` file!

## Run the tests
Running the tests requires a setup in Docker. 

I'm unsure if this is the best way to go about it, but I figured it should work relatively smoothly.

To run the tests, you have to pull and run the image. Run the following commands in the Docker terminal:

```
docker pull moamy/pokedex:latest
```

```
docker run -p 5500:5500 moamy/pokedex:latest
```

> OBS! the tests may have to be run twice in order for the snapshot tests to work, I have not run into such issues in this image, but the possibility remains. 

## Further notes
If you want to inspect the code for tests then these can be found at `tests > pokedex.spec.ts`. 

I hope this is sufficient!

With regards, 
Moa
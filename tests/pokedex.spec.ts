import { test, expect, Page } from '@playwright/test';


test('signals failure on failed search', async ({ page }) => {
    await page.goto('http://127.0.0.1:5500/');
    await page.locator('#name').click();
    // Fills the text input with something that won't result in a match
    await page.locator('#name').fill('null');
    await page.getByRole('button', { name: 'Submit' }).click();
    // Makes sure the headings are showing the correct text
    await expect(page.locator('#searchResult')).toHaveText("Not found!");
    await expect(page.locator('#pokemonId')).toHaveText("Try searching for another pokémon.");

    // Makes sure the input turns bright red/pink
    await expect(page.locator('#name')).toHaveCSS('background-color', 'rgb(255, 159, 148)');

    // Makes sure the picture source changes to a red cross
    await expect(page.getByRole('img', { name: 'Picture displaying a pokémon.' })).toHaveScreenshot('cross.png');
});

// Makes sure searching for a pokemon (clefairy) will result in displaying its sprite
test('displays pokemon on successful search', async ({ page }) => {
    await page.goto('http://127.0.0.1:5500/');
    await page.locator('#name').click();
    await page.locator('#name').fill('clefairy');
    await page.getByRole('button', { name: 'Submit' }).click();
    // Does not check the whole process of getting a response from the API,
    // only checks the src of the image to include a part of the APIs image folder path. 
    await expect(page.getByRole('img', { name: 'Picture displaying a pokémon.' })).toHaveAttribute('src', /\PokeAPI\/sprites/);
});

// Makes sure the API results in an OK response
test('gets OK response from API', async ({ page }) => {
    await page.goto('http://127.0.0.1:5500/');
    await page.locator('#name').click();
    await page.locator('#name').fill('pikachu');

    // Waits for a response from the API and identifies it via a part of the URL
    const responsePromise = page.waitForResponse(response =>
        response.url().includes("pokeapi.co/api/v2/pokemon/")
    );

    await page.getByRole('button', { name: 'Submit' }).click();

    const response = await responsePromise;
    // If the response is 200 (OK) then the test will be passed
    await expect(response.status() === 200).toBeTruthy;
});
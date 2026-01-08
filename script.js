/**
 * Find The Imposter Game
 * Author: Talon Dunbar
 */

'use strict';

// --- Global Constants -------------------------------------------------------

const DOG_API_URL = 'https://dog.ceo/api/breeds/image/random';
const IMAGES_PER_BATCH = 4;
const BATCH_COUNT = 5;
const PER_IMAGE_DELAY_MS = 100;
const BATCH_FETCH_DELAY_MS = 2000;
const BATCH_REMOVE_DELAY_MS = 15000;

// --- Game State -------------------------------------------------------------

let nextStorageIndex = 0;
let cacheIndex = 0;
let batchesCreated = 0;
let correctAnswers = 0;
let incorrectAnswers = 0;

// --- DOM Content Initialization ---------------------------------------------

document.addEventListener('DOMContentLoaded', init);

// --- Game Flow Logic --------------------------------------------------------

function init() {
  nextStorageIndex = getLocalStorageLength();

  if (nextStorageIndex > 1) {
    shuffleLocalStorage();
  }

  const scoreButton = document.querySelector('button');
  scoreButton.addEventListener('click', displayChart);

  repeatFunctionWithDelay(
    addImageBatch,
    BATCH_COUNT,
    BATCH_FETCH_DELAY_MS
  );
}

// --- Image Batch Logic ------------------------------------------------------

/**
 * Creates an image batch and adds 3 dog images and an imposter bear image.
 * - Gets four dog images from cache or API.
 * - Chooses one dog image to replace with a random imposter bear image.
 * - Sets timer to automatically remove self after `BATCH_REMOVE_DELAY_MS`.
 */
function addImageBatch() {
  const imageBatch = createImageBatch();
  batchesCreated++;

  getDogImageUrlsPreferringCache()
    .then(dogImageUrls => {
      // Pick random dog to replace by index
      const replaceIndex = Math.floor(Math.random() * IMAGES_PER_BATCH);
      const bearUrl = getRandomBearUrl();

      for (let i = 0; i < IMAGES_PER_BATCH; i++) {
        // Place imposter url if index is same as replaceIndex
        const isImposter = i === replaceIndex;
        const imageSrc = isImposter ? bearUrl : dogImageUrls[i];
        const img = createImage(imageSrc, isImposter);
        imageBatch.appendChild(img);
      }

      imageBatch.style.display = 'flex';

      setTimeout(() => {
        imageBatch.remove();

        if (
          batchesCreated === BATCH_COUNT &&
          document.querySelectorAll('.image-batch').length === 0
        ) {
          showGameOverDisplay();
        }
      }, BATCH_REMOVE_DELAY_MS);
    })
    .catch(error => showError(error));
}

/**
 * Creates a new image batch section.
 * Adds random background colour, image-batch class, and click event listener.
 * Appends image batch to image section.
 *
 * @returns {HTMLElement} The newly created image batch section element.
 */
function createImageBatch() {
  const imageSection = document.querySelector('#images');
  const imageBatch = document.createElement('section');
  // Random hue between 100-255
  const randRed = Math.floor(Math.random() * 156) + 100;
  const randGreen = Math.floor(Math.random() * 156) + 100;
  const randBlue = Math.floor(Math.random() * 156) + 100;

  imageBatch.classList.add('image-batch');
  imageBatch.addEventListener('click', handleBatchClick);
  imageBatch.style.display = 'none';

  imageBatch.style.background = `rgb(${randRed} ${randGreen} ${randBlue} / 50%)`;
  imageSection.appendChild(imageBatch);

  return imageBatch;
}

/**
 * Gets four dog image URLs, prioritizing cache first, then API fetching.
 *
 * @returns {Promise<Array<string>>} A promise that resolves to an array of four dog image URLs.
 */
function getDogImageUrlsPreferringCache() {
  const cached = getDogImageUrlsFromCache(IMAGES_PER_BATCH);
  const missingCount = IMAGES_PER_BATCH - cached.length;

  if (missingCount === 0) {
    return new Promise(resolve => {
      resolve(cached);
    });
  }

  return fetchDogImageUrlsSequentially(missingCount).then(fetched => {
    return cached.concat(fetched);
  });
}

/**
 * Fetches URLs from the `localStorage` cache.
 *
 * @param {number} limit - the amount of image URLs to fetch from cache.
 * @returns {Array<string>} an array of up to 4 image urls from cache.
 */
function getDogImageUrlsFromCache(limit) {
  const cachedUrls = [];
  for (let i = 0; i < limit; i++) {
    const url = localStorage.getItem(String(cacheIndex));
    if (!url) {
      break;
    }
    cachedUrls.push(url);
    cacheIndex++;
  }
  return cachedUrls;
}

/**
 * Fetches image urls from API up to `count` times.
 * Stores URLs in local storage when promise resolves.
 * Adds `PER_IMAGE_DELAY_MS` between image fetch requests.
 * Recursively calls itself with `count - 1` after inner promise resolves.
 *
 * @param {number} count - The amount of images to fetch sequentially.
 * @param {Array<string>} collected - The urls collecteds, defaults to empty array.
 * @returns {Promise<Array<string>>} A promise that resolves to an array of image URLs.
 */
function fetchDogImageUrlsSequentially(count, collected = []) {
  if (count === 0) {
    return new Promise(resolve => {
      resolve(collected);
    });
  }

  return fetchDogImageUrl()
    .then(url => {
      collected.push(url);
      addItemToLocalStorage(url);
    })
    .then(() => delay(PER_IMAGE_DELAY_MS))
    .then(() => fetchDogImageUrlsSequentially(count - 1, collected));
}

/**
 * Fetches a dog image URL from the dog image API.
 *
 * @returns {Promise<string>} A promise that resolves to the dog image URL.
 * @throws Will throw an error if the API request fails.
 */
function fetchDogImageUrl() {
  return fetch(DOG_API_URL)
    .then(resp => {
      if (!resp.ok) {
        throw new Error('API error');
      }
      return resp.json();
    })
    .then(data => {
      return data.message;
    });
}

/**
 * Adds a designated item to `localStorage` with `nextStorageIndex` as the key.
 * Increments the `nextStorageIndex` field after adding item.
 *
 * @param {string} item - the item to add to `localStorage`
 */
function addItemToLocalStorage(item) {
  localStorage.setItem(nextStorageIndex, item);
  nextStorageIndex++;
}

/**
 * Gets a bear image url with random dimesion.
 * Dimesions can be 300, 400, 500, or 600.
 *
 * @returns {string} the bear image url.
 */
function getRandomBearUrl() {
  // Found that we need to randomize the dimensions to get different imposters
  const dimension = (Math.floor(Math.random() * 4) + 3) * 100;
  return `https://placebear.com/${dimension}/${dimension}`;
}

/**
 * Creates a new image tag with necessary classes.
 *
 * @param {string} src - The image src URL.
 * @param {boolean} imposter - If the image contains an imposter.
 * @returns {HTMLImageElement} Image element with classes.
 */
function createImage(src, imposter) {
  const image = document.createElement('img');
  image.classList.add('batch-item');
  image.classList.add('notClicked');
  image.src = src;

  if (imposter) {
    image.classList.add('imposter');
  } else {
    image.classList.add('nonimposter');
  }

  return image;
}

/**
 * Shows an error message in the Error display paragraph.
 *
 * @param {string} msg - The error message to add.
 */
function showError(msg) {
  const errorSection = document.querySelector('.error');
  errorSection.textContent = msg;
}

// --- Game Utiliy ------------------------------------------------------------

/**
 * Handles clicks on images within an image batch.
 * - Highlights imposters in green border and increases score.
 * - Fades incorrect guesses and increases mistake count.
 * Removes `notClicked` class after the first interaction.
 *
 * @param {MouseEvent} event - The click event that was triggered.
 */
function handleBatchClick(event) {
  // Correctly guessed imposter
  if (event.target.classList.contains('imposter')) {
    event.target.style.border = '5px solid green';
    if (event.target.classList.contains('notClicked')) {
      correctAnswers += 1;
      event.target.classList.remove('notClicked');
    }
  }
  // Incorrectly guessed non imposter
  if (event.target.classList.contains('nonimposter')) {
    event.target.style.opacity = 0.6;
    if (event.target.classList.contains('notClicked')) {
      incorrectAnswers += 1;
      event.target.classList.remove('notClicked');
    }
  }
}

/**
 * Ends the game by removing any existing image-batch elements.
 * Displays a final score paragraph in image section element.
 */
function showGameOverDisplay() {
  document
    .querySelectorAll('.image-batch')
    .forEach(batch => batch.remove());
  const finalScoreParagraph = document.createElement('p');
  finalScoreParagraph.textContent = `Game over! You found ${correctAnswers} imposters and
  made ${incorrectAnswers} mistakes. Click on Score to see results.`;
  finalScoreParagraph.style.textAlign = 'center';
  document.querySelector('#images').appendChild(finalScoreParagraph);
}

// --- Ulitily Functions ------------------------------------------------------

/**
 * Repeats a function a specific amount of times with specifed delay between.
 * Cool and simple recursion technique, inspired by:
 * https://stackoverflow.com/questions/35556876/javascript-repeat-a-function-x-amount-of-times
 *
 * @param {function} func - The function you want to repeat.
 * @param {number} times - The amount of times to repeat `func`.
 * @param {number} delay - Optional delay in milliseconds, defaults to 0.
 * @returns {void} returns early when`times` equals 0.
 */
function repeatFunctionWithDelay(func, times, delay = 0) {
  if (times === 0) return;

  func();

  setTimeout(() => {
    repeatFunctionWithDelay(func, times - 1, delay);
  }, delay);
}

/**
 * Checks the `localStorage` and determines the amount of items present.
 * Borrowed from the `shuffleLocalStorage` function.
 * @returns {number} The length of the keys in `localStorage`
 */
function getLocalStorageLength() {
  const keys = Object.keys(localStorage)
    .map(Number)
    .filter(k => Number.isInteger(k) && k >= 0);
  const len = keys.length;
  return len;
}

/**
 * Delay execution for a given amount of time.
 *
 * @param {number} ms - The amount of ms ti set the timeout for.
 * @returns {Promise<void>} A Promise that resolves after the timeout finishes.
 */
function delay(ms) {
  return new Promise(res => setTimeout(res, ms));
}

/**
 * Displays a JS Chart modal.
 */
function displayChart() {
  // this is a inline eslint setting to ignore the Chart global variable
  /* global Chart */
  const data = {
    labels: ['Correct', 'Incorrect'],
    datasets: [
      {
        label: 'Results',
        data: [correctAnswers, incorrectAnswers],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)'
        ],
        borderColor: ['rgb(54, 162, 235)', 'rgb(255, 99, 132)'],
        borderWidth: 1
      }
    ]
  };
  const config = {
    type: 'bar',
    data: data,
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  };
  const ctx = document.getElementById('chart');
  const barChart = new Chart(ctx, config);
  const modal = document.getElementById('modal');
  modal.style.display = 'block';
  modal.addEventListener('click', () => {
    modal.style.display = 'none';
    barChart.destroy();
  });
}

/**
 * Shuffles the integer keys for the Image URLS in `localStorage`
 */ 
function shuffleLocalStorage(maxSwaps = 20) {
  // Get all integer keys
  const keys = Object.keys(localStorage)
    .map(Number)
    .filter(k => Number.isInteger(k) && k >= 0);
  const len = keys.length;
  const swaps = Math.min(Math.floor(len / 2), maxSwaps);
  for (let i = 0; i < swaps; i++) {
    const idx1 = Math.floor(Math.random() * len);
    const idx2 = Math.floor(Math.random() * len);
    if (idx1 === idx2) {
      continue;
    }
    const key1 = keys[idx1];
    const key2 = keys[idx2];
    const temp = localStorage.getItem(key1);
    localStorage.setItem(key1, localStorage.getItem(key2));
    localStorage.setItem(key2, temp);
  }
}

'use strict';

const DOG_API_URL = 'https://dog.ceo/api/breeds/image/random';
const IMAGES_PER_BATCH = 4;
const BATCH_COUNT = 5;
const BATCH_FETCH_DELAY_MS = 1000;
const BATCH_REMOVE_DELAY_MS = 10000;
const GAME_OVER_DELAY = BATCH_COUNT * BATCH_FETCH_DELAY_MS + BATCH_REMOVE_DELAY_MS;

let correctAnswers = 0;
let incorrectAnswers = 0;

document.addEventListener('DOMContentLoaded', init);

function init() {
  shuffleLocalStorage();
  buildImageBatchesWithDelay(BATCH_COUNT);
  const scoreButton = document.querySelector('button');
  scoreButton.addEventListener('click', displayChart);

  setTimeout(() => {
    GameOver();
  }, GAME_OVER_DELAY);
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
  // Random hue between 100-256
  const randRed = Math.floor(Math.random() * 156) + 100;
  const randGreen = Math.floor(Math.random() * 156) + 100;
  const randBlue = Math.floor(Math.random() * 156) + 100;

  imageBatch.classList.add('image-batch');
  imageBatch.addEventListener('click', handleBatchClick);

  imageBatch.style.background = `rgb(${randRed} ${randGreen} ${randBlue} / 50%)`;
  imageSection.appendChild(imageBatch);

  return imageBatch;
}

/**
 * Calls `createImageBatch`, populates image batch with dog/bear images
 * and schedules its removal.
 */
function addImageBatchImages() {
  const imageBatch = createImageBatch();

  fetchFourDogImageUrls()
    .then(dogImageUrls => {
      // Pick random dog to replace by index
      const replaceIndex = Math.floor(Math.random() * IMAGES_PER_BATCH);

      // Found that we need to randomize the dimensions to get different imposters
      const dimension = (Math.floor(Math.random() * 4) + 4) * 100;
      const bearUrl = `https://placebear.com/${dimension}/${dimension}`;

      for (let i = 0; i < IMAGES_PER_BATCH; i++) {
        // Place imposter url if index is same as replaceIndex
        const isImposter = i === replaceIndex;
        const imageSrc = isImposter ? bearUrl : dogImageUrls[i];
        const img = createImage(imageSrc, isImposter);
        imageBatch.appendChild(img);
      }

      setTimeout(() => {
        imageBatch.remove();
      }, BATCH_REMOVE_DELAY_MS);
    })
    .catch(console.error);
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
    })
    .catch(error => {
      return error;
    });
}

/**
 * Fetches four dog image URLs in sequence.
 *
 * @returns {Promise<string[]>} Array of dog image URLs.
 */
function fetchFourDogImageUrls() {
  return new Promise((resolve, reject) => {
    const urls = [];

    return fetchDogImageUrl()
      .then(img => {
        urls.push(img);
        return fetchDogImageUrl();
      })
      .then(img => {
        urls.push(img);
        return fetchDogImageUrl();
      })
      .then(img => {
        urls.push(img);
        return fetchDogImageUrl();
      })
      .then(img => {
        urls.push(img);
        resolve(urls);
      })
      .catch(error => reject(error));
  });
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
 * Builds image batches a specific amount of times with `BATCH_FETCH_DELAY_MS` delay between.
 *
 * @param {number} times- The amount of times to repeat image batch build.
 * @returns {void} Returns early once repeated enough times.
 */
function buildImageBatchesWithDelay(times) {
  if (times === 0) return;

  addImageBatchImages();

  setTimeout(() => {
    buildImageBatchesWithDelay(times - 1);
  }, BATCH_FETCH_DELAY_MS);
}

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
function GameOver() {
  document
    .querySelectorAll('.image-batch')
    .forEach(batch => batch.remove());
  const finalScoreParagraph = document.createElement('p');
  finalScoreParagraph.textContent = `Game over! You found ${correctAnswers} imposters and
  made ${incorrectAnswers} mistakes. Click on Score to see results.`;
  finalScoreParagraph.style.textAlign = 'center';
  document.querySelector('#images').appendChild(finalScoreParagraph);
}

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

// Hint: what is this function assuming about your localStorage keys?
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

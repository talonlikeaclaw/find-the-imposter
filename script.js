'use strict';

const DOG_API_URL = 'https://dog.ceo/api/breeds/image/random';
const IMAGES_PER_BATCH = 4;
const BATCH_COUNT = 5;
const BATCH_FETCH_DELAY_MS = 1000;
const BATCH_REMOVE_DELAY_MS = 10000;

let correctAnswers = 0;
let incorrectAnswers = 0;

document.addEventListener('DOMContentLoaded', init);

function init() {
  shuffleLocalStorage();
  buildImageBatchesWithDelay(BATCH_COUNT);
  const scoreButton = document.querySelector('button');
  scoreButton.addEventListener('click', displayChart);
}

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

function buildImageBatchesWithDelay(times) {
  if (times === 0) return;

  addImageBatchImages();

  setTimeout(() => {
    buildImageBatchesWithDelay(times - 1);
  }, BATCH_FETCH_DELAY_MS);
}

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

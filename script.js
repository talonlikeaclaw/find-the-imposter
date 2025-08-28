'use strict';

let correctAnswers = 0;
let incorrectAnswers = 0;

document.addEventListener('DOMContentLoaded', init);

function init() {
  shuffleLocalStorage();
  addImageBatchImages();
  const scoreButton = document.querySelector('button');
  scoreButton.addEventListener('click', displayChart);
}

function createImageBatch() {
  const imageSection = document.querySelector('#images');
  const imageBatch = document.createElement('section');

  imageBatch.classList.add('image-batch');
  imageBatch.addEventListener('click', handleBatchClick);
  imageSection.appendChild(imageBatch);

  return imageBatch;
}

function addImageBatchImages() {
  const imageBatch = createImageBatch();
  fetchImageUrl('https://dog.ceo/api/breeds/image/random')
    .then(imageUrl => {
      const firstDogImage = document.createElement('img');
      firstDogImage.src = imageUrl;
      firstDogImage.classList.add('batch-item');
      firstDogImage.classList.add('nonimposter');
      firstDogImage.classList.add('notClicked');

      const secondDogImage = document.createElement('img');
      secondDogImage.src = 'assets/puppy-02.jpg';
      secondDogImage.classList.add('batch-item');
      secondDogImage.classList.add('nonimposter');
      secondDogImage.classList.add('notClicked');

      const thirdDogImage = document.createElement('img');
      thirdDogImage.src = 'assets/puppy-03.jpg';
      thirdDogImage.classList.add('batch-item');
      thirdDogImage.classList.add('nonimposter');
      thirdDogImage.classList.add('notClicked');

      const imposterBearImage = document.createElement('img');
      imposterBearImage.src = 'assets/bear-01.jpg';
      imposterBearImage.classList.add('batch-item');
      imposterBearImage.classList.add('imposter');
      imposterBearImage.classList.add('notClicked');

      imageBatch.appendChild(firstDogImage);
      imageBatch.appendChild(secondDogImage);
      imageBatch.appendChild(thirdDogImage);
      imageBatch.appendChild(imposterBearImage);
    })
    .catch(error => console.error(error));
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

function handleBatchClick(event) {
  // Correctly guessed imposter
  if (event.target.classList.contains('imposter')) {
    event.target.style.borderColor = 'green';
    event.target.style.borderWidth = '5';
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

function fetchImageUrl(url) {
  return fetch(url)
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

function displayChart() {
  // this is a inline eslint setting to ignore the Chart global variable
  /* global Chart */
  const data = {
    labels: ['Correct', 'Incorrect'],
    datasets: [{
      label: 'Results',
      data: [correctAnswers, incorrectAnswers],
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
      ],
      borderColor: [
        'rgb(54, 162, 235)',
        'rgb(255, 99, 132)',
      ],
      borderWidth: 1,
    }],
  };
  const config = {
    type: 'bar',
    data: data,
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
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
  const keys = Object.keys(localStorage).
    map(Number).
    filter(k => Number.isInteger(k) && k >= 0);
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
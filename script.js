'use strict';

let correctAnswers = 0;
let incorrectAnswers = 0;
function createImageBatch() {
  const imageSection = document.querySelector('#images');
  const imageBatch = document.createElement('section');

  imageBatch.classList.add('image-batch');
  imageSection.appendChild(imageBatch);

  return imageBatch;
}

function addImageBatchImages() {
  const imageBatch = createImageBatch();

  const firstDogImage = document.createElement('img');
  firstDogImage.src = 'assets/puppy-01.jpg';
  firstDogImage.classList.add('batch-item');

  const secondDogImage = document.createElement('img');
  secondDogImage.src = 'assets/puppy-02.jpg';
  secondDogImage.classList.add('batch-item');

  const thirdDogImage = document.createElement('img');
  thirdDogImage.src = 'assets/puppy-03.jpg';
  thirdDogImage.classList.add('batch-item');

  const imposterBearImage = document.createElement('img');
  imposterBearImage.src = 'assets/bear-01.jpg';
  imposterBearImage.classList.add('batch-item');

  imageBatch.appendChild(firstDogImage);
  imageBatch.appendChild(secondDogImage);
  imageBatch.appendChild(thirdDogImage);
  imageBatch.appendChild(imposterBearImage);
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
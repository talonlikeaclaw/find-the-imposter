
# Find The Imposter Game

Author: Talon Dunbar

## Overview

An silly interactive game where the user must find the imposters amongst groups of images before the timer runs out. When the user selects images they are given feedback indicating if they correctly found the imposter or not. The user's score is tallied dynamically and is displayed in a bar chart for the user to view during/after the game.

### Example Gameplay

![Example Gameplay](assets/example-01.png)

### Stakeholder Requirements

- Create a website that enables the user to play a "Guess The Imposter" image game.
- The client checks the Local Storage to potentially fill images (check we have enough images).
- Timer delays are stored as constants for fetching and removing batches of images.
- The Local Storage keys are randomized on initialization if images exist in Local Storage.
- If no images are found in Local Storage, we fetch 20 images in batches of four from a public image API with some delay between fetch requests to prevent overwhelming the server.
    - Images are stored in Local Storage using numbered keys.
- Imposter images are fetched each time the game in run.
- The images are then shown in 5 groups of 4 in a 2 x 2 grid.
    - 5 divs displayed in a column each with a random color and containing 4 images in a 2 x 2 grid.
- One of the images is randomly replaced by an imposter image.
- Using HTML classes we can indicate which images are imposters and which are not so we ca track correct/incorrect guesses via click events.
    - Global variables to track click events to fill chart.js bar chart.
    - Users can click multiple images per group and are given feedback for correctly or incorrectly picking the imposter.
        - Green border around image if correct.
        - Fade image if not correct.
- Each batch of 4 images has a timer that removes the batch after the timer runs out.
- User can click a "Score" button during/after gameplay to view their score in a bar chart.
- The bar chart updates dynamically during gameplay.
- Once all the batches are remove, the user get a message indicating the game is over and the amount of correct and incorrect guesses is displayed in the message.

## Setup

### Prerequsites

- Git
- Node.js
- A modern web browser
- VS Code + Live Server Extension

### Steps

1. Clone the repository:
    - `git clone https://gitlab.com/dawson-cst-cohort-2026/520/section3/TalonDunbar/Assignment1.git`
2. Move into the directory
    - `cd Assignment1`
3. Run `npm install` to install the node packages.
4. Run the Live Server:
    1. Open VS Code.
    2. Right click on `index.html` and click "Open With Live Server".
    3. Access the game at `http://127.0.0.1:5500/index.html` by default.

What if they want to check code style at the command-line?

## Credits

Cite external sources and what they helped you with. 
(Please add comments above any code that was heavily inspired by external sources.)
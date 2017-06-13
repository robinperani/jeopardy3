// This screen allows the user to play the jeopardy game itself

class PlayGameScreen {
  constructor(containerElement, onPlayGameCallback) {
    this.containerElement = containerElement;
    this.onPlayGameCallback = onPlayGameCallback;
    this.game = undefined;
    this.playerScore = 0;
    this.countUsed = 0;

    // Bind event listeners.
    this.buttonClick = this.buttonClick.bind(this);
    this.boxClick = this.boxClick.bind(this);

    // Get button references
    this.buttOK = document.querySelector('#play-game-screen .ok-button');
    this.buttCancel = document.querySelector('#play-game-screen .cancel-button');
    this.buttSubmit = document.querySelector('#play-game-screen .submit-button');

    this.chosenQuestion = document.querySelector('#play-game-screen #jeop-chosen-question');
    this.submittedAnswer = document.querySelector('#play-game-screen #player-answer');
    this.displayPlayerScore = document.querySelector('#play-game-screen #p1-score');

    this.titles = document.querySelectorAll('#play-game-screen .jeop-title-box');

    // Install Event listeners
    this.buttOK.addEventListener('click',this.buttonClick);
    this.buttCancel.addEventListener('click',this.buttonClick);
    this.buttSubmit.addEventListener('click',this.buttonClick);

    //Add Event Listeners to all jeop-boxes.
    this.jeopBoxes = document.querySelectorAll('#play-game-screen .jeop-box');
    for (let i=0; i<this.jeopBoxes.length; i++) {
      let box = this.jeopBoxes[i];
      box.addEventListener('click',this.boxClick);
    }
  }

//when a box is clicked the chosen question box becomes active and shows the answer
// when the answer is provided the chosen question box becomes inactive again and disappears
  boxClick(event) {
    let box = event.currentTarget;
    let boxID = box.id;
    this.chosenQuestion.classList.remove('inactive');
    let catIndex = boxID.substring(7,8);
    let qIndex = boxID.substring(10,11); //html file
    let game = this.game;

    let cats = game['categories'];
    let cat = cats[catIndex];

    let questions = cat['questions'];
    let triplet = questions[qIndex];

    let qqq = triplet['question'];

    this.chosenQuestion.textContent = qqq;

    this.correctAnswer = triplet['answer'];

    this.correctValue = triplet['value'];

    this.speak("BoxID is " + boxID + "and box is " + box);

    this.speak("qqq is  " + qqq);

    box.removeEventListener('click', this.boxClick);
    box.style.color = '#060CE9';
    this.countUsed++;
  }



  init(game) {
    this.game = game;

    this.playerScore = 0;
    this.displayPlayerScore.textContent = this.playerScore;

    let cats = game['categories'];
    for (let i=0; i<cats.length; i++) {
      let cat = cats[i];
      let catName = cat['name'];
      this.titles[i].textContent = catName;
    }

    let index = 0;

    for (let i=0; i<cats.length; i++) {
      let cat = cats[i];
      let questions = cat['questions'];
      for (let j=0; j<questions.length; j++) {
        let triplet = questions[j];
        let box = this.jeopBoxes[index];
        // make sure boxes answered from previous game are made active
        box.classList.remove('inactive');
        box.addEventListener('click',this.boxClick);
        box.style.color = '#FFD700';
        box.textContent = triplet['value'];
        index++;
      }
    }
  }

//if the person clicks the submit button the answer is compared to the correct answer
//the value of the answer is added or subtracted to the players score and the score is updated
  buttonClick(event) {
    if (event.currentTarget === this.buttOK) {
      this.speak("Winner!!!!")
      this.onPlayGameCallback(true, undefined);
    } else if (event.currentTarget === this.buttCancel) {
      this.speak("Cancel")
      this.onPlayGameCallback(false, undefined);
    } else if (event.currentTarget === this.buttSubmit) {
      this.chosenQuestion.classList.add('inactive');
      this.speak("Submit")
      if (this.checkAnswer() === true) {
        let correctInt = parseInt(this.correctValue, 10);
        this.speak(correctInt + "is correctInt #");
        let playerScoreInt = parseInt(this.playerScore, 10);
        this.speak(playerScoreInt + "is playerScoreInt #");
        let newPlayerScore = correctInt + playerScoreInt;
        this.playerScore = newPlayerScore;
        this.speak(newPlayerScore + "is newPlayerScore #");
      } else {
        let correctInt = parseInt(this.correctValue, 10);
        let playerScoreInt = parseInt(this.playerScore, 10);
        let newPlayerScore = playerScoreInt - correctInt;
        this.playerScore = newPlayerScore;
        this.speak(newPlayerScore + "is newPlayerScore #");
      }
      this.displayPlayerScore.textContent = this.playerScore;
      this.submittedAnswer.value = "";
    } else {
      this.speak("Should not get here!")
    }
    if(this.countUsed === 30) {
      gameOver();
    }
  }

//checks to see if the submitted and correct answers match (not case sensitive)
  checkAnswer() {
    let sa = this.submittedAnswer.value.toLowerCase();
    let ca = this.correctAnswer.toLowerCase();
    this.speak ("ca is " + ca + "sa is " + sa);
    if (sa === ca) {
      return (true);
    } else {
      return (false);
    }
  }

  show() {
    this.containerElement.classList.remove('inactive');
  }

//Shows the text that the game is over (prompted when all 30 boxes have been clicked)
  gameOver() {
    this.chosenQuestion.classList.remove('inactive');
    this.chosenQuestion.textContent = "Game is OVER!  See score below";
    this.chosenQuestion.classList.add('inactive');
    this.speak("game is over");
  }

  hide() {
    this.containerElement.classList.add('inactive');
  }

  speak(message) {
    console.log(message);
  }
}

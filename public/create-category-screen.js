// This is the screen that allows the user to create a specific category
// each category includes question, answers, values that if chosen will be pulled into the game

class CreateCategoryScreen {
  constructor(containerElement, onCreateCatCallback) {
    this.containerElement = containerElement;
    this.onCreateCatCallback = onCreateCatCallback;
    this.extractCat = undefined;

    // Bind event listeners.
    this.buttonClick = this.buttonClick.bind(this);

    // Get Name reference
    this.tboxName = document.querySelector('#category-name');

    // Get question answer value references
    this.tboxValues = document.querySelectorAll('#create-category-screen .jeop-value');
    this.tboxAnswers = document.querySelectorAll('#create-category-screen .jeop-answer');
    this.tboxQuestions = document.querySelectorAll('#create-category-screen .jeop-question');

    // Get button references
    this.buttCreate = document.querySelector('#create-category-screen .ok-button');
    this.buttCancel = document.querySelector('#create-category-screen .cancel-button');

    // Install Event listeners
    this.buttCreate.addEventListener('click',this.buttonClick);
    this.buttCancel.addEventListener('click',this.buttonClick);
  }

//if choose category button pressed, creates a new category from Inputs
//if the cancel button is pressed no category is created
  buttonClick(event) {
    event.preventDefault();
    if (event.currentTarget === this.buttCreate) {
      this.extractCat = this.extractCategory();
      this.onCreateCatCallback(true, this.extractCat);
    } else if (event.currentTarget === this.buttCancel) {
      this.onCreateCatCallback(false, undefined);
    } else {
      this.speak("Should not get here!");
    }
  }

  extractCategory() {
    let catName = this.tboxName.value;
    let catTriplets = [];

    for (let i=0; i < 5; i++) {
      this.speak("i is: " + i);
      let tripValue = this.tboxValues[i].value;
      let tripAnswer = this.tboxAnswers[i].value;
      let tripQuestion = this.tboxQuestions[i].value;
      this.speak("Trip Value: " + tripValue + "Trip Ans: " + tripAnswer + "Trip Ques: "+ tripQuestion);

      let trip = {value:tripValue, answer:tripAnswer, question:tripQuestion };
      catTriplets[i] = trip;
    }

    let category = {name:catName, questions:catTriplets};
    return(category);
  }

  init() {
    // prepopulate the values
    for (let i=0; i < 5; i++) {
      this.tboxValues[i].value = (i+1)*100;
    }
  }

  show() {
    this.containerElement.classList.remove('inactive');
  }

  hide() {
    this.containerElement.classList.add('inactive');
  }

//for testing
  speak(message) {
    console.log(message);
  }
}

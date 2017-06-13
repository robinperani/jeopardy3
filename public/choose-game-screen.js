//Screen that allows the user to choose the game he/she would like to play
// games can come either from a default or from the list the user is making

class ChooseGameScreen {
  constructor(containerElement, onChooseGameCallback) {
    this.containerElement = containerElement;
    this.onChooseGameCallback = onChooseGameCallback;
    this.games = undefined;

    // Bind event listeners.
    this.buttonClick = this.buttonClick.bind(this);

    // Get the Game menu reference
    this.menuRef = document.querySelector('#choose-game-screen .game-menu');

    // Get button references
    this.buttChoose = document.querySelector('#choose-game-screen .ok-button');
    this.buttCancel = document.querySelector('#choose-game-screen .cancel-button');

    // Install Event listeners
    this.buttChoose.addEventListener('click',this.buttonClick);
    this.buttCancel.addEventListener('click',this.buttonClick);
  }

//When the button is "choose" then that creates the game that is chosenGame
//when the button is cancel, then it returns the user to the WelcomeScreen
  buttonClick(event) {
    event.preventDefault();
    if (event.currentTarget === this.buttChoose) {
      this.speak("Chooose It!")
      let game = this.extractGame();
      this.onChooseGameCallback(true, game);
    } else if (event.currentTarget === this.buttCancel) {
      this.speak("Cancel")
      this.onChooseGameCallback(false, undefined);
    } else {
      this.speak("Should not get here!")
    }
  }

//Gets the title of available games
  getTitledGame(findTitle) {
    for (let i=0; i < this.games.length; i++) {
      let game = this.games[i];
      let indexTitle = game.title;
      if (findTitle === indexTitle) {
        return(game);
      }
    }
    this.speak("Should not get here");
    return(undefined);
  }

  //if choose game button pressed, creates a new game from Inputs
  //if the cancel button is pressed no game is created
  extractGame() {
    let menu = this.menuRef;
    let index = menu.selectedIndex;
    let gameTitle = menu.options[index].text;

    let game = this.getTitledGame(gameTitle);
    return(game);
  }

  init(games) {
    this.games = games;
    let menu = this.menuRef;

    // Get rid of theold list
    let staleCount = menu.options.length;
    for (let j=staleCount-1; j >= 0; j--) {
      menu.remove(j);
    }

    // Create a new list
    for (let i=0; i < games.length; i++) {
      let game = games[i];
      let title = game['title'];

      let option = document.createElement("option");
      option.text = title;
      menu.add(option);
    }
  }

  show() {
    this.containerElement.classList.remove('inactive');
  }

  hide() {
    this.containerElement.classList.add('inactive');
  }

//for testing only
  speak(message) {
    console.log(message);
  }
}

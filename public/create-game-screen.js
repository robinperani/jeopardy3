// this is the screen that allows the user to create a game by pulling categories

class CreateGameScreen {
  constructor(containerElement, onCreateGameCallback) {
    this.containerElement = containerElement;
    this.onCreateGameCallback = onCreateGameCallback;
    this.cats = undefined;

    // Bind event listeners.
    this.buttonClick = this.buttonClick.bind(this);

    // Get title reference
    this.tboxTitle = document.querySelector('#game-title');

    // Get the six category menu references
    this.menuRefs = document.querySelectorAll('#create-game-screen .cat-menu');

    // Get button references
    this.buttCreate = document.querySelector('#create-game-screen .ok-button');
    this.buttCancel = document.querySelector('#create-game-screen .cancel-button');

    // Install Event listeners
    this.buttCreate.addEventListener('click',this.buttonClick);
    this.buttCancel.addEventListener('click',this.buttonClick);
  }

//Note - remember that event.preventDefault() is required for all buttonClick functions!!!
  buttonClick(event) {
    event.preventDefault();
    if (event.currentTarget === this.buttCreate) {
      let game = this.extractGame();
      this.speak("game is " + game);
      this.onCreateGameCallback(true, game);
    } else if (event.currentTarget === this.buttCancel) {
      this.onCreateGameCallback(false, undefined);
    } else {
      this.speak("Should not get here!");
    }
  }

  getNamedCat(findName) {
    for (let i=0; i < this.cats.length; i++) {
      let cat = this.cats[i];
      let indexName = cat.name;
      if (findName === indexName) {
        return(this.cats[i]);
      }
    }
    this.speak("Should not get here");
    return(undefined);
  }

  extractGame() {
    let gameTitle = this.tboxTitle.value;
    let gameCategories = [];

    for (let m=0; m < this.menuRefs.length; m++) {
      let menu = this.menuRefs[m];
      // Get category name of selection
      let index = menu.selectedIndex;
      let catName = menu.options[index].text;
      let cat = this.getNamedCat(catName);
      gameCategories[m] = cat;
    }
    let game = new Object ({title: gameTitle, categories: gameCategories});
    return(game);
  }

  init(cats) {
    // set the default for the Game title
    this.tboxTitle.value = "Game Title";
    // Setup the category pulldown menus
    this.cats = cats;
    for (let m=0; m < this.menuRefs.length; m++) {
      let menu = this.menuRefs[m];
      // Blow away the old list
      this.speak("911 don't forget to blow away the old list");
      // Create a new list
      for (let i=0; i < cats.length; i++) {
        let cat = cats[i];
        let name = cat['name'];

        let option = document.createElement("option");
        option.text = name;
        menu.add(option);
      }
    }
  }

  show() {
    this.containerElement.classList.remove('inactive');
  }

  hide() {
    this.containerElement.classList.add('inactive');
  }

  speak(message) {
    console.log(message);
  }
}

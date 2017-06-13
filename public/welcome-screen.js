// this is the screen that allows the user to select what they would like to do
// the user can create a category, create a game, run a route test, add in defaults, choose a game, and create a game

class WelcomeScreen {
  constructor(containerElement, onWelcomeCallback) {
    this.containerElement = containerElement;
    this.onWelcomeCallback = onWelcomeCallback;

    this.games = undefined;
    this.cats = undefined;
    this.chosenGame = undefined;

    // Bind event listeners.
    this.buttonClick = this.buttonClick.bind(this);
    // Bind callbacks
    this.onPlayGame = this.onPlayGame.bind(this);
    this.onCreateCategory = this.onCreateCategory.bind(this);
    this.onCreateGame = this.onCreateGame.bind(this);
    this.onChooseGame = this.onChooseGame.bind(this);
//    this.onSquawk = this.onSquawk.bind(this);

    // Create VDBMan here - this is the class that can interact with the database
    this.dbman = new VDBMan();

    // Create the Game Play Screen
    const playGameElement = document.querySelector('#play-game-screen');
    this.playGameScreen = new PlayGameScreen(playGameElement, this.onPlayGame);

    // Create the Three Game Master Task Screens
    // Create Category
    const createCategoryElement = document.querySelector('#create-category-screen');
    this.createCategoryScreen = new CreateCategoryScreen(createCategoryElement, this.onCreateCategory);
    // Create Game
    const createGameElement = document.querySelector('#create-game-screen');
    this.createGameScreen = new CreateGameScreen(createGameElement, this.onCreateGame);
    // Choose Game
    const chooseGameElement = document.querySelector('#choose-game-screen');
    this.chooseGameScreen = new ChooseGameScreen(chooseGameElement, this.onChooseGame);

    // Get button references
    this.buttCreateCategory = document.querySelector('#gm-create-category');
    this.buttCreateGame = document.querySelector('#gm-create-game');
    this.buttChooseGame = document.querySelector('#gm-choose-game');
    this.buttPlayGame = document.querySelector('#gm-play-game');
    this.buttRouteTests = document.querySelector('#gm-run-route-tests');
    this.buttXferDefaults = document.querySelector('#gm-xfer-defaults');

    // Install Event listeners
    this.buttCreateCategory.addEventListener('click',this.buttonClick);
    this.buttCreateGame.addEventListener('click',this.buttonClick);
    this.buttChooseGame.addEventListener('click',this.buttonClick);
    this.buttPlayGame.addEventListener('click',this.buttonClick);
    this.buttRouteTests.addEventListener('click',this.buttonClick);
    this.buttXferDefaults.addEventListener('click',this.buttonClick);
  }

  async init() {
    let result = await this.dbman.init();
    return(result);
  }

//allows the user to select different screens and initializes the content for these screens via the DB
  async buttonClick(event) {
    event.preventDefault();
    this.speak("BEGIN WELCOME BUTTON CLICK: " + event.currentTarget);
    if (event.currentTarget === this.buttCreateCategory) {
      this.speak("Time to create a category!");
      this.hide();
      this.createCategoryScreen.init();
      this.createCategoryScreen.show();
    } else if (event.currentTarget === this.buttCreateGame) {
      this.speak("Time to create a game!");
      this.hide();
      this.cats = await this.dbman.getAllCategories();
      this.createGameScreen.init(this.cats);
      this.createGameScreen.show();
    } else if (event.currentTarget === this.buttChooseGame) {
      this.speak("Time to choose a game!");
      this.hide();
      this.games = await this.dbman.getAllGames();
      this.chooseGameScreen.init(this.games);
      this.chooseGameScreen.show();
    } else if (event.currentTarget === this.buttPlayGame) {
      this.speak("Time to Play a game!");
      this.hide();
      if (this.chosenGame === undefined) {
        this.playGameScreen.init(SINGLE_JEOPARDY);
      } else {
        this.playGameScreen.init(this.chosenGame);
      }
      this.playGameScreen.show();
    } else if (event.currentTarget === this.buttRouteTests) {
      let routeResult = await this.dbman.runRouteTests();
    } else if (event.currentTarget === this.buttXferDefaults) {
      let xferResult = await this.dbman.xferDefaults();
    } else {
      this.speak("Should not get here!");
    }

    this.speak("END WELCOME BUTTON CLICK: " + event.currentTarget);
  }

  onPlayGame(proceed, winner) {
    this.speak("ON PLAY GAME");
    this.playGameScreen.hide();
    if (proceed) {
      this.speak("winner " + winner);
    }
    this.show();
  }

// move back to welcome screen and create category (if created)
  async onCreateCategory(proceed, category) {
    this.speak("ON CREATE CATEGORY");
    this.createCategoryScreen.hide();
    if (proceed) {
      let result = await this.dbman.addCategory(category);
    }
    this.show();
  }

  // move back to welcome screen and create game (if created)
  async onCreateGame(proceed, game) {
    this.speak("ON CREATE GAME");
    this.createGameScreen.hide();
    if (proceed) {
      let result = await this.dbman.addGame(game);
    }
    this.show();
  }

  // move back to welcome screen and sets game (if chosen)
  onChooseGame(proceed, game) {
    this.chooseGameScreen.hide();
    if (proceed) {
      this.chosenGame = game;
    }
    this.show();
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

// Most of the work is done in the welcomeScreen
// App initializes the welcomeScreen

class App {
  constructor() {
    this.onWelcome = this.onWelcome.bind(this);
    this.jeopardyGame = undefined;

    const welcomeElement = document.querySelector('#welcome-screen');
    this.welcome = new WelcomeScreen(welcomeElement, this.onWelcome);

    this.welcome.init();
  }

  onWelcome(game){
  }
}

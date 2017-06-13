// VDBMan stands for Virtual Database Manager
// In the course of writing this application the first implementation
// was entirely with the hardcoded constants in jeopardy-constants.js.
// The next implementation used the google spreadsheet API.
// Finally this version uses MongoDB style calls for GET and POST.
// The rest of the application is insulated from this progression
// and only interacts with the database via the VDBMan class.

class VDBMan {

constructor() {
    this.categories = new Array();
    this.games = new Array();
    // useMongo is used for toggling between:
    // a) in memory database populated with constants or
    // b) Mongo database
    this.useMongo = true;
  }

  async init() {
    if (this.useMongo) {
      // any mongo initialization goes here.
      //
      // need this on Mongo side for unit testing routes
      this.pushConstantJSON();
    } else {
      // will be working with in memory database populated with constants.
      this.pushConstantJSON();
    }
    return(true);
  }

  async xferDefaults() {
    let result = await this.dbPushConstantJSON();
    return(result);
  }

// This section has the basic accessor functions for the database.
// addCategory, addGame
// getNamedCategory, getNamedGame,
// getAllCategories, getAllGames

  async addCategory(clientCat){
    if (this.useMongo) {
      let result = await this.dbPostCat(clientCat);
    } else {
      this.categories.push(clientCat);
    }
  }


  async addGame(clientGame){
    if (this.useMongo) {
      let result = await this.dbPostGame(clientGame);
    } else {
      this.games.push(clientGame);
    }
  }

  async getNamedCategory(name) {
    if (this.useMongo) {
      let clientCat = await this.dbGetCat(name);
      return(clientCat);
    } else {
      for(let i=0; i < this.categories.length; i++) {
        let cat = this.categories[i];
        let indexName = cat.name;
        if (indexName === name) {
          return(cat);
        }
      }
      return (undefined);
    }
  }

  async getNamedGame(title) {
    if (this.useMongo) {
      let clientGame = await this.dbGetGame(title);
      return (clientGame);
    } else {
      for(let i=0; i < this.games.length; i++) {
        let game = this.games[i];
        let indexTitle = game.title;
        if (indexTitle === title) {
          return(game);
        }
      }
      return (undefined);
    }
  }

  async getAllCategories() {
    if (this.useMongo) {
      let cats = await this.dbGetAllCats();
      return(cats);
    } else {
      return (this.categories);
    }
  }

  async getAllGames() {
    if (this.useMongo) {
      let games = await this.dbGetAllGames();
      return(games);
    } else {
      return (this.games);
    }
  }

// There are two types of categories and games in the application.
// On the user interaction side the code is much easier to work with when
// the questions, categories, and games are stored in a higherarchical way
// On the server side it's difficult to work with higherarchical
// data so the categories and games are flattened.  This makes them easy
// to store and retrieve from mongo.

// This section has the four translator functions
// toClientCat, toClientGame
// toServerCat, and toServerGame


  // toClientGame has to be async.  Making toClientCat async also for consistency
  async toClientCat(serverCat) {
    let clientCat = {};
    let name = serverCat['name'];
    let trips = [];

    clientCat['name'] = name;

    trips[0] = {question: serverCat['q0'], answer: serverCat['a0'], value: serverCat['v0']};
    trips[1] = {question: serverCat['q1'], answer: serverCat['a1'], value: serverCat['v1']};
    trips[2] = {question: serverCat['q2'], answer: serverCat['a2'], value: serverCat['v2']};
    trips[3] = {question: serverCat['q3'], answer: serverCat['a3'], value: serverCat['v3']};
    trips[4] = {question: serverCat['q4'], answer: serverCat['a4'], value: serverCat['v4']};

    clientCat['questions'] = trips;

    return (clientCat);
  }

  async toClientGame(serverGame){
    let clientGame = {};
    let title = serverGame['title'];
    let cats = [];

    clientGame['title'] = title;

    let catName0 = serverGame['cat0'];
    cats[0] = await this.getNamedCategory(catName0);
    let catName1 = serverGame['cat1'];
    cats[1] = await this.getNamedCategory(catName1);
    let catName2 = serverGame['cat2'];
    cats[2] = await this.getNamedCategory(catName2);
    let catName3 = serverGame['cat3'];
    cats[3] = await this.getNamedCategory(catName3);
    let catName4 = serverGame['cat4'];
    cats[4] = await this.getNamedCategory(catName4);
    let catName5 = serverGame['cat5'];
    cats[5] = await this.getNamedCategory(catName5);
    clientGame['categories'] = cats;

    return (clientGame);
  }

  toServerCat(clientCat) {
    let name = clientCat['name'];
    let trips = clientCat['questions'];
    let serverCat = {};

    serverCat['name'] = name;
    serverCat['q0'] = trips[0].question;
    serverCat['a0'] = trips[0].answer;
    serverCat['v0'] = trips[0].value;

    serverCat['q1'] = trips[1].question;
    serverCat['a1'] = trips[1].answer;
    serverCat['v1'] = trips[1].value;

    serverCat['q2'] = trips[2].question;
    serverCat['a2'] = trips[2].answer;
    serverCat['v2'] = trips[2].value;

    serverCat['q3'] = trips[3].question;
    serverCat['a3'] = trips[3].answer;
    serverCat['v3'] = trips[3].value;

    serverCat['q4'] = trips[4].question;
    serverCat['a4'] = trips[4].answer;
    serverCat['v4'] = trips[4].value;

    return (serverCat);
  }

  toServerGame(clientGame) {
    let title = clientGame['title'];
    let cats = clientGame['categories'];
    let serverGame = {};

    serverGame['title'] = title;
    serverGame['cat0'] = cats[0].name;
    serverGame['cat1'] = cats[1].name;
    serverGame['cat2'] = cats[2].name;
    serverGame['cat3'] = cats[3].name;
    serverGame['cat4'] = cats[4].name;
    serverGame['cat5'] = cats[5].name;

    return (serverGame);
  }

// This section has the GET and POST methods for categories and games.
// dbPostCat, dbPostGame
// dbGetCat, dbGetGame
// dbGetAllCats, dbGetAllGames

// This is the only location where serverCats and serverGames are used, i.e.
// they are interal data structures for the GET and POST methods.

// Inputs and outputs are clientCats and clientGames.

  async dbPostCat(clientCat) {
    let serverCat = this.toServerCat(clientCat);
    const fetchOptions = {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(serverCat)
    };
    const result = await fetch('/savecat', fetchOptions);
    const json = await result.json();
  }

  async dbPostGame(clientGame) {
    let serverGame = this.toServerGame(clientGame);
    const fetchOptions = {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(serverGame)
    };
    const result = await fetch('/savegame', fetchOptions);
    const json = await result.json();
  }

  async dbGetCat(name) {
    const result = await fetch('/getcat/' + name);
    const json = await result.json();
    let clientCat = await this.toClientCat(json);
    return(clientCat);
  }

  async dbGetGame(title) {
    const result = await fetch('/getgame/' + title);
    const json = await result.json();
    let clientGame = await this.toClientGame(json);
    return(clientGame);
  }

  async dbGetAllCats() {
    const result = await fetch('/getallcats');
    const json = await result.json();
    let length = json.length;
    let cats = json.cats;
    let clientCats = [];

    console.log("dbGetAllCats length is: " + length);
    if (length !== 0) {
      for (let i=0; i < length; i++) {
        let serverCat = cats[i];
        let clientCat = await this.toClientCat(serverCat);
        clientCats.push(clientCat)
      }
      return(clientCats);
    } else {
      return(null);
    }
  }

  async dbGetAllGames() {
    const result = await fetch('/getallgames');
    const json = await result.json();
    let length = json.length;
    let games = json.games;
    let clientGames = [];

    console.log("dbGetAllGames length is: " + length);
    if (length !== 0) {
      for (let i=0; i < length; i++) {
        let serverGame = games[i];
        let clientGame = await this.toClientGame(serverGame);
        clientGames.push(clientGame)
      }
      return(clientGames);
    } else {
      return(null);
    }
  }

  // This section has the methods to transfer the two default constant games
  // to the database.

  async dbPushOne(game) {
    let gameTitle = game['title'];
    let gameCategories = game['categories'];
    this.speak("PUSH ONE: " + gameTitle);
    let result = undefined;

    for (let i=0; i < gameCategories.length; i++){
      let cat = gameCategories[i];
      result = await this.dbPostCat(cat);
    }
    result = await this.dbPostGame(game);

    return result;
  }

  async dbPushConstantJSON() {
    let result = await this.dbPushOne(SINGLE_JEOPARDY);
    result = await this.dbPushOne(DOUBLE_JEOPARDY);
    return(result);
  }

// This section is useful for when (for some reason) it is best to use
// jeopardy-constants for the database.

  pushOne(game) {
    let gameTitle = game['title'];
    let gameCategories = game['categories'];
    this.speak("PUSH ONE: " + gameTitle);

    for (let i=0; i < gameCategories.length; i++){
      let cat = gameCategories[i];
      this.nsAddCategory(cat);
    }
    this.nsAddGame(game);
  }

  // non-switched version needed by pushContJson
  nsAddCategory(clientCat){
    this.categories.push(clientCat);
  }

  // non-switched version needed by pushContJson
  nsAddGame(clientGame){
    this.games.push(clientGame);
  }


  pushConstantJSON() {
    this.pushOne(SINGLE_JEOPARDY);
    this.pushOne(DOUBLE_JEOPARDY);
  }

// TEST CODE ONLY FROM HERE DOWN
// This is what supports the route testing to show that the program is connected and working properly

  async runRouteTests(){
    // testing get and post of categories
    // POST
    let result = this.runSixRouteTests();
  }

  async runSixRouteTests(){
    // UNIT testing of GET and POST routes for games and categories
    // POST
    let clientCat = this.categories[0];
    // this is the simplest test case.
    // here is a route that works with hardcoded bird collection
    // on the server side.
    // this.dbPostBird(clientCat);

    // testing get and post of categories
    // POST
    let res1 = await this.dbPostCat(clientCat);
    // GET
    let catName = clientCat.name;
    let gottenCat = await this.dbGetCat(catName);
    let gottenName = gottenCat.name;
    console.log("cat name is " + catName + " gottenName is " + gottenName);

    // testing get and post of games
    // POST
    let clientGame = this.games[0];
    let res2 = await this.dbPostGame(clientGame);
    // GET
    let gameTitle = clientGame.title;
    let gottenGame = await this.dbGetGame(gameTitle);
    let gottenTitle = gottenGame.title;
    console.log("game title is " + gameTitle + " gottenTitle is " + gottenTitle);

    // testing get all games
    let clientGame2 = this.games[1];
    let res3 = this.dbPostGame(clientGame2);
    let manyGames = await this.dbGetAllGames();
    let mglength = manyGames.length;
    console.log("manygames has length: " + mglength);

    // testing get all categories
    let clientCat2 = this.categories[1];
    let res4 = await this.dbPostCat(clientCat2);
    let clientCat3 = this.categories[2];
    let res5 = await this.dbPostCat(clientCat3);
    let manyCats = await this.dbGetAllCats();
    let mclength = manyCats.length;
    console.log("manycats has length: " + mclength);

    return(true);
  }

  async runGetAllRouteTests(){
    // testing get and post of categories
    // POST
    let result = await this.dbPushConstantJSON();

    let manyCats = await this.dbGetAllCats();
    let mclength = manyCats.length;
    console.log("manycats has length: " + mclength);

    let manyGames = await this.dbGetAllGames();
    let mglength = manyGames.length;
    console.log("manygames has length: " + mglength);

    return(true);
  }

  async dbPostBird(clientCat) {
    // savebird route for testing removed from server
    /*
    let serverCat = this.toServerCat(clientCat);
    const fetchOptions = {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(serverCat)
    };
    const result = await fetch('/savebird', fetchOptions);
    const json = await result.json();
    */
  }

//for testing only
  speak(message) {
    console.log(message);
  }
}

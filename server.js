const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;

const app = express();
const jsonParser = bodyParser.json();
app.use(express.static('public'));

/* WAS
const DATABASE_NAME = 'jeopardy-game';
const MONGO_URL = `mongodb://localhost:27017/${DATABASE_NAME}`;
*/
/* MOVE TO THIS
async function main() {
  const DATABASE_NAME = 'cs193x-db';
  const MONGO_URL = `mongodb://localhost:27017/${DATABASE_NAME}`;

  // The "process.env.MONGODB_URI" is needed to work with Heroku.
  db = await MongoClient.connect(process.env.MONGODB_URI || MONGO_URL);

  // The "process.env.PORT" is needed to work with Heroku.
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Server listening on port ${port}!`);
};
*/

/* NOW */
const DATABASE_NAME = 'jeopardy-game';
const MONGO_URL = `mongodb://localhost:27017/${DATABASE_NAME}`;


let db = null;
let gameCollection = null;
let catCollection = null;
let birdCollection = null;

async function confirmSavedGame(gameTitle) {
  // testing see if it went in
  const query = {
    title: gameTitle
  };
  const response = await gameCollection.findOne(query);
  console.log("The GAME says " + response.title);
}

async function onSaveGame(req, res) {
  const game = req.body;
  console.log("ROUTE /savegame ENTER ... game title is: " + game.title);
  const response = await gameCollection.insertOne(game);
  // testing only
  // confirmSavedGame(game.title);
  console.log("ROUTE /savegame EXIT");
  res.json({ gameID: response.insertedId });
}
app.post('/savegame', jsonParser, onSaveGame);

async function confirmSavedCat(catName) {
  // testing see if it went in
  const query = {
    name: catName
  };
  const response = await catCollection.findOne(query);
  console.log("The CAT says " + response.name);
}

async function onSaveCat(req, res) {
  const cat = req.body;
  console.log("ROUTE /savecat ENTER ... category name is: " + cat.name);
  const response = await catCollection.insertOne(cat);
  // testing
  // confirmSavedCat(cat.name);
  console.log("ROUTE /savecat EXIT");
  res.json({ catID: response.insertedId });
}
app.post('/savecat', jsonParser, onSaveCat);


async function onGetCat(req, res) {
  const routeParams = req.params;
  const catName = routeParams.name;
  console.log("ROUTE /getcat/:name ENTER ... category name is " + catName);

  const query = {
    name: catName
  };
  const result = await catCollection.findOne(query);

  const response = {
    _id: result._id,
    name: result.name,
    q0: result.q0,
    a0: result.a0,
    v0: result.v0,

    q1: result.q1,
    a1: result.a1,
    v1: result.v1,

    q2: result.q2,
    a2: result.a2,
    v2: result.v2,

    q3: result.q3,
    a3: result.a3,
    v3: result.v3,

    q4: result.q4,
    a4: result.a4,
    v4: result.v4,
  };
  console.log("ROUTE /getcat/:name EXIT");
  res.json(response);
}
app.get('/getcat/:name', onGetCat);


async function onGetGame(req, res) {
  const routeParams = req.params;
  const gameTitle = routeParams.title;
  console.log("ROUTE /getgame/:title ENTER ... game title is: " + gameTitle);

  const query = {
    title: gameTitle
  };
  const result = await gameCollection.findOne(query);

  const response = {
    _id: result._id,
    title: result.title,
    cat0: result.cat0,
    cat1: result.cat1,
    cat2: result.cat2,
    cat3: result.cat3,
    cat4: result.cat4,
    cat5: result.cat5
  };
  console.log("ROUTE /getgame/:title EXIT");
  res.json(response);
}
app.get('/getgame/:title', onGetGame);

async function onGetAllCats(req, res) {
  console.log("ROUTE /getallcats ENTER");
  const routeParams = req.params;
  const gameTitle = routeParams.title;
  let respArr = [];

  // pass empty query to find to get all games
  const results = await catCollection.find().toArray();

  for (const result of results) {
    const resp = {
      _id: result._id,
      name: result.name,
      q0: result.q0,
      a0: result.a0,
      v0: result.v0,

      q1: result.q1,
      a1: result.a1,
      v1: result.v1,

      q2: result.q2,
      a2: result.a2,
      v2: result.v2,

      q3: result.q3,
      a3: result.a3,
      v3: result.v3,

      q4: result.q4,
      a4: result.a4,
      v4: result.v4,
    };
    respArr.push(resp);
  }

  const response = {
    length: respArr.length,
    cats: respArr
  };

  console.log("ROUTE /getallcats EXIT");
  res.json(response);
}
app.get('/getallcats', onGetAllCats);

async function onGetAllGames(req, res) {
  const routeParams = req.params;
  const gameTitle = routeParams.title;
  console.log("ROUTE /getallgames ENTER");
  let respArr = [];

  // pass empty query to find to get all games
  const results = await gameCollection.find().toArray();

  for (const result of results) {
    const resp = {
      _id: result._id,
      title: result.title,
      cat0: result.cat0,
      cat1: result.cat1,
      cat2: result.cat2,
      cat3: result.cat3,
      cat4: result.cat4,
      cat5: result.cat5
    };
    respArr.push(resp);
  }

  const response = {
    length: respArr.length,
    games: respArr
  };
  console.log("ROUTE /getallgames EXIT");
  res.json(response);
}
app.get('/getallgames', onGetAllGames);

/* WAS
async function startServer() {
  // Set the db and collection variables before starting the server.
  db = await MongoClient.connect(MONGO_URL);
  gameCollection = db.collection('games_v25');
  catCollection = db.collection('cats_v25');

  // Now every route can safely use the db and collection objects.
  await app.listen(port);
  console.log('Listening on port ' + port);
}
startServer();
*/

/* NOW */
async function startServer() {
  // The "process.env.MONGODB_URI" is needed to work with Heroku.
  db = await MongoClient.connect(process.env.MONGODB_URI || MONGO_URL);

  gameCollection = db.collection('games_v26');
  catCollection = db.collection('cats_v26');

  // The "process.env.PORT" is needed to work with Heroku.
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Server listening on port ${port}!`);
}
startServer();

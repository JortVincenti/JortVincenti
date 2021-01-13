var gameboard = new Array(8);
for (var i = 0; i < gameboard.length; i++) {
    gameboard[i] = new Array(8);
}
for(var i = 0; i < gameboard.length; i++){
    for(var j = 0; j < 8; j++){
        gameboard[i][j] = 0;
    }
}


var turn = 0;
var finished = false;
var winner;

const express = require('express')
const websocket = require("ws")
const http = require("http")
const path = require('path')
var indexRouter = require("./routes/index");
const gameStatus = require('./statTracker');
var GameObject = require("./GameObject");
var messages = require("./public/javascripts/messages");
const { inflate } = require('zlib');
const game = require('./GameObject');
const { argv0 } = require('process');
const app = express()
const port = 8080; 
let connection = null

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.get('/', indexRouter);
app.get("/play", indexRouter);


// Create http server and websocket server
const server = http.createServer(app)
const wss = new websocket.Server({ server })
var websocketArray = {};

//create game and unique ID for websockets that enter the local host
var currentGame = new GameObject(gameStatus.gamesInitialized++); //the game.ID is the number of the game
var connectionID = 0;

//clean up the websockets object
setInterval(function() {
    for (let i in websocketArray) {
      if (Object.prototype.hasOwnProperty.call(websocketArray,i)) {
        let gameObj = websocketArray[i];
        //if the gameObj has a final status, the game is complete/aborted
        if (gameObj.finalStatus != null) {
          delete websocketArray[i];
        }
      }
    }
  }, 50000);

// Handles new connections
wss.on('connection', (ws) => {

  
    //every two players they are added to the same game
    let con = ws;
    con.id = connectionID++;
    let playerType = currentGame.addPlayer(con);
    websocketArray[con.id] = currentGame;

    //inform client about playerType
    con.send(playerType == "1" ? messages.S_PLAYER_1 : messages.S_PLAYER_2);
    console.log("Player %s placed in game %s as %s", con.id, currentGame.id, playerType);

    if (playerType == "1"){
        initGame();
        con.send(playerType);
        con.send(JSON.stringify(gameboard));
    }

    if (currentGame.hasTwoConnectedPlayers()){
        currentGame = new GameObject(gameStatus.gamesInitialized++);

    }

    // Resolves messages
    con.on('message', message => {

        console.log(message);
        var object = JSON.parse(message);
        gameboard = object;
        turn++;
        let gameObj = websocketArray[con.id];
        let isPlayer1 = gameObj.player1 == con ? true : false;
        if (isPlayer1){
            if(finished || checkWinsAndCounters(turn) == '1' || checkWinsAndCounters(turn) == '2' || checkWinsAndCounters(turn) == '1&2'){
                
                if(checkWinsAndCounters(turn) == '1'){
                    gameObj.player1.send(5);
                    gameObj.player2.send(4);
                }
                
                if(checkWinsAndCounters(turn) == '2'){
                    gameObj.player1.send(4);
                    gameObj.player2.send(5);
                }
                
                if(checkWinsAndCounters(turn) == '1&2'){
                    gameObj.player1.send(6);
                    gameObj.player2.send(6);
                }
            }
            
                if (gameObj.hasTwoConnectedPlayers() && checkWinsAndCounters(turn) == '0'){
                    
                    gameObj.player2.send(2);
                    gameObj.player1.send(3);
                    gameObj.player2.send(JSON.stringify(gameboard));
            }
        }
        else{
            checkWinsAndCounters(turn);
            if(finished || checkWinsAndCounters(turn) == '1' || checkWinsAndCounters(turn) == '2' || checkWinsAndCounters(turn) == '1&2'){
               
                if(checkWinsAndCounters(turn) == '1'){
                    gameObj.player1.send(4);
                    gameObj.player2.send(5);
                }
                
                if(checkWinsAndCounters(turn) == '2'){
                    gameObj.player1.send(5);
                    gameObj.player2.send(4);
                }
                
                if(checkWinsAndCounters(turn) == '1&2'){
                    gameObj.player1.send(6);
                    gameObj.player2.send(6);
                }
            }
                
            if (gameObj.hasTwoConnectedPlayers()){
                gameObj.player1.send(1);
                gameObj.player2.send(3);
                gameObj.player1.send(JSON.stringify(gameboard));
                };
            }       

    })
    // Handles disconnects
    con.on('close', _ => {
        console.log('User disconnected');
        //if (code == "1001") {
            /*
             * if possible, abort the game; if not, the game is already completed
             */
            let gameObj = websocketArray[con.id];
            gameObj.setStatus(winner);
            gameStatus.gamesCompleted++;
      
            // if (gameObj.isValidTransition(gameObj.gameState, "ABORTED")) {
            //   gameObj.setStatus("ABORTED");
            //   gameStatus.gamesAborted++;
      
              /*
               * determine whose connection remains open;
               * close it
               */
            //   try {
            //     gameObj.playerA.close();
            //     gameObj.playerA = null;
            //   } catch (e) {
            //     console.log("Player A closing: " + e);
            //   }
      
            //   try {
            //     gameObj.playerB.close();
            //     gameObj.playerB = null;
            //   } catch (e) {
            //     console.log("Player B closing: " + e);
            //   }
            
          //}
    })

});


// Initialise server at port
server.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})



function initGame(){
 
    //places the first tokens on the grid into the array
    gameboard[3][3] = 1;
    gameboard[4][4] = 1;
    gameboard[4][3] = 2;
    gameboard[3][4] = 2;

    // for(let i = 0; i < gameboard.length; i++){
    //     for(let j = 0; j < gameboard.length; j++){
    //         gameboard[i][j] = 2;
    //     }
    // }
    // turn = 59;
    // gameboard[0][0] = 1;
    // gameboard[7][7] = 0;
};


//CHECKS IF GAME IS FINISHED + KEEPS TRACK OF TOTAL NUMBER OF BLACK/WHITE TOKENS
function checkWinsAndCounters(totalNumberOfMoves){

    //add 4 due to the first 4 cells being already played
    totalNumberOfMoves = totalNumberOfMoves + 4;
    let black = 0;
    let white = 0;

    //count the total number of black and white tokens
    for(let i = 0; i < gameboard.length; i++){
        for(let j = 0; j < gameboard.length; j++){
            if(gameboard[i][j] == 1){
                black++;
            }
            if(gameboard[i][j] == '1'){
                black++;
            }    

            if(gameboard[i][j] == '2'){
                white++;
            }
            if(gameboard[i][j] == 2){
                white++;
            }
        }
    }

    //game is finished when all cells have been reached
    if(totalNumberOfMoves == 64){
        finished = true;
        if(black > white){
            winner = '1';
            return winner;
        }
        if(white > black){
            winner = '2';
            return winner;
        }
        else{
            winner = '1&2';
            return winner;
        }
        // close the game && socket connection with the two players

    }
    return '0';
}


// let Rules_button = document.getElementById('Rules_button');
// let Stats_button = document.getElementById('Stats_button');
// let About_button = document.getElementById('About_button');
var canIclick = false;

// VARIABLE INIZIALIZATION
var canv = document.getElementById("canvas");
var ctx = canv.getContext("2d"); 
var boolean = false;
  
var player = 1;         
var lastClicked;
var turn = 0;

// GAMEBOARD INIZIALIZATION
var gameboard = new Array(8);
for (var i = 0; i < gameboard.length; i++) {
    gameboard[i] = new Array(8);
}
for(var i = 0; i < gameboard.length; i++){
    for(var j = 0; j < 8; j++){
        gameboard[i][j] = 0;
    }
}

//WEBSOCKET MESSAGE RECEIVING
const ws = new WebSocket("ws://localhost:8080");
ws.onmessage = message => {
    console.log(`Received: ${message.data}`);
    if (message.data == 1){
        player =  message.data;
        console.log('the player now is:' + player);
    }
    else if (message.data == 2){
        player =  message.data;
        console.log('the player now is:' + player);
    }
    else if (message.data == 3){
        canIclick = false;
        window.alert('waiting for the other player to make a move');
    }
    else if(message.data == 4){
        canIclick = false;
        window.alert('You Won');
        window.close();
    }
    else if(message.data == 5){
        canIclick = false;
        window.alert('Dumbass');
        window.close();
    }
    else if(message.data == 6){
        canIclick = false;
        window.alert('draw');
        window.close();
    }

    else{
        canIclick = true;
        var object = JSON.parse(message.data);
        gameboard = object;
        canIclick = true;
        drawClientGrid(); 
    }
}

// INIZIALIZATION OF THE GRID + UPDATE
var grid = clickableGrid (8, 8, function(el,row,col){
   
    
    if (!canIclick)
        window.alert('you still cannot place a token, waiting for the other player to make a move');
    //if there is a token already drawn in the cell, player cannot position another one
    else if (gameboard[row-1][col-1] != 0)
        window.alert('You cannot place a token here!');
    else if (!checkOKtoPlace(player, row-1, col-1))
        window.alert('You cannot place a token here!');

    //if there is no token inside the cell...
    else{

        //in case we want to modify the style of the cell
        el.class = 'clicked';
        
        //draw token in those coordinates + update arrayGameBoard + check if something needs to be flipped        
        updateGameGrid(player, col-1, row-1);
        parsing(gameboard);
        checkToken(player, row -1 , col - 1);

        if (player == 1)
            noMoreMoves(2);
        if (player == 2)
            noMoreMoves(1);


        // ws.onmessage = message => console.log(`Received: ${message.data}`);
        console.log(gameboard);
        canIclick = false;
        ws.send(JSON.stringify(gameboard));
        
    }
});
document.body.appendChild(grid);

function noMoreMoves(player){

    var totalFreeCells = 0;
    var notPossibleCells = 0;

    for(var i = 0; i < gameboard.length; i++){
        for(var j = 0; j < 8; j++){
            if (gameboard[i][j] == 0 && !checkOKtoPlace(player,i,j))
                notPossibleCells++;
            if (gameboard[i][j] == 0)
                totalFreeCells++;
        }
    }

    if (totalFreeCells == notPossibleCells){
        window.al
        window.close();
    }
};

function parsing(gameboard){
    for(let i = 0; i < gameboard.length; i++){
        for(let j = 0; j < gameboard.length; j++){
            if(gameboard[i][j] == '0'){
                gameboard[i][j] == 0 ;
            }
            if(gameboard[i][j] == '1'){
                gameboard[i][j] == 1 ;
            }
            if(gameboard[i][j] == '2'){
                gameboard[i][j] == 2 ;
            }
        }
    }
};

     
function clickableGrid(rows, cols, callback){

    //inizialization of the grid
    var grid = document.createElement('table');
    grid.className = 'grid';

    //creation of the grid + each cell is an object
    for (var r = 1; r <= rows; ++r){
        var tr = grid.appendChild(document.createElement('tr'));

        for (var c = 1; c <= cols; ++c){
            var cell = tr.appendChild(document.createElement('td'));

            //for every cell i add an event listener, if it get's clicked, the callback function happens with the info of that cell
            // if (canIclick){
            cell.addEventListener('click',(function(el,r,c){

                return function(){
                    callback(el,r,c);
                }

            })(cell,r,c),false); //i dont know what that closing means
        }
    }
    return grid;
}

function checkOKtoPlace(player, row, column) {

    boolean = true;
    var test = 0;

    console.log(player + "player");
    if(player == 1){
        test = 1;
    }
    if(player == 2){
        test = 2;
    }

    var arr = [checkUp(test, row, column), checkRight(test, row, column),checkDown(test, row, column), checkLeft(test, row, column) ,checkDiagonalUpLeft(test, row, column), checkDiagonalUpRight(test, row, column), checkDiagonalDownLeft(test, row, column), checkDiagonalDownRight(test, row, column)];
    console.log(arr);
    
    boolean = false;

    if (arr.includes(true)) {
        return true
    } else {
        return false
    }
};
 
function drawClientGrid(){

    let black = 0;
    let white = 0;
    let totalNumberOfMoves = 0;
    
    for(let i = 0; i < gameboard.length; i++){
        for(let j = 0; j < gameboard.length; j++){
            if(gameboard[i][j] == 0){
                continue;
            }
            if(gameboard[i][j] == 1){
                black++;
                totalNumberOfMoves++;
                drawToken(1, i+1, j+1);
            }
            if(gameboard[i][j] == 2){
                white++;
                totalNumberOfMoves++;
                drawToken(2, i+1, j+1);
            }
        }
    }

    document.getElementById("resultTotalNumberOfTokens").innerHTML = totalNumberOfMoves;
    document.getElementById("resultTotalNumberOfWhiteTokens").innerHTML = white;
    document.getElementById("resultTotalNumberOfBlackTokens").innerHTML = black;     
};

function updateGameGrid(player, row, col){
    
    if(player == 1){
        gameboard[col][row] = 1;
    }else{
        gameboard[col][row] = 2;
    }
};

//to create the disks
function drawToken(player, row, column){

    
    //center coordinates - middle of the squares
    cx = (column*50) - 25;
    cy = (row*50) - 25;

    r = 15;

    if (player == 1){
        ctx.fillStyle = 'black';
    }

    if (player == 2){
        ctx.fillStyle = 'white';
    }
        
    ctx.beginPath();
    ctx.arc(this.cx, this.cy, this.r, 0, Math.PI * 2);
    ctx.fill(); 
};

function checkToken(player, row, column){
    
    checkRight(player, row, column);
    checkLeft(player, row, column);
    checkUp(player, row, column);
    checkDown(player, row, column);
    checkDiagonal(player, row, column);
    drawClientGrid();
};

function checkDiagonal(player, row, column){
    checkDiagonalUpLeft(player, row, column);
    checkDiagonalUpRight(player, row, column);  
    checkDiagonalDownLeft(player, row, column);  
    checkDiagonalDownRight(player, row, column); 
};

function checkDiagonalDownRight(player, row, column){
    var count = 1;
    var positionOfNextRowToken = -1;
    var positionOfNextColumnToken = -1;


    while(column + count < 8 && row + count < 8){
        
        if(gameboard[row + count][column + count] == 0){
            break;
        }

        if(gameboard[row + count][column + count] == player){
            positionOfNextColumnToken = column + count;
            positionOfNextRowToken = row + count;
            break;
        }
        count++;
    }
    

    if(positionOfNextRowToken != -1 && positionOfNextColumnToken != -1 && !boolean){
        
        for(let i = column + 1; i <= positionOfNextColumnToken; i++){
            gameboard[row++][column++] = player;
        }
    }

    if(row != 7 && column != 7){
        if(gameboard[row+1][column+1] == player && boolean){
            return false;
        }
    }


    if(positionOfNextRowToken != -1 && positionOfNextColumnToken != -1 && boolean){
        return true;
    }
}


function checkDiagonalDownLeft(player, row, column){
    var count = 1;
    var positionOfNextToken = -1;

    while(column - count > -1 && row + count < 8){
        
        if(gameboard[row + count][column - count] == 0){
            break;
        }

        if(gameboard[row + count][column - count] == player){
            positionOfNextToken = column - count;
            break;
        }
        count++;
    }

    if(positionOfNextToken != -1 && !boolean){
        for(let i = column -1; i >= positionOfNextToken; i--){
            gameboard[row++][column--] = player;
        }
    }

    if(row != 7 && column != 0){
        if(gameboard[row+1][column-1] == player && boolean){
            return false;
        }
    }
    //console.log(positionOfNextToken + "positionOfNextToken");
    if(positionOfNextToken != -1 && boolean){
        return true;
    }
    return false;
}


function checkDiagonalUpRight(player, row, column){
    var count = 1;
    var positionOfNextToken = -1;
    
    
    while(column + count < 8 && row - count > -1){

        if(gameboard[row - count][column + count] == 0){
            break;
        }

        if(gameboard[row - count][column + count] == player){
            positionOfNextToken = column + count;
            break;
        }
        count++;
    }

    if(positionOfNextToken != -1 && !boolean){
        for(let i = column + 1; i <= positionOfNextToken; i++){
            gameboard[row--][column++] = player;
        }
    }

    if(row != 0 && column != 7){
        if(gameboard[row-1][column+1] == player && boolean){
            return false;
        }
    }


    if(positionOfNextToken != -1 && boolean){
        return true;
    }
}


function checkDiagonalUpLeft(player, row, column){
    var count = 1;
    var positionOfNextToken = -1;

    while(column - count > -1 && row - count > -1){

        if(gameboard[row - count][column - count] == 0){
            break;
        }

        if(gameboard[row - count][column - count] == player){
            positionOfNextToken = column - count;
            break;
        }
        count++;
    }

    if(positionOfNextToken != -1 && !boolean){
        for(let i = column - 1; i >= positionOfNextToken; i--){
            gameboard[row--][column--] = player;
        }
    }

    if(row != 0 && column != 0){
        if(gameboard[row-1][column-1] == player && boolean){
            return false;
        }
    }

    if(positionOfNextToken != -1 && boolean){
        return true;
    }
}

function checkRight(player, row, column){
    var count = 1;
    var postionOfNextToken = -1;

    while(column + count < 8){

        //if there is no token you just break the loop because you dont want to change anything futher than that
        if(gameboard[row][column + count] == 0){
            break;
        }
        //if there is a token of the same color you keep track of the position of that token and you break the loop
        if(gameboard[row][column + count] == player){
            postionOfNextToken = column + count;
            break;
        }
        count++;
        //only remainding option is that there is the opposite token on that postion so you just skip it
    }


    if(postionOfNextToken != -1 && !boolean){
        for(let i = column + 1; i < postionOfNextToken; i++){
            gameboard[row][i] = player; // i have no clue why you switch it there
        }
    }
    if(column != 7){
        if(gameboard[row][column+1] == player && boolean){
            return false;
        }
    }

    if(postionOfNextToken != -1 && boolean){
        return true;
    }
};
     

function checkLeft( player, row, column){

    var count = 1;
    var postionOfNextToken = -1;

    while(column - count > -1){

        //if there is no token you just break the loop because you dont want to change anything futher than that
        if(gameboard[row][column - count] == 0){
            break;
        }
        //if there is a token of the same color you keep track of the postion of that token and you break the loop
        if(gameboard[row][column - count] == player){
            postionOfNextToken = column - count;
            break;
        }

        count++;
        //only remainding option is that there is the opposite token on that postion so you just skip it
    }

    if(postionOfNextToken != -1 && !boolean){
        for(let i = column -1; i > postionOfNextToken; i--){
            gameboard[row][i] = player;
        }
    }

    if(column != 0){
        if(gameboard[row][column-1] == player && boolean){
            return false;
        }
    }

    if(postionOfNextToken != -1 && boolean){
        return true;
    }
};

function checkUp( player, row, column){

    var count = 1;
    var postionOfNextToken = -1;

    while(row - count > -1){ 

        //if there is no token you just break the loop because you dont want to change anything futher than that
        if(gameboard[row- count][column] == 0){
            break;
        }
        //if there is a token of the same color you keep track of the postion of that token and you break the loop
        if(gameboard[row - count][column] == player){
            postionOfNextToken = row - count;
            break;
        }

        count++;
        //only remainding option is that there is the opposite token on that postion so you just skip it
    }

    if(postionOfNextToken != -1 && !boolean){
        for(let i = row -1; i > postionOfNextToken; i--){
            gameboard[i][column] = player; // i have no clue why you switch it there
        }
    }

    if(row != 0){
        if(gameboard[row-1][column] == player && boolean){
            return false;   
        }
    }

    if(postionOfNextToken != -1 && boolean){
        return true;
    }
};



function checkDown(player, row, column){

    var count = 1;
    var postionOfNextToken = -1;

    while(row + count < 8 ){

        //if there is no token you just break the loop because you dont want to change anything futher than that
        if(gameboard[row + count][column] == 0){
            break;
        }
        //if there is a token of the same color you keep track of the postion of that token and you break the loop
        if(gameboard[row+ count][column] == player){
            postionOfNextToken = row + count;
            break;
        }
        count++;
        //only remainding option is that there is the opposite token on that postion so you just skip it
    }

    if(postionOfNextToken != -1 && !boolean){
        for(let i = row + 1; i < postionOfNextToken; i++){
            gameboard[i][column] = player; // i have no clue why you switch it there
        }
    }

    if(row != 7){
        if(gameboard[row+1][column] == player && boolean){
            return false;
        }
    }

    if(postionOfNextToken != -1 && boolean){
        return true;
    }
};

//CHECKS IF GAME IS FINISHED + KEEPS TRACK OF TOTAL NUMBER OF BLACK/WHITE TOKENS
// function checkWinsAndCounters(totalNumberOfMoves){

//     //add 4 due to the first 4 cells being already played
//     totalNumberOfMoves = totalNumberOfMoves + 4;
//     let black = 0;
//     let white = 0;

//     //count the total number of black and white tokens
//     for(let i = 0; i < gameboard.length; i++){
//         for(let j = 0; j < gameboard.length; j++){
//             if(gameboard[i][j] == 1){
//                 black++;
//             }
//             if(gameboard[i][j] == 2){
//                 white++;
//             }
//         }
//     }

//     //game is finished when all cells have been reached
//     if(totalNumberOfMoves == 64){

//         if(black > white){
//             window.alert("Black Wins!");
//         }
//         if(white > black){
//             window.alert("White Wins!");
//         }
//         else{
//             window.alert("Draw!");
//         }
//         // close the game && socket connection with the two players

//     }

//     //if the game is not finished, keep updating the total number of tockens and turns
//     else{

//         document.getElementById("resultTotalNumberOfTokens").innerHTML = totalNumberOfMoves;
//         document.getElementById("resultTotalNumberOfWhiteTokens").innerHTML = white;
//         document.getElementById("resultTotalNumberOfBlackTokens").innerHTML = black;  
//     }
// }












// //keep just in case

// el.className='clicked';
        // if (lastClicked) 
        //     lastClicked.className='';
        // lastClicked = el;

// cell.innerHTML = ++i;
// ++i;

     // for(var i =0 ; i <= 450; i = i + 50){
    //     ctx.moveTo(i, 0);
    //     ctx.lineTo(i, 450);

    //     ctx.moveTo(0, i);
    //     ctx.lineTo(450, i);

    //     ctx.stroke();
    // }










// (function setup() {
//     var socket = new WebSocket(Setup.WEB_SOCKET_URL);
  
//     /*
//      * initialize all UI elements of the game:
//      * - visible word board (i.e. place where the hidden/unhidden word is shown)
//      * - status bar
//      * - alphabet board
//      *
//      * the GameState object coordinates everything
//      */
  
//     var vw = new VisibleWordBoard();
//     var sb = new StatusBar();
  
//     //no object, just a function
//     createBalloons();
  
//     var gs = new GameState(vw, sb, socket);
//     var ab = new AlphabetBoard(gs);
  
//     socket.onmessage = function (event) {
//       let incomingMsg = JSON.parse(event.data);
  
//       //set player type
//       if (incomingMsg.type == Messages.T_PLAYER_TYPE) {
//         gs.setPlayerType(incomingMsg.data); //should be "A" or "B"
  
//         //if player type is A, (1) pick a word, and (2) sent it to the server
//         if (gs.getPlayerType() == "A") {
//           disableAlphabetButtons();
  
//           sb.setStatus(Status["player1Intro"]);
//           let validWord = -1;
//           let promptString = Status["prompt"];
//           let res = null;
  
//           while (validWord < 0) {
//             res = prompt(promptString);
  
//             if (res == null) {
//               promptString = Status["prompt"];
//             } else {
//               res = res.toUpperCase();//game is played with uppercase letters
  
//               if (
//                 res.length < Setup.MIN_WORD_LENGTH ||
//                 res.length > Setup.MAX_WORD_LENGTH
//               ) {
//                 promptString = Status["promptAgainLength"];
//               } else if (/^[a-zA-Z]+$/.test(res) == false) {
//                 promptString = Status["promptChars"];
//               }
//               //dictionary has only lowercase entries
//               //TODO: convert the dictionary to uppercase to avoid this extra string conversion cost
//               else if (
//                 Object.prototype.hasOwnProperty.call(
//                   englishDict,
//                   res.toLocaleLowerCase()
//                 ) == false
//               ) {
//                 promptString = Status["promptEnglish"];
//               } else {
//                 validWord = 1;
//               }
//             }
//           }
//           sb.setStatus(Status["chosen"] + res);
//           gs.setTargetWord(res);
//           gs.initializeVisibleWordArray(); // initialize the word array, now that we have the word
//           vw.setWord(gs.getVisibleWordArray());
  
//           let outgoingMsg = Messages.O_TARGET_WORD;
//           outgoingMsg.data = res;
//           socket.send(JSON.stringify(outgoingMsg));
//         } else {
//           sb.setStatus(Status["player2IntroNoTargetYet"]);
//         }
//       }
  
//       //Player B: wait for target word and then start guessing ...
//       if (
//         incomingMsg.type == Messages.T_TARGET_WORD &&
//         gs.getPlayerType() == "B"
//       ) {
//         gs.setTargetWord(incomingMsg.data);
  
//         sb.setStatus(Status["player2Intro"]);
//         gs.initializeVisibleWordArray(); // initialize the word array, now that we have the word
//         ab.initialize();
//         vw.setWord(gs.getVisibleWordArray());
//       }
  
//       //Player A: wait for guesses and update the board ...
//       if (
//         incomingMsg.type == Messages.T_MAKE_A_GUESS &&
//         gs.getPlayerType() == "A"
//       ) {
//         sb.setStatus(Status["guessed"] + incomingMsg.data);
//         gs.updateGame(incomingMsg.data);
//       }
//     };
  
//     socket.onopen = function () {
//       socket.send("{}");
//     };
  
//     //server sends a close event only if the game was aborted from some side
//     socket.onclose = function () {
//       if (gs.whoWon() == null) {
//         sb.setStatus(Status["aborted"]);
//       }
//     };
  
//     socket.onerror = function () { };
//   })(); //execute immediately


















//this.cols = 8;
    // this.rows = 8;
    // this.grid = [];

    // // create table structure for grid
    // var table = document.createElement('table');
        
    // // base styling
    // table.setAttribute('border', 0);
    // table.setAttribute('cellpadding', 0);
    // table.setAttribute('cellspacing', 0);
        
    // // create table with 8 rows and 8 columns
    // for (var i = 1; i <= this.rows; i++) {
                    
    //     var tr = document.createElement('tr');
    //     table.appendChild(tr);
    //     this.grid[i] = [];
                    
    //     for (var j = 1; j <= this.cols; j++) {
                        
    //         var td = document.createElement('td');
    //         tr.appendChild(td);

    //     }
    // }




    // // function mainAction(gameboard){
// //     //first create an button out of every cell
// //     for (var i = 0; i <= 8; i++) {
// //         for (var j = 0; j <= 8; j++) {
// //             var grid[i][j] = document.createElement();
// //         }
// //     }
// //     //then check which cell has been clicked on and by who + add token in that cell
// //     for (var i = 0; i <= 8; i++) {
// //         for (var j = 0; j <= 8; j++) {
// //             if (player1){} //idk how to say if its player1 or 2
// //                 gameboard[i][j].addEventListener('click',drawToken(black,i,j));
// //                 //then check whether there is any token of a different color next to the one that has been just put (tokenA)
// //                 //if there is a diff color (tokenB), check if in the same row or in diagonal there is a token of the same color of tokenA
// //                 //if there is, change color of tokenB
// //                 checkTokens(black,i,j);
// //             }
// //             if (player2){
// //                 gameboard[i][j].addEventListener('click',drawToken(white,i,j));
// //                 checkTokens(white,i,j);
// //             }
// //         }
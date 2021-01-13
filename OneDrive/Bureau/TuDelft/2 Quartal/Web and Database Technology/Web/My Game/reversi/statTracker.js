
/* 
 In-memory game statistics "tracker".
 TODO: as future work, this object should be replaced by a DB backend.
*/

var gameStatus = {
    since: Date.now() /* since we keep it simple and in-memory, keep track of when this object was created */,
    gamesInitialized: 0 /* number of games initialized */,
    gamesAborted: 0 /* number of games aborted */,
    gamesCompleted: 0 /* number of games successfully completed */
  };
  
  module.exports = gameStatus;


  // ws.on("request", request=> {

        //     connection = request.accept(null, request.origin)
        //     connection.on("open", () => Board())

        //            if (!currentGame.hasTwoConnectedPlayers()){
        //     message.reject();
        //     window.alert("You are waiting for another player");
        // }
            
            
            // connection.on("message", message => {
            //     str = message;
            //     let array = Array.from(str);
            //     let count = 0;
        
            //     for(let i = 0; i < gameboard.length; i++){
            //         for(let j = 0; j < gameboard.length; j++){
            //          gameboard[i][j] = array[count];
            //          count++;   
            //         }    
            //     }
            //     turns++;
            //     checkWinsAndCounters(turns);
            //     console.log(`Received message ${message}`)
            //     //websocket.send(JSON.stringify({text: 'Connection'}))
            //     connection.send(`got your message: ${message.utf8Data}`)
            // })
        
            // connection.on("close", () => console.log("CLOSED!!!"))
        
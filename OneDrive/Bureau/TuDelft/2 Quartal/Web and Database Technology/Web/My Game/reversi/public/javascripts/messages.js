// List of message types:
// - client to server: game is complete
// - server to client: abort game (one of the players has exited)
// - server to client: make a move
// - server to client: setting up the players types (1 or 2)
// - player1 to server: move
// - server to player2: this move has been done
// - server to plavers: game is over

(function(exports) {
    /*
     * Client to server: game is complete, the winner is ...
     */
    exports.T_GAME_WON_BY = "GAME-WON-BY";
    exports.O_GAME_WON_BY = {
      type: exports.T_GAME_WON_BY,
      data: null
    };
  
    /*
     * Server to client: abort game (e.g. if second player exited the game)
     */
    exports.O_GAME_ABORTED = {
      type: "GAME-ABORTED"
    };
    exports.S_GAME_ABORTED = JSON.stringify(exports.O_GAME_ABORTED);
  
    /*
     * Server to client: make a move
     */
    exports.O_MAKE = { type: "MAKE-MOVE" };
    exports.S_MAKE = JSON.stringify(exports.O_MAKE);
  
    /*
     * Server to client: set as player 1
     */
    exports.T_PLAYER_TYPE = "PLAYER-TYPE";
    exports.O_PLAYER_1 = {
      type: exports.T_PLAYER_TYPE,
      data: "1"
    };
    exports.S_PLAYER_1 = JSON.stringify(exports.O_PLAYER_1);
  
    /*
     * Server to client: set as player 2
     */
    exports.O_PLAYER_2 = {
      type: exports.T_PLAYER_TYPE,
      data: "2"
    };
    exports.S_PLAYER_2 = JSON.stringify(exports.O_PLAYER_2);
  
    /*
     * Player 1 to server OR server to Player 2: this is the move made
     */
    exports.T_MOVE_MADE = "SET-MOVE-MADE";
    exports.O_MOVE_MADE = {
      type: exports.T_MOVE_MADE,
      data: null
    };
    
  
    /*
     * Player 2 to server OR server to Player 1: move in response
     */
    exports.T_MAKE_A_MOVE = "MAKE-A-MOVE";
    exports.O_MAKE_A_MOVE = {
      type: exports.T_MAKE_A_MOVE,
      data: null
    };
    
  
    /*
     * Server to Player 1 & 2: game over with result won/loss
     */
    exports.T_GAME_OVER = "GAME-OVER";
    exports.O_GAME_OVER = {
      type: exports.T_GAME_OVER,
      data: null
    };
  })(typeof exports === "undefined" ? (this.Messages = {}) : exports);
  //if exports is undefined, we are on the client; else the server
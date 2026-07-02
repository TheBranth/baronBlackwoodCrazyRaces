import Board from './Board.js';
import Player from './Player.js';
import Characters from './Characters.js';

export default class Game {
    constructor(playerConfigs) { // playerConfigs: [{ name: 'Player 1', character: 'professor_quantum' }]
        this.board = new Board();
        this.players = playerConfigs.map(config => {
            const character = Characters[config.character];
            return new Player(config.name, 'windengate', character);
        });
        this.currentPlayerIndex = 0;
        this.dragoPosition = 'damswyck';
    }

    startGame() {
        console.log('Game starting!');
    }

    takeTurn() {
        const currentPlayer = this.players[this.currentPlayerIndex];
        console.log(`It\'s ${currentPlayer.name}'s turn.`);

        const diceRoll = this.rollDice(currentPlayer);
        console.log(`${currentPlayer.name} rolled a ${diceRoll}.`);

        const possibleMoves = this.board.getPossibleMoves(currentPlayer.currentNodeId, diceRoll);
        console.log('Possible moves:', possibleMoves);

        if (possibleMoves.length > 0) {
            const chosenMove = possibleMoves[0];
            currentPlayer.move(this.board, chosenMove);
        } else {
            console.log(`${currentPlayer.name} has no possible moves.`);
        }

        this.moveDrago();

        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
        
        return {
            player: currentPlayer,
            diceRoll: diceRoll,
            possibleMoves: possibleMoves
        };
    }

    rollDice(player) {
        let roll = Math.floor(Math.random() * 6) + 1;
        // Apply character ability
        if (player.passiveAbility && player.passiveAbility.type === 'dice_roll_modifier') {
            if (roll < player.passiveAbility.minRoll) {
                roll = player.passiveAbility.minRoll;
            }
        }
        return roll;
    }

    moveDrago() {
        const dragoNode = this.board.findNodeById(this.dragoPosition);
        if (dragoNode && dragoNode.connections.length > 0) {
            const randomIndex = Math.floor(Math.random() * dragoNode.connections.length);
            this.dragoPosition = dragoNode.connections[randomIndex];
            console.log(`Dr. Drago moved to ${this.board.findNodeById(this.dragoPosition).name}.`);
        }
    }
}

import Game from '../game/Game.js';
import Characters from '../game/Characters.js';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
        this.selectedCharacter = null;
    }

    init(data) {
        this.selectedCharacter = data.selectedCharacter;
    }

    preload() {
        this.load.image('map', 'assets/images/the_lowlands_map.png');
    }

    create() {
        this.add.gradient = this.add.graphics();
        this.add.gradient.fillGradientStyle(0x1e2a3e, 0x1e2a3e, 0x0a121e, 0x0a121e, 1);
        this.add.gradient.fillRect(0, 0, this.cameras.main.width, this.cameras.main.height);

        // --- SETUP THE GAME ---
        const availableCharacters = Object.keys(Characters);
        const opponentCharacter = availableCharacters.find(key => key !== this.selectedCharacter) || availableCharacters[0];
        const playerConfigs = [
            { name: 'Player 1', character: this.selectedCharacter },
            { name: 'Player 2', character: opponentCharacter }
        ];
        this.game = new Game(playerConfigs);
        const nodes = this.game.board.getNodes();

        // --- MAP AND PATHS ---
        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 2;
        const mapImage = this.add.image(centerX, centerY, 'map');
        const scale = Math.min(this.cameras.main.width / mapImage.width, this.cameras.main.height / mapImage.height) * 0.85; // Slightly smaller map
        mapImage.setScale(scale);

        const graphics = this.add.graphics({ lineStyle: { width: 4, color: 0xffffff, alpha: 0.7 } });
        nodes.forEach(node => {
            node.connections.forEach(connectionId => {
                const connectedNode = this.game.board.findNodeById(connectionId);
                if (connectedNode) {
                    graphics.beginPath();
                    graphics.moveTo(node.x, node.y);
                    graphics.lineTo(connectedNode.x, connectedNode.y);
                    graphics.strokePath();
                }
            });
        });

        nodes.forEach(node => {
            const circle = this.add.circle(node.x, node.y, 10, 0xff0000, 0.8);
            circle.setStrokeStyle(2, 0xffffff);
        });

        // --- PLAYERS ---
        this.playerSprites = {};
        const playerColors = [0x0000ff, 0x00ff00];
        this.game.players.forEach((player, index) => {
            const startNode = this.game.board.findNodeById(player.currentNodeId);
            const playerSprite = this.add.circle(startNode.x, startNode.y, 8, playerColors[index]);
            playerSprite.setStrokeStyle(2, 0xffffff);
            this.playerSprites[player.name] = playerSprite;
        });

        // --- UI ---
        this.turnText = this.add.text(10, 10, '', { fontSize: '24px', fill: '#ffffff' });
        const rollButton = this.add.text(10, 50, 'Roll Dice', { fontSize: '24px', fill: '#0f0' })
            .setInteractive()
            .on('pointerdown', () => {
                this.game.takeTurn();
                this.updateTurnText();
            });

        // --- START ---
        this.game.startGame();
        this.updateTurnText();
        console.log("GameScene created and game started!");
    }

    update() {
        this.game.players.forEach(player => {
            const playerSprite = this.playerSprites[player.name];
            const targetNode = this.game.board.findNodeById(player.currentNodeId);

            if (playerSprite.x !== targetNode.x || playerSprite.y !== targetNode.y) {
                this.tweens.add({
                    targets: playerSprite,
                    x: targetNode.x,
                    y: targetNode.y,
                    duration: 500,
                    ease: 'Power2'
                });
            }
        });
    }

    updateTurnText() {
        const currentPlayer = this.game.players[this.game.currentPlayerIndex];
        this.turnText.setText(`Turn: ${currentPlayer.name}`);
    }
}


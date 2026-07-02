import Characters from '../game/Characters.js';

export default class PlayerSelectScene extends Phaser.Scene {
    constructor() {
        super('PlayerSelectScene');
        this.selectedCharacter = null;
        this.selectionCheckmark = null;
    }

    preload() {
        for (const key in Characters) {
            this.load.image(key, Characters[key].portrait);
        }
        this.load.script('webfont', 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js');
    }

    create() {
        WebFont.load({
            google: {
                families: ['Roboto']
            },
            active: () => {
                this.add.gradient = this.add.graphics();
                this.add.gradient.fillGradientStyle(0x1e2a3e, 0x1e2a3e, 0x0a121e, 0x0a121e, 1);
                this.add.gradient.fillRect(0, 0, this.cameras.main.width, this.cameras.main.height);

                const centerX = this.cameras.main.width / 2;
                this.add.text(centerX, 50, 'Choose Your Character', { font: '48px Roboto', fill: '#ffffff' }).setOrigin(0.5);

                const characterKeys = Object.keys(Characters);
                const column1 = characterKeys.slice(0, 2);
                const column2 = characterKeys.slice(2, 4);

                this.createColumn(column1, centerX - 250);
                this.createColumn(column2, centerX + 150);

                this.createStartButton();
            }
        });
    }

    createColumn(characterKeys, x) {
        characterKeys.forEach((key, index) => {
            const character = Characters[key];
            const y = 200 + (index * 220);

            const card = this.add.graphics();
            card.fillStyle(0xffffff, 0.1);
            card.fillRoundedRect(-200, -90, 400, 180, 16);

            const container = this.add.container(x, y);
            container.add(card);

            const portrait = this.add.image(-140, 0, key).setScale(0.8);
            const name = this.add.text(-40, -80, character.name, { font: '24px Roboto', fill: '#ffff00' }).setOrigin(0);
            const description = this.add.text(-40, -40, character.description, { font: '16px Roboto', fill: '#ffffff', wordWrap: { width: 180 } }).setOrigin(0);
            const ability = this.add.text(-40, 20, character.passiveAbility, { font: '16px Roboto', fill: '#00ff00', wordWrap: { width: 180 } }).setOrigin(0);

            container.add([portrait, name, description, ability]);
            container.setSize(400, 180);
            container.setInteractive();

            container.on('pointerdown', () => {
                this.selectCharacter(key, container);
            });
        });
    }

    selectCharacter(key, container) {
        this.selectedCharacter = key;

        if (this.selectionCheckmark) {
            this.selectionCheckmark.destroy();
        }

        this.selectionCheckmark = this.add.text(container.x + 180, container.y + 60, '✔', { font: '32px Arial', fill: '#00ff00' });

        this.enableStartButton();
    }

    createStartButton() {
        const centerX = this.cameras.main.width / 2;
        const buttonY = this.cameras.main.height - 70;

        this.startButton = this.add.graphics();
        this.buttonText = this.add.text(centerX, buttonY, 'Start Game', { font: '24px Roboto', fill: '#ffffff' }).setOrigin(0.5);

        this.drawButton(0x808080);

        this.startButton.setInteractive(new Phaser.Geom.Rectangle(centerX - 100, buttonY - 25, 200, 50), Phaser.Geom.Rectangle.Contains)
            .on('pointerdown', () => {
                if (this.selectedCharacter) {
                    this.scene.start('GameScene', { selectedCharacter: this.selectedCharacter });
                }
            })
            .on('pointerover', () => {
                if (this.selectedCharacter) this.drawButton(0x00ff00, 0x00e600);
            })
            .on('pointerout', () => {
                if (this.selectedCharacter) this.drawButton(0x00ff00);
            });
    }

    drawButton(fillColor, hoverColor) {
        this.startButton.clear();
        this.startButton.fillStyle(hoverColor || fillColor, 1);
        this.startButton.fillRoundedRect(this.cameras.main.width / 2 - 100, this.cameras.main.height - 95, 200, 50, 16);
    }

    enableStartButton() {
        this.drawButton(0x00ff00);
        this.buttonText.setTint(0xffffff);
    }
}
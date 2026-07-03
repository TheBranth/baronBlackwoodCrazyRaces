export default class IntroScene extends Phaser.Scene {
    constructor() {
        super('IntroScene');
    }

    create() {
        this.add.gradient = this.add.graphics();
        this.add.gradient.fillGradientStyle(0x1e2a3e, 0x1e2a3e, 0x0a121e, 0x0a121e, 1);
        this.add.gradient.fillRect(0, 0, this.cameras.main.width, this.cameras.main.height);

        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 2;

        // --- TITLE --- 
        this.add.text(centerX, centerY - 150, "Baron Blackwood's Crazy Races", {
            font: 'bold 44px Arial', // Slightly smaller font to fit the longer name
            fill: '#ffffff',
            align: 'center'
        }).setOrigin(0.5);

        this.add.text(centerX, centerY - 95, "Inspired by a certain Madcap Chase", {
            font: 'italic 20px Arial',
            fill: '#dddddd',
            align: 'center'
        }).setOrigin(0.5);

        // Check if an autosave exists
        const hasSave = typeof localStorage !== 'undefined' && localStorage.getItem('baron_blackwood_savegame') !== null;

        // Adjust Y coordinates based on whether Resume button is visible
        const resumeY = centerY + 10;
        const newGameY = hasSave ? centerY + 85 : centerY + 50;
        const joinGameY = hasSave ? centerY + 155 : centerY + 120;

        let resumeButton = null;
        if (hasSave) {
            resumeButton = this.add.text(centerX, resumeY, 'Resume Game', {
                font: 'bold 32px Arial',
                fill: '#00ffcc',
                backgroundColor: '#111c2e',
                padding: { x: 20, y: 10 }
            }).setOrigin(0.5).setInteractive({ useHandCursor: true });
        }

        const newGameButton = this.add.text(centerX, newGameY, 'New Game', {
            font: '32px Arial',
            fill: '#ffffff',
            backgroundColor: '#333333',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        const joinButton = this.add.text(centerX, joinGameY, 'Join Session', {
            font: '32px Arial',
            fill: '#ffff00',
            backgroundColor: '#333333',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        // --- JOIN SESSION INPUT (initially hidden) ---
        const joinForm = this.add.dom(centerX, centerY + 220).createFromHTML(`
            <div style="display: flex; flex-direction: column; align-items: center; gap: 10px;">
                <input type="text" id="session-code" placeholder="Enter Session Code" style="font-size: 20px; padding: 10px; width: 250px; text-align: center;">
                <button id="join-game-btn" style="font-size: 20px; padding: 10px 20px;">Join</button>
            </div>
        `);
        joinForm.setVisible(false);

        // --- BUTTON EVENTS --- 
        if (resumeButton) {
            resumeButton.on('pointerdown', () => {
                this.scene.start('GameScene', { resume: true });
            });
        }

        newGameButton.on('pointerdown', () => {
            // Delete savegame to start a fresh match
            if (typeof localStorage !== 'undefined') {
                localStorage.removeItem('baron_blackwood_savegame');
            }
            this.scene.start('PlayerSelectScene');
        });

        joinButton.on('pointerdown', () => {
            if (resumeButton) resumeButton.setVisible(false);
            newGameButton.setVisible(false);
            joinButton.setVisible(false);
            joinForm.setVisible(true);
        });

        const joinGameBtn = joinForm.getChildByID('join-game-btn');
        joinGameBtn.addEventListener('click', () => {
            const sessionCode = joinForm.getChildByID('session-code').value;
            if (sessionCode) { // For now, any code is valid
                console.log(`Joining session with code: ${sessionCode}`);
                if (typeof localStorage !== 'undefined') {
                    localStorage.removeItem('baron_blackwood_savegame');
                }
                this.scene.start('PlayerSelectScene');
            }
        });
    }
}

import Phaser from "phaser";

export class StartScreen extends Phaser.Scene {
    constructor() {
        super("StartScreen");
    }

    create() {
        this.cameras.main.setBackgroundColor("#1a1a2e");

        // Title
        this.add.text(500, 250, "Valentine Games", {
            fontSize: "64px",
            color: "#ff4d6d",
            fontStyle: "bold",
        }).setOrigin(0.5);

        this.add.text(500, 330, "Play through 3 mini-games 💖", {
            fontSize: "24px",
            color: "#f0f0f0",
        }).setOrigin(0.5);

        // Play button
        const playButton = this.add.text(500, 450, "PLAY", {
            fontSize: "42px",
            backgroundColor: "#ff4d6d",
            padding: { x: 30, y: 15 },
            color: "#ffffff",
        })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });

        playButton.on("pointerdown", () => {
            this.scene.start("SplashScreen", { level: "SnakeScene" });
        });

        // Pulse effect
        this.tweens.add({
            targets: playButton,
            scaleX: 1.1,
            scaleY: 1.1,
            yoyo: true,
            repeat: -1,
            duration: 800,
        });
    }
}

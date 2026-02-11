import Phaser from "phaser";

export class SplashScreen extends Phaser.Scene {
    constructor() {
        super("SplashScreen");
    }

    init(data: { level: string }) {
        this.level = data.level;
    }

    private level!: string;

    create() {
        this.cameras.main.setBackgroundColor("#2d2d44");

        const levelNames: Record<string, string> = {
            SnakeScene: "Snake Game",
            DinoScene: "Dino Jump",
            FlappyScene: "Flappy Love",
        };

        const levelName = levelNames[this.level] ?? this.level;

        this.add.text(500, 300, levelName, {
            fontSize: "56px",
            color: "#ffffff",
            fontStyle: "bold",
        }).setOrigin(0.5);

        this.add.text(500, 380, "Get ready!", {
            fontSize: "24px",
            color: "#f0f0f0",
        }).setOrigin(0.5);

        const continueButton = this.add.text(500, 480, "CONTINUE", {
            fontSize: "32px",
            backgroundColor: "#667eea",
            padding: { x: 25, y: 12 },
            color: "#ffffff",
        })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });

        continueButton.on("pointerdown", () => {
            this.scene.start(this.level);
        });

        // Fade in effect
        this.cameras.main.fadeIn(500);
    }
}

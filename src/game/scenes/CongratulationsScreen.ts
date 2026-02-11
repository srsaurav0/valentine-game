import Phaser from "phaser";

export class CongratulationsScreen extends Phaser.Scene {
    constructor() {
        super("CongratulationsScreen");
    }

    init(data: { level: string; isFinal?: boolean }) {
        this.level = data.level;
        this.isFinal = data.isFinal ?? false;
    }

    private level!: string;
    private isFinal!: boolean;

    create() {
        this.cameras.main.setBackgroundColor("#ffdde1");

        this.add.text(500, 250, "Congratulations! 🎉", {
            fontSize: "48px",
            color: "#b30059",
            fontStyle: "bold",
        }).setOrigin(0.5);

        const levelNames: Record<string, string> = {
            SnakeScene: "Snake Game",
            DinoScene: "Dino Jump",
            FlappyScene: "Flappy Love",
        };

        const levelName = levelNames[this.level] ?? this.level;

        this.add.text(500, 330, `You passed ${levelName}!`, {
            fontSize: "28px",
            color: "#660033",
        }).setOrigin(0.5);

        const buttonText = this.isFinal ? "FINISH" : "NEXT LEVEL";

        const nextButton = this.add.text(500, 440, buttonText, {
            fontSize: "34px",
            backgroundColor: "#ff4d6d",
            padding: { x: 25, y: 12 },
            color: "#ffffff",
        })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });

        nextButton.on("pointerdown", () => {
            if (this.isFinal) {
                this.scene.start("ValentineScene");
            } else {
                const nextLevel = this.getNextLevel(this.level);
                this.scene.start("SplashScreen", { level: nextLevel });
            }
        });

        // Sparkle animation
        this.time.addEvent({
            delay: 200,
            loop: true,
            callback: () => {
                const sparkle = this.add.text(
                    Phaser.Math.Between(100, 900),
                    Phaser.Math.Between(100, 600),
                    "✨",
                    { fontSize: "24px" }
                ).setOrigin(0.5);

                this.tweens.add({
                    targets: sparkle,
                    alpha: 0,
                    y: sparkle.y - 50,
                    duration: 1500,
                    onComplete: () => sparkle.destroy(),
                });
            },
        });
    }

    private getNextLevel(current: string): string {
        const order = ["SnakeScene", "DinoScene", "FlappyScene"];
        const idx = order.indexOf(current);
        return idx !== -1 && idx < order.length - 1 ? order[idx + 1] : current;
    }
}

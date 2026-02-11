import Phaser from "phaser";

export class ValentineScene extends Phaser.Scene {
    constructor() {
        super("ValentineScene");
    }

    create() {
        this.cameras.main.setBackgroundColor("#ffdde1");

        // Title text
        const titleText = this.add.text(500, 200, "Will You Be My Valentine? 💖", {
            fontSize: "40px",
            color: "#b30059",
            fontStyle: "bold",
        }).setOrigin(0.5);

        // Her face in center
        this.add.image(500, 350, "face")
            .setDisplaySize(150, 150)
            .setOrigin(0.5);

        const face = this.add.image(500, 350, "face")
            .setDisplaySize(150, 150)
            .setOrigin(0.5);

        this.tweens.add({
            targets: face,
            scale: 1.1,
            yoyo: true,
            repeat: -1,
            duration: 800,
        });


        // YES button
        const yesButton = this.add.text(400, 520, "YES 💘", {
            fontSize: "32px",
            backgroundColor: "#ff4d6d",
            padding: { x: 20, y: 10 },
            color: "#ffffff"
        })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });

        yesButton.on("pointerdown", () => {
            titleText.setText("Love you 3000!!!");
            this.showLoveExplosion();
        });

        // NO button
        const noButton = this.add.text(600, 520, "NO 😜", {
            fontSize: "28px",
            backgroundColor: "#666666",
            padding: { x: 20, y: 10 },
            color: "#ffffff"
        })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });

        // Make NO run away
        noButton.on("pointerover", () => {
            const newX = Phaser.Math.Between(200, 800);
            const newY = Phaser.Math.Between(450, 650);
            noButton.setPosition(newX, newY);
        });

        this.time.addEvent({
            delay: 400,
            loop: true,
            callback: () => {
                const heart = this.add.text(
                    Phaser.Math.Between(100, 900),
                    700,
                    "💖",
                    { fontSize: "28px" }
                );

                this.tweens.add({
                    targets: heart,
                    y: -50,
                    duration: 3000,
                    onComplete: () => heart.destroy(),
                });
            },
        });

    }

    showLoveExplosion() {
        this.cameras.main.flash(500, 255, 182, 193);

        this.add.text(500, 600, "YAYYY!!! 💍💖", {
            fontSize: "36px",
            color: "#ff0066",
            fontStyle: "bold"
        }).setOrigin(0.5);

        this.add.text(500, 680, "Made with love ❤️", {
            fontSize: "14px",
            color: "#990033",
        }).setOrigin(0.5);

    }
}

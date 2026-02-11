import Phaser from "phaser";

export class DinoScene extends Phaser.Scene {
    private runner!: Phaser.Physics.Arcade.Sprite;
    private ground!: Phaser.GameObjects.Rectangle;
    private obstacles!: Phaser.Physics.Arcade.Group;
    private score = 0;
    private scoreText!: Phaser.GameObjects.Text;

    constructor() {
        super("DinoScene");
    }

    init(data: { score?: number } = {}) {
        this.score = data.score ?? 0;
    }

    create() {
        console.log("Dino Scene Loaded");

        this.cameras.main.setBackgroundColor("#2b2d42");

        if (!this.textures.exists("dinoCloud")) {
            const g = this.add.graphics();
            g.fillStyle(0xffffff, 1);
            g.fillCircle(24, 24, 18);
            g.fillCircle(44, 22, 16);
            g.fillCircle(60, 28, 14);
            g.fillCircle(36, 34, 16);
            g.generateTexture("dinoCloud", 80, 60);
            g.destroy();
        }

        const sun = this.add
            .circle(880, 110, 55, 0xffd166)
            .setDepth(-1000)
            .setAlpha(0.9);

        const clouds = this.add.group();
        for (let i = 0; i < 6; i++) {
            const c = this.add
                .image(Phaser.Math.Between(0, 1000), Phaser.Math.Between(60, 250), "dinoCloud")
                .setDepth(-1000)
                .setAlpha(0.22)
                .setScale(Phaser.Math.FloatBetween(0.9, 1.4));
            clouds.add(c);
            this.tweens.add({
                targets: c,
                x: c.x + Phaser.Math.Between(-80, 80),
                duration: Phaser.Math.Between(3000, 6000),
                yoyo: true,
                repeat: -1,
                ease: "Sine.easeInOut",
            });
        }

        this.tweens.add({
            targets: sun,
            alpha: 0.75,
            yoyo: true,
            repeat: -1,
            duration: 1200,
        });

        // Ground
        this.ground = this.add.rectangle(500, 650, 1000, 100, 0x444444);
        this.physics.add.existing(this.ground, true);

        // Runner
        this.runner = this.physics.add.sprite(150, 580, "face");
        this.runner.setDisplaySize(80, 80);
        this.runner.setGravityY(1500);
        this.runner.setCollideWorldBounds(true);

        this.physics.add.collider(this.runner, this.ground);

        // Proper physics group (dynamic)
        this.obstacles = this.physics.add.group({
            allowGravity: false,
            immovable: true,
        });

        this.time.addEvent({
            delay: 1500,
            loop: true,
            callback: this.spawnObstacle,
            callbackScope: this,
        });

        this.input.keyboard?.on("keydown-SPACE", () => {
            const body = this.runner.body as Phaser.Physics.Arcade.Body;
            if (body.blocked.down) {
                this.runner.setVelocityY(-700);
            }
        });

        this.physics.add.collider(this.runner, this.obstacles, () => {
            this.scene.restart({ score: this.score });
        });

        this.scoreText = this.add.text(20, 20, `Passed: ${this.score}`, {
            fontSize: "22px",
            color: "#ffffff",
        });
    }

    update() {
        this.obstacles.getChildren().forEach((child) => {
            const obstacle = child as Phaser.Physics.Arcade.Sprite;

            if (obstacle.x < -50) {
                obstacle.destroy();
                this.score++;
                this.scoreText.setText(`Passed: ${this.score}`);

                if (this.score >= 4) {
                    this.scene.start("CongratulationsScreen", { level: "DinoScene" });
                }
            }
        });
    }

    spawnObstacle() {
        console.log("Spawning obstacle");

        const obstacle = this.obstacles.create(
            1050,
            560,
            "face"
        ) as Phaser.Physics.Arcade.Sprite;

        obstacle.setDisplaySize(40, 80);
        obstacle.setTintFill(0xff0000);
        obstacle.setDepth(10);
        obstacle.setVelocityX(-450);
    }

}

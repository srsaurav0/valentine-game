import Phaser from "phaser";

export class FlappyScene extends Phaser.Scene {
    private player!: Phaser.Physics.Arcade.Sprite;
    private pipes!: Phaser.Physics.Arcade.Group;
    private score = 0;
    private scoreText!: Phaser.GameObjects.Text;
    private clouds!: Phaser.GameObjects.TileSprite;

    constructor() {
        super("FlappyScene");
    }

    init(data: { score?: number } = {}) {
        this.score = data.score ?? 0;
    }

    create() {
        this.cameras.main.setBackgroundColor("#7bd3ff");

        if (!this.textures.exists("flappyCloud")) {
            const g = this.add.graphics();
            g.fillStyle(0xffffff, 1);
            g.fillCircle(22, 22, 18);
            g.fillCircle(44, 20, 16);
            g.fillCircle(58, 26, 14);
            g.fillCircle(36, 32, 16);
            g.generateTexture("flappyCloud", 80, 60);
            g.destroy();
        }

        const haze = this.add
            .rectangle(500, 350, 1000, 700, 0xffffff)
            .setAlpha(0.08)
            .setDepth(-1000);

        this.clouds = this.add
            .tileSprite(500, 200, 1000, 400, "flappyCloud")
            .setAlpha(0.28)
            .setDepth(-999);

        this.time.addEvent({
            delay: 30,
            loop: true,
            callback: () => {
                this.clouds.tilePositionX += 0.35;
                haze.x = 500;
            },
        });

        if (!this.textures.exists("pipe")) {
            const g = this.add.graphics();
            g.fillStyle(0x00aa00, 1);
            g.fillRect(0, 0, 80, 700);
            g.generateTexture("pipe", 80, 700);
            g.destroy();
        }

        // Player (her face)
        this.player = this.physics.add.sprite(200, 350, "face");
        this.player.setDisplaySize(60, 60);
        this.player.setGravityY(900);
        this.player.setCollideWorldBounds(true);

        // Pipes group
        this.pipes = this.physics.add.group({
            allowGravity: false,
            immovable: true,
        });

        // Spawn pipes repeatedly
        this.time.addEvent({
            delay: 1800,
            loop: true,
            callback: this.spawnPipes,
            callbackScope: this,
        });

        // Flap input
        this.input.keyboard?.on("keydown-SPACE", () => {
            this.player.setVelocityY(-350);
        });

        // Collision detection
        this.physics.add.collider(this.player, this.pipes, () => {
            this.scene.restart({ score: this.score });
        });

        // Score text
        this.scoreText = this.add.text(20, 20, `Score: ${this.score}`, {
            fontSize: "22px",
            color: "#000000",
        });
    }

    update() {
        if (this.player.y > 700) {
            this.scene.restart({ score: this.score });
        }

        this.pipes.getChildren().forEach((child) => {
            const pipe = child as Phaser.Physics.Arcade.Image;

            if (pipe.x < -100) {
                pipe.destroy();
                this.score++;
                this.scoreText.setText(`Score: ${this.score}`);

                if (this.score >= 3) {
                    this.scene.start("CongratulationsScreen", { level: "FlappyScene", isFinal: true });
                }
            }
        });
    }

    spawnPipes() {
        const gap = 180;

        const minY = 150;
        const maxY = 550;
        const gapCenter = Phaser.Math.Between(minY, maxY);

        const topHeight = gapCenter - gap / 2;
        const bottomY = gapCenter + gap / 2;

        // TOP PIPE
        const topPipe = this.pipes.create(
            1050,
            topHeight / 2,
            "pipe"
        ) as Phaser.Physics.Arcade.Image;
        topPipe.setOrigin(0.5);
        topPipe.setDisplaySize(80, topHeight);
        topPipe.setVelocityX(-250);
        topPipe.setImmovable(true);

        // BOTTOM PIPE
        const bottomPipeHeight = 700 - bottomY;

        const bottomPipe = this.pipes.create(
            1050,
            bottomY + bottomPipeHeight / 2,
            "pipe"
        ) as Phaser.Physics.Arcade.Image;
        bottomPipe.setOrigin(0.5);
        bottomPipe.setDisplaySize(80, bottomPipeHeight);
        bottomPipe.setVelocityX(-250);
        bottomPipe.setImmovable(true);
    }

}

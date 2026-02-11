import Phaser from "phaser";

const TILE_SIZE = 32;
const MOVE_DELAY = 200;

export class SnakeScene extends Phaser.Scene {
    private snake!: Phaser.GameObjects.Image[];
    private food!: Phaser.GameObjects.Rectangle;
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    private direction = "RIGHT";
    private lastMoveTime = 0;
    private score = 0;
    private scoreText!: Phaser.GameObjects.Text;

    constructor() {
        super("SnakeScene");
    }

    init(data: { score?: number } = {}) {
        this.score = data.score ?? 0;
    }

    create() {
        this.cameras.main.setBackgroundColor("#0b1020");

        if (!this.textures.exists("snakeBg")) {
            const g = this.add.graphics();
            g.fillStyle(0x101a33, 1);
            g.fillRect(0, 0, 64, 64);
            g.lineStyle(2, 0xff4d6d, 0.12);
            g.strokeRect(0, 0, 64, 64);
            g.lineStyle(2, 0xffffff, 0.05);
            g.beginPath();
            g.moveTo(0, 32);
            g.lineTo(64, 32);
            g.moveTo(32, 0);
            g.lineTo(32, 64);
            g.strokePath();
            g.generateTexture("snakeBg", 64, 64);
            g.destroy();
        }

        const bg = this.add
            .tileSprite(500, 350, 1000, 700, "snakeBg")
            .setDepth(-1000);

        this.time.addEvent({
            delay: 2500,
            loop: true,
            callback: () => {
                const heart = this.add
                    .text(
                        Phaser.Math.Between(40, 960),
                        720,
                        "💖",
                        { fontSize: "22px" }
                    )
                    .setDepth(-900)
                    .setAlpha(0.35);

                this.tweens.add({
                    targets: heart,
                    y: -40,
                    alpha: 0,
                    duration: 4500,
                    onComplete: () => heart.destroy(),
                });
            },
        });

        this.cursors = this.input.keyboard!.createCursorKeys();

        this.snake = [];
        const startX = 400;
        const startY = 300;

        // Snake head (her face)
        const head = this.add
            .image(startX, startY, "face")
            .setDisplaySize(TILE_SIZE * 1.6, TILE_SIZE * 1.6)
            .setOrigin(0.5);

        this.snake.push(head);

        // Initial body
        for (let i = 1; i <= 2; i++) {
            const body = this.add.rectangle(
                startX - i * TILE_SIZE,
                startY,
                TILE_SIZE,
                TILE_SIZE,
                0xff69b4
            );
            this.snake.push(body as any);
        }

        this.spawnFood();

        this.scoreText = this.add.text(10, 10, `Score: ${this.score}`, {
            fontSize: "18px",
            color: "#ffffff",
        });

        this.time.addEvent({
            delay: 40,
            loop: true,
            callback: () => {
                bg.tilePositionX += 0.2;
                bg.tilePositionY += 0.1;
            },
        });
    }

    update(time: number) {
        if (time - this.lastMoveTime < MOVE_DELAY) return;
        this.lastMoveTime = time;

        if (this.cursors.left?.isDown && this.direction !== "RIGHT")
            this.direction = "LEFT";
        else if (this.cursors.right?.isDown && this.direction !== "LEFT")
            this.direction = "RIGHT";
        else if (this.cursors.up?.isDown && this.direction !== "DOWN")
            this.direction = "UP";
        else if (this.cursors.down?.isDown && this.direction !== "UP")
            this.direction = "DOWN";

        const head = this.snake[0];
        let newX = head.x;
        let newY = head.y;

        switch (this.direction) {
            case "LEFT":
                newX -= TILE_SIZE;
                break;
            case "RIGHT":
                newX += TILE_SIZE;
                break;
            case "UP":
                newY -= TILE_SIZE;
                break;
            case "DOWN":
                newY += TILE_SIZE;
                break;
        }

        // Move body
        for (let i = this.snake.length - 1; i > 0; i--) {
            this.snake[i].x = this.snake[i - 1].x;
            this.snake[i].y = this.snake[i - 1].y;
        }

        head.x = newX;
        head.y = newY;

        // Wall collision → restart level
        if (
            newX < 0 ||
            newX >= 1000 ||
            newY < 0 ||
            newY >= 700
        ) {
            this.scene.restart({ score: this.score });
        }

        // Food collision
        if (
            Phaser.Math.Distance.Between(
                head.x,
                head.y,
                this.food.x,
                this.food.y
            ) < TILE_SIZE
        ) {
            this.eatFood();
        }
    }

    spawnFood() {
        const maxX = Math.floor(1000 / TILE_SIZE) - 1;
        const maxY = Math.floor(700 / TILE_SIZE) - 1;

        const x = Phaser.Math.Between(0, maxX) * TILE_SIZE;
        const y = Phaser.Math.Between(0, maxY) * TILE_SIZE;

        if (this.food) this.food.destroy();

        this.food = this.add.rectangle(
            x,
            y,
            TILE_SIZE,
            TILE_SIZE,
            0x00ff00
        );
    }


    eatFood() {
        const tail = this.snake[this.snake.length - 1];
        const newPart = this.add.rectangle(
            tail.x,
            tail.y,
            TILE_SIZE,
            TILE_SIZE,
            0xff69b4
        );
        this.snake.push(newPart as any);

        this.score++;
        this.scoreText.setText(`Score: ${this.score}`);

        if (this.score >= 3) {
            this.scene.start("CongratulationsScreen", { level: "SnakeScene" });
        } else {
            this.spawnFood();
        }
    }
}

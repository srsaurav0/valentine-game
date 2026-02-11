import Phaser from "phaser";

export class BootScene extends Phaser.Scene {
    constructor() {
        super("BootScene");
    }

    preload() {
        this.load.image(
            "face",
            new URL("../../assets/face.png", import.meta.url).toString()
        );
        this.load.audio(
            "bgMusic",
            new URL("../../assets/music.mp3", import.meta.url).toString()
        );
    }

    create() {
        const existing = this.sound.get("bgMusic") as
            | Phaser.Sound.BaseSound
            | null;

        const music = existing ??
            this.sound.add("bgMusic", {
                loop: true,
                volume: 0.4,
            });

        const tryPlay = () => {
            if (!music.isPlaying) {
                music.play();
            }
        };

        if (this.sound.locked) {
            this.sound.once(Phaser.Sound.Events.UNLOCKED, tryPlay);
            this.input.once("pointerdown", tryPlay);
            this.input.keyboard?.once("keydown", tryPlay);
        } else {
            tryPlay();
        }

        this.scene.start("StartScreen");
    }

}

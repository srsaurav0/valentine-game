import Phaser from "phaser";
import { BootScene } from "./scenes/BootScene";
import { StartScreen } from "./scenes/StartScreen";
import { SplashScreen } from "./scenes/SplashScreen";
import { CongratulationsScreen } from "./scenes/CongratulationsScreen";
import { SnakeScene } from "./scenes/SnakeScene";
import { DinoScene } from "./scenes/DinoScene";
import { FlappyScene } from "./scenes/FlappyScene";
import { ValentineScene } from "./scenes/ValentineScene";

export const gameConfig: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 1000,
    height: 700,
    backgroundColor: "#000000",
    physics: {
        default: "arcade",
        arcade: {
            debug: false,
        },
    },
    scene: [BootScene, StartScreen, SplashScreen, CongratulationsScreen, SnakeScene, DinoScene, FlappyScene, ValentineScene],
};

export default new Phaser.Game(gameConfig);

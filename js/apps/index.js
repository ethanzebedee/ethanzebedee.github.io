import { aboutApp } from "./about.js";
import { projectsApp } from "./projects.js";
import { skillsApp } from "./skills.js";
import { visualiserApp } from "./visualiser.js";
import { contactApp } from "./contact.js";
import { gamesApp } from "./games.js";
import { settingsApp } from "./settings.js";
import { snakeGameApp } from "./snakeGame.js";
import { minesweeperGameApp } from "./minesweeperGame.js";
import { pongGameApp } from "./pongGame.js";
import { chessGameApp } from "./chessGame.js";
import { sudokuGameApp } from "./sudokuGame.js";
import { wordleGameApp } from "./wordleGame.js";

const apps = [
  aboutApp,
  projectsApp,
  skillsApp,
  visualiserApp,
  contactApp,
  gamesApp,
  snakeGameApp,
  minesweeperGameApp,
  pongGameApp,
  chessGameApp,
  sudokuGameApp,
  wordleGameApp,
  settingsApp,
];

export const appConfigs = apps.reduce((configs, app) => {
  configs[app.id] = {
    title: app.title,
    template: app.templateId,
  };
  return configs;
}, {});

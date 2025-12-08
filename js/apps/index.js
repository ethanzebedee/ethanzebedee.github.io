import { aboutApp } from "./about.js";
import { projectsApp } from "./projects.js";
import { skillsApp } from "./skills.js";
import { visualiserApp } from "./visualiser.js";
import { contactApp } from "./contact.js";
import { gamesApp } from "./games.js";
import { settingsApp } from "./settings.js";

const apps = [
  aboutApp,
  projectsApp,
  skillsApp,
  visualiserApp,
  contactApp,
  gamesApp,
  settingsApp,
];

export const appConfigs = apps.reduce((configs, app) => {
  configs[app.id] = {
    title: app.title,
    template: app.templateId,
  };
  return configs;
}, {});

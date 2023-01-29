import { App, Editor, Menu, Plugin, PluginManifest } from 'obsidian';
import { PluginSettings } from './types';

const DEFAULT_SETTINGS: PluginSettings = {
  mySetting: 'default'
}

export default class RevisionPlugin extends Plugin {
  app: App;
  manifest: PluginManifest;
  settings: PluginSettings;

  async onload() {
    console.debug(`Revision v${this.manifest.version} loaded.`);
    await this.loadSettings();

    this.app.workspace.onLayoutReady(() => {
      // TBA
    });

    this.registerEvent(
      this.app.workspace.on('editor-menu', this.handleContextMenu)
    );
  }

  handleContextMenu = (menu: Menu, editor: Editor): void => {
    const selection = editor.getSelection();

    menu.addItem((item) => {
      item
        .setTitle('Annotate')
        .onClick(async (e) => {
          // TBA anotate selection
        });
    });

    if (selection) {
      menu.addItem((item) => {
        item
          .setTitle('Remove Annotation')
          .onClick((e) => {
            // TBA remove annotated areas
          });
      });
    }
  }

  onunload() { }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
}

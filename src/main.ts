import { App, Editor, Menu, Plugin, PluginManifest } from 'obsidian';
import { PluginSettings } from './types';
import { wait } from './utils';

const DEFAULT_SETTINGS: PluginSettings = {
  mySetting: 'default',
};

type MarkdownDecorator = {
  id: string;
  name: string;
  prefix: string;
  suffix: string;
};

export default class RevisionPlugin extends Plugin {
  app: App & {
    commands: { executeCommandById: (id: string) => void };
  };
  manifest: PluginManifest;
  settings: PluginSettings;
  decorators: MarkdownDecorator[] = [
    {
      id: 'decorator:todo',
      name: 'Todo',
      prefix: `<mark class="decorator-todo">`,
      suffix: '</mark>',
    },
  ];

  async onload(): Promise<void> {
    console.debug(`Revision v${this.manifest.version} loaded`);
    await this.loadSettings();

    this.app.workspace.onLayoutReady(() => {
      // TBA
    });

    this.registerDecoratorCommands();
    this.registerEvent(
      this.app.workspace.on('editor-menu', this.handleContextMenu)
    );
  }

  registerDecoratorCommands = (): void => {
    const applyDecorator = (
      decorator: MarkdownDecorator,
      editor: Editor
    ): void => {
      const selection = editor.getSelection();
      const { prefix, suffix } = decorator;
      editor.replaceSelection(`${prefix}${selection}${suffix}`);
    };

    this.decorators.forEach((dec) => {
      this.addCommand({
        id: dec.id,
        name: dec.id,
        editorCallback: async (editor: Editor) => {
          applyDecorator(dec, editor);
          await wait(10);
          editor.focus();
        },
      });
    });
  };

  handleContextMenu = (menu: Menu, editor: Editor): void => {
    const selection = editor.getSelection();

    menu.addItem((item) => {
      item.setTitle('Annotate').onClick(async (e) => {
        // TBA anotate selection
        this.app.commands.executeCommandById(
          `obsidian-revision:decorator:todo`
        );
      });
    });

    if (selection) {
      menu.addItem((item) => {
        item.setTitle('Remove Annotation').onClick((e) => {
          // TBA remove annotated areas
        });
      });
    }
  };

  onunload() {}

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
}

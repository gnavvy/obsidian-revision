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
      id: 'decorator:asm',
      name: 'Assumption',
      prefix: `<mark>`,
      suffix: '</mark><sup class="decorator-asm">#re:asm</sup>',
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

    const removeDecorator = (
      decorator: MarkdownDecorator,
      editor: Editor
    ): void => {
      const selection = editor.getSelection();
      const newContent = selection
        .replace(/<mark.*?[^>]>/g, '')
        .replace(/<\/mark>/g, '')
        .replace(/<sup.*>/g, '')
        .replace(/<\/sup>/g, '');
      editor.replaceSelection(newContent);
    };

    this.decorators.forEach((dec) => {
      this.addCommand({
        id: `${dec.id}:apply`,
        name: dec.id,
        editorCallback: async (editor: Editor) => {
          applyDecorator(dec, editor);
          await wait(10);
          editor.focus();
        },
      });

      this.addCommand({
        id: `${dec.id}:remove`,
        name: dec.id,
        editorCallback: async (editor: Editor) => {
          removeDecorator(dec, editor);
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
        this.app.commands.executeCommandById(
          `obsidian-revision:decorator:asm:apply`
        );
      });
    });

    if (selection) {
      menu.addItem((item) => {
        item.setTitle('Remove Annotation').onClick(async (e) => {
          this.app.commands.executeCommandById(
            `obsidian-revision:decorator:asm:remove`
          );
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

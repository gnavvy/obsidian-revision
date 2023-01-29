import { App, Modal } from 'obsidian';

export default class SampleModal extends Modal {
  constructor(app: App) {
    super(app);
  }

  onOpen() {
    this.containerEl.setText('Woah!')
  }

  onClose() {
    this.containerEl.empty();
  }
}
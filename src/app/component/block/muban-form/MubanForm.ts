import AbstractBlock from '../AbstractBlock';
import validate from 'validate.js';

export default class MubanForm extends AbstractBlock {
  static displayName: string = 'muban-form';

  constructor(el: HTMLElement) {
    super(el);
  }

  public dispose() {
    super.dispose();
  }
}

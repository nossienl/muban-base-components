import AbstractBlock from '../AbstractBlock';

export default class Content extends AbstractBlock {
  static displayName: string = 'content';

  constructor(el: HTMLElement) {
    super(el);
  }

  public dispose() {
    super.dispose();
  }
}

import AbstractComponent from '../../AbstractComponent';

export default class Carousel extends AbstractComponent {
  static displayName: string = 'carousel';

  constructor(el: HTMLElement) {
    super(el);
  }

  public dispose() {}
}

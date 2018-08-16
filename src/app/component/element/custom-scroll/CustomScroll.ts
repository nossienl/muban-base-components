import AbstractComponent from '../../AbstractComponent';
import Scrollbar from './lib/Scrollbar';

export default class CustomScroll extends AbstractComponent {
  public static displayName: string = 'custom-scroll';
  public scrollBar: Scrollbar;

  constructor(el: HTMLElement) {
    super(el);

    // To wait for content
    setTimeout(() => {
      this.scrollBar = new Scrollbar(el, {});
    }, 200);
  }
}

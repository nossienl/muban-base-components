import AbstractComponent from '../../AbstractComponent';
import Scrollbar from './lib/Scrollbar';

export default class CustomScroll extends AbstractComponent {
  public static displayName: string = 'custom-scroll';
  public scrollBar: Scrollbar;
  public props: Object;

  constructor(el: HTMLElement) {
    super(el);

    this.props = {
      inside: el.hasAttribute('data-inside') || false,
    };

    const setContentSize = el.hasAttribute('data-set-content-size');

    if (setContentSize) {
      this.props['setContentSize'] = setContentSize;
    }

    // To wait for content
    setTimeout(() => {
      this.scrollBar = new Scrollbar(el, this.props);
    }, 200);
  }
}

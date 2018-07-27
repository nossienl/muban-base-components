import AbstractBlock from "../AbstractBlock";

export default class SiteNavigation extends AbstractBlock {
  static displayName:string = 'site-navigation';

  constructor(el:HTMLElement) {
    super(el);
  }

  public dispose() {
    super.dispose();
  }
}

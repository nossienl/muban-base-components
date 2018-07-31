import AbstractBlock from "../AbstractBlock";
import { TweenLite, Expo } from 'gsap';


export default class SiteNavigation extends AbstractBlock {
  static displayName:string = 'site-navigation';
  public static IS_OPEN:string = 'is-open';

  private _siteNavigation:HTMLElement;
  private _navigation:HTMLElement = this.getElement('.js-site-navigation-menu');
  private _menuButton:HTMLElement = this.getElement('.js-menu-button');
  private menuOpen:boolean = false;

  constructor(el:HTMLElement) {
    super(el);
    this._siteNavigation = el;

    if (window.innerWidth < 1024) {
      this.initMobile(this._navigation);
    }
    this.createEvents();
  }

  public createEvents():void {
    this._menuButton.addEventListener('click', this.handleMenuButtonClick);
  }

  public handleMenuButtonClick = ():void => {
    if (!this.menuOpen) {
      this._siteNavigation.classList.add(SiteNavigation.IS_OPEN);
      this.animateIn(this._navigation);
    } else {
      this.animateOut(this._navigation);
      this._siteNavigation.classList.remove(SiteNavigation.IS_OPEN);
    }
    this.menuOpen = !this.menuOpen;
  };

  public animateIn(menu: HTMLElement): void {
    TweenLite.to(menu, 0.25, { ease: Expo.easeOut, y: '0%' });
  }

  public animateOut(menu: HTMLElement): void {
    const activeTier = menu.querySelector('ul.is-active') || menu.querySelector('.tier-one');
    TweenLite.to(menu, 0.25, { y: `-${activeTier.clientHeight}px`, ease: Expo.easeIn });
  }

  public initMobile(menu: HTMLElement) {
    const activeTier = menu.querySelector('ul.is-active') || menu.querySelector('.tier-one');
    TweenLite.set(menu, { y: `-${activeTier.clientHeight}px` });
  }


  public dispose() {
    super.dispose();
  }
}

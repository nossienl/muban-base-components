import AbstractTransitionBlock from 'app/component/block/AbstractTransitionBlock';
import SiteNavigationTransitionController from './SiteNavigationTransitionController';
import MouseEvent from './event/MouseEvent';
import { DisposableEventListener } from 'seng-disposable-event-listener';

declare function require(name: string): string;

export default class SiteNavigation extends AbstractTransitionBlock {
  static displayName:string = 'site-navigation';
  public static IS_OPEN:string = 'is-open';
  public transitionController:SiteNavigationTransitionController;
  public listeners = [];
  private static desktop = window.matchMedia('(min-width: 1024px)');

  public _siteNavigation:HTMLElement;
  public _navigation:HTMLElement = this.getElement('.js-site-navigation-menu');
  private _menuButton:HTMLElement = this.getElement('.js-menu-button');
  private _menuOpen:boolean = false;

  private _searchWrapper:HTMLElement = this.getElement('.js-site-navigation-search');
  private _searchButton:HTMLElement = this.getElement('.js-search-button');
  private _searchCloseButton:HTMLElement = this.getElement('.js-close-search');
  private _searchOpen:boolean = false;

  private _menuItems: HTMLElement[];

  constructor(el:HTMLElement) {
    super(el);

    this.setInlineSvg();
    this.transitionController = new SiteNavigationTransitionController(this);
    this._siteNavigation = el;

    this._menuItems = this.getElements('.js-menu-item');

    this._menuItems.forEach((menuItem, index) => {
      menuItem.addEventListener('click', this.setActiveMenuItem.bind(this, index));
    });

    document.addEventListener('click', this.handleDocumentClick.bind(this));

    this._searchButton.addEventListener('click', this.handleSearchButtonClick);
    this._searchCloseButton.addEventListener('click', this.handleSearchButtonClick);

    this.mobileFunctionality(!SiteNavigation.desktop.matches);

    SiteNavigation.desktop.addListener((query) => {
      this.mobileFunctionality(!query.matches);
    });
  }

  public handleDocumentClick(event:MouseEvent) {
    this._menuItems.forEach((menuItem, index) => {
      menuItem.classList.remove(SiteNavigation.IS_OPEN);
    });
  }

  public setActiveMenuItem(activeIndex:number) {

    this._menuItems.forEach((menuItem, index) => {
      if (activeIndex === index) {
        menuItem.classList.add(SiteNavigation.IS_OPEN);
      }
    });


  }

  public set menuOpen(valueToSet) {
    if (! this._menuOpen && valueToSet) {
      this.transitionController.animateIn(this._navigation);
    } else if (this._menuOpen && !valueToSet) {
      this.transitionController.animateOut(this._navigation);
    }
    this._menuOpen = valueToSet;
    this.addClasses(this._menuOpen);
  }

  public set searchOpen(valueToSet) {
    if (! this._searchOpen && valueToSet) {
      this._searchWrapper.classList.add(SiteNavigation.IS_OPEN);
    } else if (this._searchOpen && !valueToSet) {
      this._searchWrapper.classList.remove(SiteNavigation.IS_OPEN);
    }
    this._searchOpen = valueToSet;
  }

  /**
   * Return the svg inline based on component path.
   */
  private setInlineSvg(){
    this.getElements('[data-icon]').forEach(el => {
     el.innerHTML = require(`./svg/${el.dataset.icon}.svg`);
    });
  };

  private mobileFunctionality(enable: boolean) {
    this._menuButton.addEventListener('click', this.handleMenuButtonClick);
    this.transitionController.initMobile(this._navigation);

    if (enable) {
      const tierItemElements: Array<HTMLElement> = this.getElements('span.tier-item');

      if (tierItemElements.length > 0) {
        this.bindMobileClickListeners(tierItemElements);
      }
    } else {
      this.removeMobileFunctionality();
    }
  };

  private removeMobileFunctionality() {
    this.listeners.forEach(listener => listener.dispose());
    this.listeners = [];
    this.menuOpen = false;

    this.transitionController.resetTierAnimationStyles();
  };

  public handleMenuButtonClick = ():void => {
    this.menuOpen = !this._menuOpen;
  };

  public handleSearchButtonClick = ():void => {
    this.searchOpen = !this._searchOpen;
  };

  private addClasses(shouldAdd:boolean) {
    if (shouldAdd) {
      this._siteNavigation.classList.add(SiteNavigation.IS_OPEN);
      this._menuButton.classList.add(SiteNavigation.IS_OPEN);
    } else {
      this._siteNavigation.classList.remove(SiteNavigation.IS_OPEN);
      this._menuButton.classList.remove(SiteNavigation.IS_OPEN);
    }
  }

  private bindMobileClickListeners(tierItemElements: Array<HTMLElement>) {
    tierItemElements.forEach(tierItemElement => {
      this.listeners.push(
        new DisposableEventListener(tierItemElement, MouseEvent.CLICK, () => {
          if (tierItemElement.nextElementSibling.tagName === 'UL') {
            this.transitionController.animateToTier(
              <HTMLElement>tierItemElement.nextElementSibling,
            );
          }
        }),
      );
    });

    const backButtons: Array<HTMLElement> = this.getElements('[data-back]');

    if (backButtons.length > 0) {
      backButtons.forEach(backButton => {
        this.listeners.push(
          new DisposableEventListener(backButton, MouseEvent.CLICK, event => {
            this.transitionController.animateBack(<HTMLElement>event.target);
          }),
        );
      });
    }
  }

  public startLoopingAnimation(): void {
    super.startLoopingAnimation();
  }

  public stopLoopingAnimation(): void {
    super.stopLoopingAnimation();
  }

  public dispose() {
    super.dispose();
  }
}

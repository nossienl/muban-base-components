import { MubanTransitionController } from 'muban-transition-component';
import SiteNavigation from './SiteNavigation'
import { Expo, TweenLite } from 'gsap';


class SiteNavigationTransitionController extends MubanTransitionController<SiteNavigation> {

  public tweenTime:number = 0.25;

  protected setupTransitionInTimeline(): void {}

  protected setupTransitionOutTimeline(): void {}

  protected setupLoopingAnimationTimeline(): void {}

  public animateIn(menu: HTMLElement): void {
    TweenLite.to(menu, this.tweenTime, { ease: Expo.easeOut, y: '0%' });
  }

  public animateOut(menu: HTMLElement): void {
    const activeTier = menu.querySelector('ul.is-active') || menu.querySelector('.tier-one');
    TweenLite.to(menu, this.tweenTime, { y: `-${activeTier.clientHeight}px`, ease: Expo.easeIn });
  }

  public initMobile(menu: HTMLElement) {
    const activeTier = menu.querySelector('ul.is-active') || menu.querySelector('.tier-one');
    TweenLite.set(menu, { y: `-${activeTier.clientHeight}px` });
  }

  public animateBack(tierItem?: HTMLElement) {
    const mainTier = this.parentController.element.querySelector('[data-slide-target]');

    TweenLite.to(mainTier, 0.5, {
      xPercent: (SiteNavigationTransitionController.getTierDepth(tierItem) - 1) * -100,
      ease: Expo.easeOut,
      onComplete: () => {
        if (
          tierItem.parentElement.tagName === 'UL' &&
          tierItem.parentElement.classList.contains('is-active')
        ) {
          tierItem.parentElement.classList.remove('is-active');
        }
      },
    });
  }

  public animateToTier(tierElement: HTMLElement) {
    tierElement.classList.add('is-active');

    const mainTier: HTMLElement = this.parentController.element.querySelector(
      '[data-slide-target]',
    );

    TweenLite.to(mainTier, 0.5, {
      xPercent:
        (SiteNavigationTransitionController.getTierDepth(tierElement) + 1) * -100,
      ease: Expo.easeOut,
    });
  }

  public resetTierAnimationStyles() {
    const mainTier: HTMLElement = this.parentController.element.querySelector(
      '[data-slide-target]',
    );
    const activeTier = mainTier.querySelector('ul.is-active');

    if (activeTier) {
      activeTier.classList.remove('is-active');
    }

    TweenLite.set(mainTier, { clearProps: 'all' });
    TweenLite.set(this.parentController._navigation, {delay: this.tweenTime, clearProps: 'all' });
  }

  private static getTierDepth(tierElement: HTMLElement): number {
    let parent = tierElement.parentElement;
    let depth = 0;

    while (!parent.dataset.slideTarget) {
      if (parent.tagName === 'UL') {
        depth += 1;
      }

      parent = parent.parentElement;
    }

    return depth;
  }

}

export default SiteNavigationTransitionController;

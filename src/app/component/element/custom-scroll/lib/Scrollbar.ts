import { TweenLite } from 'gsap';
import Draggable from 'gsap/Draggable';

interface ScrollbarOptions {
  inside?: boolean;
  hidebar?: boolean;
  hideBarTime?: number;
  horizontal?: boolean;
  setContentSize?: boolean;
}

/**
 * ## Scrollbar
 * Class that creates a custom scroll bar.
 *
 * ### Features:
 * - Create scroll bar inside or outside of scrolling content
 * - Hide scroll bar after x amount of milliseconds
 * - Vertical scroll bar
 * - Horizontal scroll bar
 *
 * # Getting started
 * Create a html structure like this:
 *
 * ```html
 * <div class="scroll-wrapper">
 *     <div class="scroll-content" data-scroll-content>
 *
 *          <div data-content-inner>
 *              Scrollable Content Here
 *          </div>
 *
 *     </div>
 *     <div class="scroll-bar" data-scroll-bar>
 *         <span class="knob" data-scroll-knob></span>
 *     </div>
 * </div>
 * ```
 *
 * Create  a new Scrollbar instance.
 * Default options are set, if you don't need to change them than leave them out
 *
 * ```typescript
 * private scrollbar:Scrollbar;
 *
 * var element = <HTMLElement>document.querySelector('.scroll-wrapper');
 * var options = {
 *		inside: true,
 *		hidebar: false,
 *		hideBarTime: 800,
 *		horizontal: false,
 *		setContentSize: true
 * };
 *
 * this.scrollbar = new Scrollbar(element, options);
 * ```
 *
 * @class Scrollbar
 */

class Scrollbar {
  private options: ScrollbarOptions = {
    inside: true,
    hidebar: false,
    hideBarTime: 800,
    horizontal: false,
    setContentSize: true,
  };

  private content: HTMLElement;
  private contentInner: HTMLElement;
  private bar: HTMLElement;
  private knob: HTMLElement;

  private dragInstance: any; // Draggable
  private hideTimer: number;
  private isDragging: boolean = false;

  private overflowSize: number = 0;

  private barSize: number = 0;
  private barSizeOpposite: number = 0;
  private knobSize: number = 0;

  /**
   * @constructor
   * @param {HTMLElement} element
   * @param {ScrollbarOptions} options
   */
  constructor(public element: HTMLElement, options?: ScrollbarOptions) {
    this.options = { ...this.options, ...options };

    this.content = <HTMLElement>this.element.querySelector('[data-scroll-content]');
    this.contentInner = <HTMLElement>this.content.querySelector('[data-content-inner]');
    this.bar = <HTMLElement>this.element.querySelector('[data-scroll-bar]');
    this.knob = <HTMLElement>this.bar.querySelector('[data-scroll-knob]');

    if (this.options.horizontal) {
      this.element.classList.add('scroll-x');
    }

    this.addEvents();
    this.createDraggable();
    this.hideKnob(true);

    this.update();
    this.setContentSize();
  }

  /**
   * Add event listeners
   * resize: on resize of window update the sizes and scroll position
   * scroll: show the knob and handle the scroll
   * mouseenter: show the knob on mouse enter on the bar
   * mouseleave: hide knob on mouse leave of the bar when not dragging
   *
   * @method addEvents
   */
  private addEvents(): void {
    window.addEventListener('resize', this.resize);
    this.content.addEventListener('scroll', this.handleScroll);
    this.bar.addEventListener('mouseenter', this.showKnob);
    this.bar.addEventListener('mouseleave', this.handleMouseLeave);
  }

  public resize = () => {
    setTimeout(() => {
      this.update();
      this.onScroll();
    }, 200);
  };

  private handleScroll = () => {
    this.showKnob();
    this.onScroll();
  };

  private handleMouseLeave = () => {
    if (!this.isDragging) {
      this.startHideKnob();
    }
  };

  /**
   * Create draggable element of the knob to enable drag to scroll
   *
   * @method createDraggable
   */
  private createDraggable(): void {
    this.dragInstance = Draggable.create(this.knob, {
      bounds: this.bar,
      type: this.options.horizontal ? 'x' : 'y',
      zIndexBoost: false,
      cursor: 'default',
      onDragStart: () => {
        this.isDragging = true;
        this.knob.classList.add('dragging');
      },
      onDragEnd: () => {
        this.isDragging = false;
        this.knob.classList.remove('dragging');
      },
      onDrag: () => {
        this.handleDrag();
      },
    })[0];
  }

  /**
   * Update all sizes of the scroll bar
   *
   * @method update
   */
  public update(): void {
    this.overflowSize = this.getScrollSize() - this.getWrapperSize();
    this.setContentSize();
    this.resizeKnob();
    this.getBarSize();
    this.getBarSizeOpposite();
    this.getKnobSize();
    this.dragInstance.update(true);
    this.onScroll();
  }

  /**
   * Handle the dragging of the knob
   * Calculates the new scroll position to the position of the knob and set the scroll position of the scroll area
   *
   * @method handleDrag
   */
  private handleDrag(): void {
    const max: number = this.barSize - this.knobSize;
    const pos: number = this.knob['_gsTransform'][this.options.horizontal ? 'x' : 'y'];
    const percentage: number = pos / max;

    this.scrollTo(Math.round(this.overflowSize * percentage));
  }

  /**
   * Handle the on scroll event
   * If the knob is not dragging than update the position of the knob on scroll
   * On scroll reset the start hide knob
   *
   * @method onScroll
   */
  public onScroll(): void {
    if (!this.isDragging) {
      const scrollPos: number = this.content[this.options.horizontal ? 'scrollLeft' : 'scrollTop'];
      const percentage: number = scrollPos / this.overflowSize;
      const max: number = this.barSize - this.knobSize;

      const dimension = max * percentage;
      const dimensions = {
        [this.options.horizontal ? 'x' : 'y']: isNaN(dimension) ? 0 : Math.round(dimension),
      };

      TweenLite.set(this.knob, dimensions);
    }

    this.startHideKnob();
  }

  /**
   * Set the width or height of the content-inner element
   * Setting with or height is depending on the type of scroll(vertical/horizontal)
   * If hidebar is false and inside is false the scroll bar will appear outside of the content
   * inner, else the scrollbar will appear on top of the content inner
   *
   * @method setContentSize
   */
  public setContentSize(): void {
    if (!this.options.setContentSize) {
      return;
    }

    if (this.contentInner) {
      this.contentInner.style[this.options.horizontal ? 'height' : 'width'] =
        this.getWrapperSizeOpposite() -
        (!this.options.hidebar && !this.options.inside ? this.barSizeOpposite : 0) +
        'px';
    }
  }

  /**
   * Resize the knob
   * Set the height of the knob depending on the scroll height
   * Hide the scrollbar when there is no scroll the the scroll content
   *
   * @method resizeKnob
   */
  private resizeKnob(): void {
    if (this.getWrapperSize() > 0 && this.getScrollSize() > 0) {
      this.getBarSize();
      this.knob.style[this.options.horizontal ? 'width' : 'height'] =
        Math.round(Math.max(20, this.barSize * (this.getWrapperSize() / this.getScrollSize()))) +
        'px';
    }

    if (!this.options.hidebar && this.overflowSize === 0) {
      TweenLite.to(this.bar, 0.2, { opacity: 0 });
    } else if (!this.options.hidebar && this.overflowSize !== 0) {
      TweenLite.to(this.bar, 0.2, { opacity: 1 });
    }
  }

  /**
   * Animate knob to opacity 1 if hidebar option is set to true and if scroll is possible
   *
   * @method showKnob
   */
  private showKnob = (): void => {
    if (this.options.hidebar && this.overflowSize > 0) {
      clearTimeout(this.hideTimer);

      TweenLite.to(this.bar, 0.2, { opacity: 1 });
      TweenLite.to(this.knob, 0.2, { autoAlpha: 1 });
    }
  };

  /**
   * Animate bar and knob to opacity 0 if hidebar option is set to true
   *
   * @method hideKnob
   * @param disableTween<boolean> indicating if it should animate or set to opacity 0
   */
  private hideKnob(disableTween: boolean = false): void {
    if (this.options.hidebar) {
      TweenLite.to(this.bar, disableTween ? 0 : 0.2, { opacity: 0 });
      TweenLite.to(this.knob, disableTween ? 0 : 0.2, { autoAlpha: 0 });
    }
  }

  /**
   * Start hide knob timer if hidebar option is set to true
   *
   * @method startHideKnob
   */
  private startHideKnob(): void {
    if (this.options.hidebar) {
      clearTimeout(this.hideTimer);

      this.hideTimer = setTimeout(() => {
        this.hideKnob();
      }, this.options.hideBarTime);
    }
  }

  /**
   * Scroll the content to the value
   *
   * @method scrollTo
   * @param value<number> new scroll position
   */
  private scrollTo(value: number = 0): void {
    this.content[this.options.horizontal ? 'scrollLeft' : 'scrollTop'] = value;
  }

  /**
   * Get the size (width/height) of the scroll wrapper, depending on the type of scroll(vertical/horizontal)
   * Horizontal returns width
   * Vertical returns height
   *
   * @method getWrapperSize
   * @returns {number}
   */
  private getWrapperSize(): number {
    return this.element.getBoundingClientRect()[this.options.horizontal ? 'width' : 'height'];
  }

  /**
   * Get the opposite size (width/height) of the scroll wrapper, depending on the type of scroll(vertical/horizontal)
   * Horizontal returns height
   * Vertical returns width
   *
   * @method getWrapperSizeOpposite
   * @returns {number}
   */
  private getWrapperSizeOpposite(): number {
    return this.element.getBoundingClientRect()[this.options.horizontal ? 'height' : 'width'];
  }

  /**
   * Get the scroll width or height of the scroll content, depending on the type of scroll(vertical/horizontal)
   * Horizontal returns scroll width
   * Vertical returns scroll height
   *
   * @method getScrollSize
   * @returns {any}
   */
  private getScrollSize(): number {
    if (this.content) {
      return this.content[this.options.horizontal ? 'scrollWidth' : 'scrollHeight'];
    }
  }

  /**
   * Get the size of the bar and safe it to the variable this.barSize
   * Type scroll horizontal gets width
   * Type scroll vertical gets height
   *
   * @method getBarSize
   */
  private getBarSize(): void {
    this.barSize = this.bar.getBoundingClientRect()[this.options.horizontal ? 'width' : 'height'];
  }

  /**
   * Get the opposite size of the bar and safe it to the variable this.barSizeOpposite
   * Type scroll horizontal gets height
   * Type scroll vertical gets width
   *
   * @method getBarSizeOpposite
   */
  private getBarSizeOpposite(): void {
    this.barSizeOpposite = this.bar.getBoundingClientRect()[
      this.options.horizontal ? 'height' : 'width'
    ];
  }

  /**
   * Get the size of the knob and safe it to the variable this.knobSize
   * Type scroll horizontal gets width
   * Type scroll vertical gets height
   *
   * @method getKnobSize
   */
  private getKnobSize(): void {
    this.knobSize = this.knob.getBoundingClientRect()[this.options.horizontal ? 'width' : 'height'];
  }

  public destruct(): void {
    if (this.dragInstance) {
      this.dragInstance.disable();
      this.dragInstance.kill();
      this.dragInstance = null;
    }

    if (this.hideTimer) {
      clearTimeout(this.hideTimer);
      this.hideTimer = null;
    }

    window.removeEventListener('resize', this.resize);

    if (this.content) {
      this.content.removeEventListener('scroll', this.handleScroll);
    }

    if (this.bar) {
      this.bar.removeEventListener('mouseenter', this.showKnob);
      this.bar.removeEventListener('mouseleave', this.handleMouseLeave);
    }

    this.content = null;
    this.contentInner = null;
    this.bar = null;
    this.knob = null;
    this.isDragging = null;
    this.overflowSize = null;
    this.barSize = null;
    this.barSizeOpposite = null;
  }
}

export default Scrollbar;

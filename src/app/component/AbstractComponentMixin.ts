import ICoreComponent from 'muban-core/lib/interface/ICoreComponent';
import isString from 'lodash/isString';
import isElement from 'lodash/isElement';
import isObject from 'lodash/isObject';
import { DisposableManager } from 'seng-disposable-manager';
import { DisposableEventListener } from 'seng-disposable-event-listener';
import getComponentForElement from 'muban-core/lib/utils/getComponentForElement';
import { IMubanTransitionMixin } from 'muban-transition-component';
import EventDispatcher from 'seng-event';

function abstractComponentMixin<TBase extends Constructor<ICoreComponent>>(Base: TBase) {
  return class AbstractComponentMixin extends Base {
    /**
     * The instance that contains all the disposables
     */
    public disposables: DisposableManager = new DisposableManager();

    constructor(...args: any[]) {
      super(...args);
    }

    /**
     * @public
     * @method addEventListener
     * @param dispatcher {string | Object} The dispatcher that you want to add a listener to
     * @param event {string} The event you want to listen to
     * @param callback {() => void} the callback method that will be triggered when the event is fired
     * @param automaticallyRemove {boolean} The event is automatically cleaned up when the component is disposed
     * @returns listener {DisposableEventListener} if the event listener is not automatically cleaned up it will return the
     * event listener so you can dispose of it manually.
     */
    public addEventListener(
      selector: string | HTMLElement | Object,
      event: string,
      callback: (event: any) => void,
      automaticallyRemove: boolean = true,
    ): DisposableEventListener | null {
      // Check if the type is a string then fetch the element
      let dispatcher = isString(selector) ? this.getElement(selector, this.element) : selector;

      if (isElement(dispatcher)) {
        // Check if the selected element has a component instance
        const instance = <IMubanTransitionMixin>getComponentForElement(<HTMLElement>dispatcher);

        // If the componentInstance exists return the component dispatcher, otherwise use the HTMLElement as a dispatcher.
        dispatcher = instance ? instance.dispatcher : dispatcher;
      } else if (isObject(dispatcher)) {
        if ((<IMubanTransitionMixin>dispatcher).dispatcher) {
          dispatcher = (<IMubanTransitionMixin>dispatcher).dispatcher;
        }

        if (!(<EventDispatcher>dispatcher).dispatchEvent) {
          throw new Error(
            'The provided selector does not contain a event dispatcher and does not extend the seng-event',
          );
        }
      }

      // Create the event listener
      const eventListener = new DisposableEventListener(dispatcher, event, callback);

      // Add it to the disposables so we can automatically remove it
      if (automaticallyRemove) this.disposables.add(eventListener);

      // Return it if not automatically resolved
      if (!automaticallyRemove) return eventListener;

      return null;
    }

    public dispose(): void {
      this.disposables.dispose();
      super.dispose();
    }
  };
}

export default abstractComponentMixin;

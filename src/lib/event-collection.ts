export type EventsMaps = WindowEventMap & DocumentEventMap;
export type EventsNames = keyof EventsMaps;
export type EventsTypes = GlobalEventHandlersEventMap[keyof GlobalEventHandlersEventMap];
export type ListenerFunc = (event?: EventsTypes) => any | EventListenerOrEventListenerObject;
export type AddOptions = boolean | AddEventListenerOptions;

export class EventsCollection {
  protected Listeners = new Map<EventsNames, Map<HTMLElement, Set<ListenerFunc>>>();
  protected ListenersAlias = new Map<PropertyKey, ListenerFunc>();

  addEvent(src: HTMLElement, type: EventsNames, listener: ListenerFunc, options?: AddOptions, alias?: PropertyKey) {
    const eType = this.Listeners.get(type);
    if (eType) {
      const eElem = eType.get(src);
      if (eElem) {
        eElem.add(listener);
      } else {
        const set = new Set<ListenerFunc>();
        set.add(listener);
        eType.set(src, set);
      }
    } else {
      const s = new Set<ListenerFunc>();
      s.add(listener);
      const m = new Map<any, Set<ListenerFunc>>();
      m.set(src, s);
      this.Listeners.set(type, m);
    }
    src.addEventListener(type, listener, options);
    if (alias) {
      this.ListenersAlias.set(alias, listener);
    }
  }

  removeEvent(src: HTMLElement, type: EventsNames, alias: PropertyKey | ListenerFunc, option?: EventListenerOptions) {
    const eType = this.Listeners.get(type);
    if (eType) {
      const eSet = eType.get(src);
      if (eSet) {
        if (typeof alias !== "function") {
          const listener = this.ListenersAlias.get(alias);
          if (listener) {
            eSet.delete(listener);
            src.removeEventListener(type, listener, option);
          }
        } else {
          eSet.forEach((listener) => {
            src.removeEventListener(type, listener, option);
          });
        }
        if (!eSet.size) {
          eType.delete(src);
        }
        if (!eType.size) {
          this.Listeners.delete(type);
        }
      }
    }
  }

  removeAllEvents() {
    this.Listeners.forEach((typeMap, type) => {
      typeMap.forEach((eventListeners, src) => {
        eventListeners.forEach((listener) => {
          src.removeEventListener(type, listener);
        });
      });
      typeMap.clear();
      this.Listeners.delete(type);
    });
    this.ListenersAlias.clear();
  }
}

export default EventsCollection;

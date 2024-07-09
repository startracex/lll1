export type EventsMaps = WindowEventMap & DocumentEventMap;
export type EventsNames = keyof EventsMaps;
export type EventsHandler = GlobalEventHandlersEventMap[keyof GlobalEventHandlersEventMap];
export type ListenerFunc = (event?: EventsHandler) => any | EventListenerOrEventListenerObject;
export type AddOptions = boolean | AddEventListenerOptions;

export class EventsCollection {
  private coll = new Map<EventsNames, Map<EventTarget, Set<ListenerFunc>>>();

  addEvent<SRC extends EventTarget = HTMLElement>(
    src: SRC,
    type: EventsNames,
    listener: ListenerFunc,
    options?: AddOptions,
  ) {
    const eType = this.coll.get(type) || new Map<any, Set<ListenerFunc>>();
    const eElem = eType.get(src) || new Set<ListenerFunc>();

    eElem.add(listener);
    eType.set(src, eElem);
    this.coll.set(type, eType);

    src.addEventListener(type, listener, options);
    return listener;
  }

  removeEvent<SRC extends EventTarget = HTMLElement>(
    src: SRC,
    type: EventsNames,
    listener: ListenerFunc,
    option?: EventListenerOptions,
  ) {
    if (listener) {
      const eType = this.coll.get(type);
      if (eType) {
        const eElem = eType.get(src);
        if (eElem) {
          eElem.delete(listener);
          if (!eElem.size) {
            eType.delete(src);
            if (!eType.size) {
              this.coll.delete(type);
            }
          }
        }
      }
      src.removeEventListener(type, listener, option);
    }
  }

  removeAllEvents() {
    this.coll.forEach((typeMap, type) => {
      typeMap.forEach((eventListeners, src) => {
        eventListeners.forEach((listener) => {
          src.removeEventListener(type, listener);
        });
      });
      typeMap.clear();
      this.coll.delete(type);
    });
  }
}

export default EventsCollection;

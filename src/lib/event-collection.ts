export type EventListenerFunc = (...args: any[]) => any;

export class EventsCollection {
  protected EventsCollection = new Map<string, Map<any, Set<EventListenerFunc>>>();
  protected ListenersAlias = new Map<string, EventListenerFunc>();

  addEvent(src: any, type: string, listener: EventListenerFunc, alias?: string) {
    const gotType = this.EventsCollection.get(type);
    if (gotType) {
      const gotEle = gotType.get(src);
      if (gotEle) {
        gotEle.add(listener);
      } else {
        const s = new Set<EventListenerFunc>();
        s.add(listener);
        gotType.set(src, s);
      }
    } else {
      const s = new Set<EventListenerFunc>();
      s.add(listener);
      const m = new Map<any, Set<EventListenerFunc>>();
      m.set(src, s);
      this.EventsCollection.set(type, m);
    }
    src.addEventListener(type, listener);
    if (alias) {
      this.ListenersAlias.set(alias, listener);
    }
  }

  removeEvent(src: any, type: string, id: string | EventListenerFunc) {
    const gotType = this.EventsCollection.get(type);
    if (gotType) {
      const gotEle = gotType.get(src);
      if (gotEle) {
        if (typeof id === "string") {
          const listener = this.ListenersAlias.get(id);
          if (listener) {
            gotEle.delete(listener);
            src.removeEventListener(type, listener);
          }
        } else {
          gotEle.forEach((listener) => {
            src.removeEventListener(type, listener);
          });
        }
        if (gotEle.size === 0) {
          gotType.delete(src);
        }
        if (gotType.size === 0) {
          this.EventsCollection.delete(type);
        }
      }
    }
  }

  removeAllEvents() {
    this.EventsCollection.forEach((typeMap, type) => {
      typeMap.forEach((eventListeners, src) => {
        eventListeners.forEach((listener) => {
          src.removeEventListener(type, listener);
        });
      });
      typeMap.clear();
      this.EventsCollection.delete(type);
    });
    this.ListenersAlias.clear();
  }
}

export default EventsCollection;

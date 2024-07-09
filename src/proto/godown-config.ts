export class GodownConfig {
  assign: Record<string, any> = null;
  reflect = false;
  prefix = "g-";
  suffix = "";
  cssvar = "godown";
  components: Accessor<string, CustomElementConstructor> = new Map();
  readonly override: {
    pushState?: typeof history.pushState;
  } = {};

  tag(origin: string) {
    return this.prefix + origin + this.suffix;
  }

  define(name: string, constructor: CustomElementConstructor, options?: ElementDefinitionOptions) {
    customElements.define(name, constructor, options);
    this.components.set(name, constructor);
    globalThis.document?.dispatchEvent(
      new CustomEvent<DefineEvent>("godown-define", {
        detail: {
          name,
          constructor,
          options,
        },
      }),
    );
  }

  /**
   * Use `this.components` instead.
   * @deprecated
   */
  nameMap: Accessor;
  /**
   * Use `this.components` instead.
   * @deprecated
   */
  classMap: Accessor<string, CustomElementConstructor>;
}

export default GodownConfig;

export interface GodownEventMap {
  "godown-define": DefineEvent;
}

export interface DefineEvent {
  name: string;
  constructor: CustomElementConstructor;
  options?: ElementDefinitionOptions;
}

export type MixedRecord<K, V, M> = M | (K extends PropertyKey ? M & Record<K, V> : never);
export type SetAccessor<K = string, V = string | undefined> = MixedRecord<K, V, { set(key: K, value: V): void }>;
export type GetAccessor<K = string, V = string | undefined> = MixedRecord<K, V, { get: (key: K) => V }>;
export type Accessor<K = string, V = string | undefined> = GetAccessor<K, V> & SetAccessor<K, V>;

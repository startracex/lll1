class GodownConfig {
  protected reflect = false;

  assign: null | Record<string, any> = null;
  prefix = "godown";
  suffix = "";
  components = new Map<string, CustomElementConstructor>();

  constructor(init?: Partial<GodownConfig & Record<PropertyKey, any>>) {
    if (init) { Object.assign(this, init); }
  }

  tag(origin: string) {
    return [
      this.prefix,
      origin,
      this.suffix,
    ].filter(s => s).join("-");
  }

  define(name: string, constructor: CustomElementConstructor, options?: ElementDefinitionOptions) {
    customElements.define(name, constructor, options);
    this.components.set(name, constructor);
  }
}

export { GodownConfig, GodownConfig as default };

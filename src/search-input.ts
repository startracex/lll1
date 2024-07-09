import SearchInput from "./web-components/input/search-input.js";
SearchInput.define();
export default SearchInput;
export * from "./web-components/input/search-input.js";

declare global {
  interface HTMLElementTagNameMap {
    "g-search-input": SearchInput;
  }
}

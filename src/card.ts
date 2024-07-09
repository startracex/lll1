import Card from "./web-components/card/card.js";
Card.define();
export default Card;
export * from "./web-components/card/card.js";

declare global {
  interface HTMLElementTagNameMap {
    "g-card": Card;
  }
}

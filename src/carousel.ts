import Carousel from "./web-components/carousel/carousel.js";
Carousel.define();
export default Carousel;
export * from "./web-components/carousel/carousel.js";

declare global {
  interface HTMLElementTagNameMap {
    "g-carousel": Carousel;
  }
}

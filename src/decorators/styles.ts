import { globalStyles } from "../styles/global.js";

export const styles = (...styles: any[]) => {
  return (constructor: any) => {
    constructor.styles = [globalStyles, ...styles];
  };
};
export default styles;

import { GLOBSTD, css } from "../deps.js";
export default class ViewSTD extends GLOBSTD { }
export const DLsharecss = css`
:host{
  display: block;
  transition: all .3s ease-in-out;
}
span{
  display: inline-flex;
  align-items: center;
  flex:1;
  white-space: nowrap;
}
dt{
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  background: inherit;
  align-items: center;
}
*{
  transition:inherit;
}
dd{
  overflow:hidden;
  display:grid;
  grid-template-rows:0fr;
}
section{
  min-height:0;
  overflow:hidden;
}
dd[open]{
  grid-template-rows:1fr;
}
`;
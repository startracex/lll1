import { nothing } from "lit";

export const throughValue = (...values: any[]) => {
  let result: any;
  values.forEach(v => result ||= v);
  return result || nothing;
};
export const throughDefine = (...values: any[]) => {
  let result: any;
  values.forEach(v => result ??= v);
  return result ?? nothing;
};

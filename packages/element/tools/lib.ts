/**
 * Returns true if the value is null or undefined.
 */
export function isNil(value: any) {
  // eslint-disable-next-line eqeqeq
  return value == null;
}

/**
 * Returns true if the value is a number.
 */
export function isNumerical(value?: string | number) {
  return !isNaN(+value);
}

/**
 * Returns a random number between m and n.
 */
export function random(m = 0, n = 1) {
  const max = Math.max(m, n);
  const min = Math.min(m, n);
  return Math.random() * (max - min) + min;
}

/**
 * trimRight remove all characters from the right of a string that are present in a given string.
 */
export const trimRight = (s: string, spec = " ") => {
  if (s === "" || spec === "") {
    return s;
  }
  let end = s.length;
  while (end > 0 && s.slice(end - spec.length, end) === spec) {
    end -= spec.length;
  }
  return s.slice(0, end);
};

/**
 * trimLeft remove all characters from the left of a string that are present in a given string.
 */
export const trimLeft = (s: string, spec = " ") => {
  if (s === "" || spec === "") {
    return s;
  }
  let start = 0;
  while (start < s.length && s.slice(start, start + spec.length) === spec) {
    start += spec.length;
  }
  return s.slice(start);
};

export const trim = (s: string, spec?: string) => {
  return trimRight(trimLeft(s, spec), spec);
};

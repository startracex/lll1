export function debounce(func: (_: any) => any, timeout: number) {
  let timer = null;
  return function () {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      func.apply(this, arguments);
    }, timeout);
  };
}

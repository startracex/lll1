export function convertTemplate(template, args) {
  args ??= "";
  const isFunc = typeof template === "function";
  if (args === "") {
    return isFunc ? template(args) : template;
  }
  let arg0;
  if (typeof args === "string") {
    arg0 = { $0: args };
  } else if (Array.isArray(args)) {
    arg0 = args.reduce((acc, value, index) => {
      acc[`$${index}`] = value;
      return acc;
    }, {});
  } else {
    arg0 = args;
  }
  const result = isFunc ? template(arg0) : template;
  return Object.entries(arg0)
    .sort(([key1], [key2]) => {
      return key2.length - key1.length;
    })
    .reduce((acc, [key, value]) => {
      return acc.replaceAll(key, value);
    }, result);
}
export default convertTemplate;

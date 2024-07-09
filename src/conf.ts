import GodownConfig from "./proto/godown-config.js";

const globalKey = "GodownWebComponentsCONF";
const conf = assignConfig(globalThis[globalKey], new GodownConfig());

export default conf;

function assignConfig(config: Partial<GodownConfig>, source: GodownConfig): GodownConfig {
  Object.assign(source, config);
  if (source.reflect) {
    // Reflect to globalThis.
    globalThis[globalKey] = source;
  } else {
    try {
      delete globalThis[globalKey];
    } catch (e) {
      /* empty */
    }
  }
  return source;
}

export function defineConfig(config: Parameters<typeof assignConfig>[0]): GodownConfig {
  return assignConfig(config, conf);
}

declare global {
  interface globalThis {
    [globalKey]: GodownConfig;
  }
}

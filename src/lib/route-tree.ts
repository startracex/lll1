export class RouteTree {
  pattern = "";
  part = "";
  children: RouteTree[] = [];
  isWild = false;

  insert(pattern: string, parts: string[] | undefined = undefined, height = 0): void {
    if (!parts) {
      parts = RouteTree.split(pattern);
    }
    if (parts.length === height) {
      this.pattern = pattern;
      return;
    }
    const part = parts[height];
    let child = this.matchChild(part);
    if (child === null) {
      child = new RouteTree();
      child.part = part;
      const { carry } = RouteTree.dynamic(part);
      child.isWild = Boolean(carry);
      this.children.push(child);
    }
    child.insert(pattern, parts, height + 1);
  }

  search(parts: string[], height = 0): RouteTree | null {
    if (parts.length === height || this.part.startsWith("*")) {
      if (this.pattern === "") {
        return null;
      }
      return this;
    }
    const part = parts[height];
    const children = this.matchChildren(part);
    for (const child of children) {
      const result = child.search(parts, height + 1);
      if (result !== null) {
        return result;
      }
    }
    return null;
  }

  matchChild(part: string): RouteTree | null {
    for (const child of this.children) {
      if (child.part === part || child.isWild) {
        return child;
      }
    }
    return null;
  }

  matchChildren(part: string): RouteTree[] {
    const nodes: RouteTree[] = [];
    for (const child of this.children) {
      if (child.part === part || child.isWild) {
        nodes.push(child);
      }
    }
    return nodes;
  }

  static split(s: string): string[] {
    return s.split("/").filter((a) => a);
  }

  /**
   *
   * @param s Pattern, may contains dynamic matching parameters.
   * @returns {object} key, carry, multi.
   * @property {string} key - Dynamic key.
   * @property {number} carry - The length of the modifier symbol for the dynamic prefix.
   * @property {boolean} multi - Ignore after.
   */
  static dynamic(s: string): {
    key: string;
    carry: number;
    multi: boolean;
  } {
    if (s[0] === "{" && s[s.length - 1] === "}") {
      s = s.substring(1, s.length - 1);
      if (s[0] !== ":" && s[0] !== "*" && s[0] !== ".") {
        return {
          key: s,
          carry: 0,
          multi: false,
        };
      }
    }
    if (s[0] === "[" && s[s.length - 1] === "]") {
      s = s.substring(1, s.length - 1);
    }
    const s1 = s.substring(0, 1);
    if (s1 === ":") {
      return {
        key: s,
        carry: 1,
        multi: false,
      };
    }
    if (s1 === "*") {
      return {
        key: s,
        carry: 1,
        multi: true,
      };
    }
    const s3 = s.substring(0, 3);
    if (s3 === "...") {
      return {
        key: s,
        carry: 3,
        multi: true,
      };
    }
    return {
      key: "",
      carry: 0,
      multi: false,
    };
  }

  useWhich(s: string): string | null {
    const sp = RouteTree.split(s);
    const t = this.search(sp);
    if (t) {
      return t.pattern;
    }
    return null;
  }

  parseParams(s: string, pattern: string): Record<string, string> {
    const sSplit = RouteTree.split(s);
    const patternSplit = RouteTree.split(pattern);
    const params: Record<string, string> = {};
    for (const index in patternSplit) {
      const { key, carry, multi } = RouteTree.dynamic(patternSplit[index]);
      if (!key) {
        continue;
      }
      params[key.substring(carry)] = sSplit[index];
      if (multi) {
        break;
      }
    }
    return params;
  }
}
export default RouteTree;

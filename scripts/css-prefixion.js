import autoprefixer from "autoprefixer";
import { readFileSync, writeFileSync, mkdirSync } from "fs";
import postcss from "postcss";
import { join } from "path/posix";
import { componentsJSON, mustExistDir } from "./_deps.js";

const list = ["since 2021"];
const processor = postcss([autoprefixer(list)]);

const backupDirectory = "backup";
mustExistDir(backupDirectory);

const changedLen = componentsJSON.filter(({ path, definition }) => {
  const srcPath = join("src", path + ".ts");
  const backupPath = join(backupDirectory, definition + ".ts");
  const fileContent = readFileSync(srcPath).toString();

  const templates = extractFromTemplate(fileContent);

  for (const temp of templates) {
    const converter = createConverter();
    const processResult = processor.process(converter.convert(temp.content));
    temp.pcss = converter.restore(processResult.css);
  }

  let newContent = "";
  let index = 0;

  for (const temp of templates) {
    newContent += fileContent.slice(index, temp.start);
    newContent += temp.pcss;
    index = temp.end;
  }
  newContent += fileContent.slice(index);

  if (newContent === fileContent) {
    return false;
  }

  writeFileSync(srcPath, newContent);
  writeFileSync(backupPath, fileContent);
  return true;
}).length;

console.log(changedLen ? `Changed count ${changedLen}.` : "No prefix added.");

/**
 * @param {string} template
 */
function extractFromTemplate(template) {
  const regex = /(css\s*`([^`]*)`)/g;
  const matches = [];
  let match;

  while ((match = regex.exec(template)) !== null) {
    matches.push({
      content: match[2],
      start: match.index + match[1].indexOf("`") + 1,
      end: match.index + match[0].length - 1,
      pcss: "",
    });
  }

  return matches;
}

function createConverter() {
  const randBefore = "--" + randomUppercase(40);
  const randAfter = "--" + randomUppercase(40);
  return {
    /**
     * @param {string} value
     */
    convert(value) {
      return value.replace(/\$\{([^\}]+)\}/g, `${randBefore}$1${randAfter}`);
    },
    /**
     * @param {string} value
     */
    restore(value) {
      return value.replaceAll(randBefore, "${").replaceAll(randAfter, "}");
    },
  };
}

/**
 * @param {number} length
 */
function randomUppercase(length) {
  return Array.from({ length }, () => String.fromCharCode(Math.floor(Math.random() * 26) + 65)).join("");
}

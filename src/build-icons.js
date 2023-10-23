/* eslint-disable @typescript-eslint/no-unused-vars */
import { promises as fs } from "node:fs";
import * as path from "node:path";
import { glob } from "glob";
import { parse } from "node-html-parser";

// eslint-disable-next-line no-undef
const cwd = process.cwd();
const inputDir = path.join(cwd, "svg-icons");
const inputDirRelative = path.relative(cwd, inputDir);
const outputDir = path.join(cwd, "icons");
const outputDirRelative = path.relative(cwd, outputDir);
const files = glob
  .sync("**/*.svg", {
    cwd: inputDir,
  })
  .sort((a, b) => a.localeCompare(b));
if (files.length === 0) {
  console.log(`No SVG files found in ${inputDirRelative}`);
  // eslint-disable-next-line no-undef
  process.exit(0);
}
// The relative paths are just for cleaner logs
console.log(`Generating sprite for ${inputDirRelative}`);
console.log("Output dir", outputDir);

/**
 * Outputs an SVG string with all the icons as symbols
 */
async function generateSvgSprite({ files, inputDir }) {
  // Each SVG becomes a symbol and we wrap them all in a single SVG
  const symbols = await Promise.all(
    files.map(async (file) => {
      const input = await fs.readFile(path.join(inputDir, file), "utf8");
      const root = parse(input);
      const svg = root.querySelector("svg");
      if (!svg) throw new Error("No SVG element found");
      svg.tagName = "symbol";
      svg.setAttribute("id", file.replace(/\.svg$/, ""));
      svg.removeAttribute("xmlns");
      svg.removeAttribute("xmlns:xlink");
      svg.removeAttribute("version");
      svg.removeAttribute("width");
      svg.removeAttribute("height");
      return svg.toString().trim();
    })
  );
  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="0" height="0">`,
    `<defs>`, // for semantics: https://developer.mozilla.org/en-US/docs/Web/SVG/Element/defs
    ...symbols,
    `</defs>`,
    `</svg>`,
  ].join("\n");
}
/**
 * Each write can trigger dev server reloads
 * so only write if the content has changed
 */
async function writeIfChanged(filepath, newContent) {
  const currentContent = await fs.readFile(filepath, "utf8");
  if (currentContent !== newContent) {
    return fs.writeFile(filepath, newContent, "utf8");
  }
}

async function finalFunc() {
  const spritesheetContent = await generateSvgSprite({
    files,
    inputDir,
  });
  await writeIfChanged(path.join(outputDir, "sprite.svg"), spritesheetContent);
}

finalFunc();

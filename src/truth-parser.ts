// import { parse } from "node-html-parser";

// const data = await fetch("https://truthsocial.com/discover").then((res) =>
//   res.text(),
// );

// console.log("data", data);

// const root = parse(data);

// // console.log(root);

// const elements = root.querySelectorAll("[data-markup]");

// console.log(elements);

// elements.forEach((el) => {
//   console.log(el.textContent);
// });
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";

puppeteer.use(StealthPlugin());

const browser = await puppeteer.launch();
const page = await browser.newPage();

await page.setViewport({ width: 1280, height: 720 });

await page.goto("https://truthsocial.com/discover", {
  waitUntil: "networkidle2",
  timeout: 100000,
});
// const htmlPage = await page.waitForSelector("p");
await page.screenshot({ path: "screenshot.png" });

// console.log(await htmlPage?.text());

const elements = await page.$$eval("[data-markup]", (elems) =>
  elems.map((elem) => elem.outerHTML),
);

console.log(elements);

await browser.close();

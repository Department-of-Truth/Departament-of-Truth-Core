import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import { deployTokenToPumpFun } from "./pumpfun";
import { AgentRuntime, IAgentRuntime } from "@ai16z/eliza";

puppeteer.use(StealthPlugin());

const browser = await puppeteer.launch();
const page = await browser.newPage();

await page.setViewport({ width: 1280, height: 720 });

const populalPersonalities = [
  "@realDonaldTrump",
  "@JDVance1",
  "@Charliekirk",
  "@DonaldJTrumpJr",
];

const parseComments = async (person: string) => {
  await page.goto(`https://truthsocial.com/${person}/replies`, {
    waitUntil: "networkidle2",
    timeout: 100000,
  });
  // const htmlPage = await page.waitForSelector("p");
  await page.screenshot({ path: "screenshot.png" });

  // console.log(await htmlPage?.text());

  const replies = (await page.$$eval("[data-reply]", (elems) =>
    elems.map((elem) => elem.outerHTML),
  )) as any;

  replies.forEach((reply: { likes: string[]; owner: string }) => {
    if (reply.likes.length >= 10) {
      deployTokenToPumpFun(
        AgentRuntime as unknown as IAgentRuntime,
        reply.owner,
        "dot",
      );
    }
  });

  await browser.close();
};

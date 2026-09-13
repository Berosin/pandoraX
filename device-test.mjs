import { chromium, devices } from "playwright";

const BASE = "http://localhost:3262";
const browser = await chromium.launch();

const profiles = [
  { name: "Desktop", viewport: { width: 1440, height: 900 } },
  { name: "Tablet (iPad)", ...devices["iPad (gen 7)"] },
  { name: "Mobile (iPhone 13)", ...devices["iPhone 13"] },
];

const routes = ["/", "/artifacts", "/artifacts/crystal-gem", "/artifacts/threejs-environment"];

for (const profile of profiles) {
  const { name, ...contextOptions } = profile;
  const context = await browser.newContext(contextOptions);
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });

  console.log(`\n########## ${name} ##########`);
  for (const route of routes) {
    errors.length = 0;
    await page.goto(`${BASE}${route}`, { waitUntil: "networkidle" });
    await page.waitForTimeout(1000);
    const canvasCount = await page.locator("canvas").count();
    console.log(`  ${route.padEnd(30)} canvases=${canvasCount}  errors=${errors.length === 0 ? "none" : errors.join(" | ")}`);
  }
  await context.close();
}

await browser.close();

import { chromium } from "playwright";
import fs from "node:fs";

const appUrl = "http://localhost:5173";
const timestamp = Date.now();
const testUser = {
  name: "Codex QA",
  email: `codex.qa.${timestamp}@example.com`,
  password: "ResumeTest123!",
};

const results = {
  signup: false,
  builderReached: false,
  aiSummaryTriggered: false,
  aiSkillsTriggered: false,
  aiProjectTriggered: false,
  pdfDownloaded: false,
  notes: [],
};

const addNote = (message) => results.notes.push(message);

async function clickContinue(page) {
  const continueButton = page.getByRole("button", { name: /continue/i });
  try {
    await continueButton.click();
  } catch (error) {
    addNote(`Continue button required forced click: ${error.name}`);
    await continueButton.click({ force: true });
  }
}

async function closeAiModal(page, titlePattern) {
  if (!(await page.getByText(titlePattern).count())) {
    return;
  }

  await page.locator('div.fixed.inset-0.z-50').click({ position: { x: 5, y: 5 } }).catch(() => {});
  await page.waitForTimeout(500);

  if (await page.getByText(titlePattern).count()) {
    await page.locator('div.fixed.inset-0.z-50 button').nth(1).click().catch(() => {});
    await page.waitForTimeout(500);
  }
}

async function fillOnboarding(page) {
  await page.locator('[name="fullName"]').fill("Codex QA");
  await page.locator('[name="targetJobTitle"]').fill("Frontend Developer");
  await page.locator('[name="targetIndustry"]').fill("Technology");
  await page.getByText("Student/Recent Graduate").click();
  await clickContinue(page);
}

async function fillContact(page) {
  await page.locator('[name="email"]').fill(testUser.email);
  await page.locator('[name="phone"]').fill("+1 555 123 4567");
  await page.locator('[name="location"]').fill("Dhaka, Bangladesh");
  await page.locator('[name="linkedin"]').fill("https://linkedin.com/in/codex-qa");
  await clickContinue(page);
}

async function fillProfileQuestions(page) {
  await page.locator('[name="graduationDate"]').fill("May 2026");
  await page.locator('[name="gpa"]').fill("3.9/4.0");
  await page.locator('[name="relevantCoursework"]').fill("Data Structures, Algorithms, Human Computer Interaction");
  await clickContinue(page);
}

async function testSummaryAI(page) {
  page.on("dialog", async (dialog) => {
    addNote(`Dialog: ${dialog.message()}`);
    await dialog.dismiss();
  });

  await page.getByRole("button", { name: /generate summary/i }).click();
  await page.waitForTimeout(4000);

  const summaryValue = await page.locator('textarea[name="summary"]').inputValue();
  if (summaryValue.trim()) {
    results.aiSummaryTriggered = true;
  } else {
    addNote("Summary AI did not populate content within the wait window.");
    await page
      .locator('textarea[name="summary"]')
      .fill("Student developer with project experience building responsive web apps.");
  }

  await clickContinue(page);
}

async function fillEducation(page) {
  await page.getByRole("button", { name: /add another education/i }).click();
  await page.locator('[name="school"]').fill("Daffodil International University");
  await page.locator('[name="degree"]').fill("BSc in Computer Science");
  await page.locator('[name="startDate"]').fill("Jan 2022");
  await page.locator('[name="endDate"]').fill("May 2026");
  await clickContinue(page);
}

async function fillExperience(page) {
  await page.getByRole("button", { name: /add another experience/i }).click();
  await page.locator('[name="jobTitle"]').fill("Frontend Intern");
  await page.locator('[name="company"]').fill("Tech Labs");
  await page.locator('[name="location"]').fill("Remote");
  await page.locator('[name="startDate"]').fill("Jun 2025");
  await page.locator('[name="endDate"]').fill("Aug 2025");
  await page
    .locator('textarea[name="description"]')
    .fill("Built reusable React UI components and improved page performance by 20%.");
  await clickContinue(page);
}

async function testSkillsAI(page) {
  const skillInput = page.getByPlaceholder("Add a skill and press Enter");
  await skillInput.fill("React");
  await skillInput.press("Enter");
  await page.waitForTimeout(1000);

  await page.getByRole("button", { name: /ai suggest skills/i }).click();
  await page.waitForTimeout(6000);

  const skillChips = await page.locator("text=Intermediate").count();
  if (skillChips > 0) {
    results.aiSkillsTriggered = true;
  } else {
    addNote("Skills AI did not visibly add new chips within the wait window.");
  }

  await clickContinue(page);
  await page.waitForTimeout(1500);
  if ((await page.locator("body").innerText()).includes("\nSkills\n")) {
    addNote("Skills step required a second continue attempt after state settled.");
    await clickContinue(page);
  }
}

async function fillProject(page) {
  if ((await page.locator('[name="name"]').count()) === 0) {
    addNote("Projects step opened without a default project form; clicked Add Another Project to continue.");
    await page.getByRole("button", { name: /add another project/i }).click();
    await page.waitForTimeout(1000);
  }

  await page.locator('[name="name"]').fill("Resume Builder QA Project");
  await page.locator('[name="technologies"]').fill("React, Firebase, Vite");
  await page.locator('[name="liveUrl"]').fill("https://example.com/demo");

  await page.locator('button:has-text("AI Suggest")').first().click();
  await page.waitForTimeout(4000);

  const aiDialogVisible = await page.getByText(/AI-Powered Project Description Suggestions/i).count();
  if (aiDialogVisible > 0) {
    results.aiProjectTriggered = true;
    const applyCount = await page.getByRole("button", { name: /apply/i }).count();
    if (applyCount > 0) {
      await page.getByRole("button", { name: /apply/i }).first().click();
    } else {
      addNote("Project AI modal opened without actionable suggestions.");
    }
    await closeAiModal(page, /AI-Powered Project Description Suggestions/i);
  } else {
    addNote("Project AI suggestions did not open within the wait window.");
    await page
      .locator('textarea[name="description"]')
      .fill("Created a resume builder with AI-assisted writing and PDF export.");
  }

  const description = page.locator('textarea[name="description"]');
  if (!(await description.inputValue()).trim()) {
    await description.fill("Created a resume builder with AI-assisted writing and PDF export.");
  }

  if (await page.getByText(/AI-Powered Project Description Suggestions/i).count()) {
    await closeAiModal(page, /AI-Powered Project Description Suggestions/i);
  }

  await clickContinue(page);
}

async function completeFinalSteps(page) {
  await page.getByText(/Modern Professional/i).click().catch(() => {});
  await clickContinue(page);
  await clickContinue(page);
  await clickContinue(page);
}

async function downloadPdf(page) {
  const downloadPromise = page.waitForEvent("download", { timeout: 30000 });
  await page.getByRole("button", { name: /download pdf resume/i }).click();
  const download = await downloadPromise;
  const fileName = download.suggestedFilename();
  await download.saveAs(`downloads/${fileName}`);
  results.pdfDownloaded = fileName.endsWith(".pdf");
  addNote(`PDF downloaded as ${fileName}`);
}

async function main() {
  fs.mkdirSync("downloads", { recursive: true });
  fs.mkdirSync("artifacts", { recursive: true });
  const browser = await chromium.launch({
    channel: "chrome",
    headless: true,
  });
  const context = await browser.newContext({
    acceptDownloads: true,
    viewport: { width: 1440, height: 1200 },
  });
  const page = await context.newPage();

  try {
    try {
      await page.goto(`${appUrl}/login`, { waitUntil: "networkidle" });
      await page.locator('button').filter({ hasText: /^Sign Up$/i }).last().click();
      await page.locator('input[placeholder="Your Name"]').fill(testUser.name);
      await page.locator('input[placeholder="you@example.com"]').fill(testUser.email);
      await page.locator('input[placeholder="********"]').fill(testUser.password);
      await page.locator('form button[type="submit"]').click();
      await page.waitForURL(/\/builder/, { timeout: 30000 });
      results.signup = true;
      results.builderReached = true;

      await page.waitForLoadState("networkidle");
      await page.waitForTimeout(3000);

      await fillOnboarding(page);
      await fillContact(page);
      await fillProfileQuestions(page);
      await testSummaryAI(page);
      await fillEducation(page);
      await fillExperience(page);
      await testSkillsAI(page);
      await fillProject(page);
      await completeFinalSteps(page);
      await page.waitForTimeout(5000);
      await downloadPdf(page);
    } catch (error) {
      addNote(`Failure URL: ${page.url()}`);
      addNote(`Failure text snapshot: ${(await page.locator("body").innerText()).slice(0, 2000)}`);
      await page.screenshot({ path: "artifacts/verify-builder-flow-failure.png", fullPage: true });
      throw error;
    }
  } finally {
    await browser.close();
  }

  process.stdout.write(`${JSON.stringify(results, null, 2)}\n`);
}

main().catch((error) => {
  console.error("Verification failed:", error);
  console.error(JSON.stringify(results, null, 2));
  process.exitCode = 1;
});

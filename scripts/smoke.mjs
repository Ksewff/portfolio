import { spawn } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const PORT = 9333;
const BASE = "http://localhost:3000";
const MARK = `E2E-${Date.now().toString(36)}`;
const profileDir = mkdtempSync(join(tmpdir(), "portfolio-e2e-"));
const chrome = spawn(
  CHROME,
  [
    "--headless=new",
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${profileDir}`,
    "--no-first-run",
    "--no-default-browser-check",
    "--disable-gpu",
    "--window-size=1440,1000",
    `${BASE}/admin/login`,
  ],
  { stdio: "ignore" },
);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const log = (message) => console.log(`✓ ${message}`);
const assert = (condition, message) => {
  if (!condition) throw new Error(`断言失败：${message}`);
};

async function waitForPage() {
  for (let i = 0; i < 60; i += 1) {
    try {
      const targets = await fetch(`http://127.0.0.1:${PORT}/json/list`).then((r) => r.json());
      const page = targets.find((item) => item.type === "page");
      if (page) return page;
    } catch {
      /* 等待 Chrome 启动 */
    }
    await sleep(250);
  }
  throw new Error("Chrome 未能启动");
}

const page = await waitForPage();
const socket = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((resolve, reject) => {
  socket.onopen = resolve;
  socket.onerror = () => reject(new Error("WebSocket 连接失败"));
});

let nextId = 0;
const pending = new Map();
const errors = [];
socket.onmessage = (event) => {
  const message = JSON.parse(event.data);
  if (message.id && pending.has(message.id)) {
    const { resolve, reject } = pending.get(message.id);
    pending.delete(message.id);
    if (message.error) reject(new Error(message.error.message));
    else resolve(message.result);
    return;
  }
  if (message.method === "Runtime.exceptionThrown") {
    errors.push(message.params.exceptionDetails.text);
  }
  if (message.method === "Runtime.consoleAPICalled" && message.params.type === "error") {
    errors.push(message.params.args.map((arg) => arg.value ?? arg.description).join(" "));
  }
};

function send(method, params = {}) {
  nextId += 1;
  const id = nextId;
  socket.send(JSON.stringify({ id, method, params }));
  return new Promise((resolve, reject) => pending.set(id, { resolve, reject }));
}

await send("Runtime.enable");
await send("Page.enable");

async function evaluate(expression) {
  const result = await send("Runtime.evaluate", {
    expression,
    returnByValue: true,
    awaitPromise: true,
  });
  if (result.exceptionDetails) {
    throw new Error(result.exceptionDetails.exception?.description ?? "页面脚本执行失败");
  }
  return result.result.value;
}

async function waitFor(expression, timeout = 10000) {
  const started = Date.now();
  while (Date.now() - started < timeout) {
    try {
      const value = await evaluate(expression);
      if (value) return value;
    } catch {
      /* 页面切换中 */
    }
    await sleep(150);
  }
  throw new Error(`等待超时：${expression}`);
}

async function goto(path, readyExpression) {
  await send("Page.navigate", { url: `${BASE}${path}` });
  await waitFor("document.readyState === 'complete'");
  await waitFor(readyExpression);
  await sleep(700);
}

async function setField(selector, value) {
  const ok = await evaluate(`(() => {
    const el = document.querySelector(${JSON.stringify(selector)});
    if (!el) return false;
    const proto = el instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
    Object.getOwnPropertyDescriptor(proto, "value").set.call(el, ${JSON.stringify(value)});
    el.dispatchEvent(new Event("input", { bubbles: true }));
    return true;
  })()`);
  assert(ok, `找不到输入框 ${selector}`);
}

async function click(selector) {
  const ok = await evaluate(`(() => {
    const el = document.querySelector(${JSON.stringify(selector)});
    if (!el) return false;
    el.click();
    return true;
  })()`);
  assert(ok, `找不到可点击元素 ${selector}`);
}

async function clickText(text) {
  const ok = await evaluate(`(() => {
    const el = [...document.querySelectorAll("button, a")].find((item) => item.textContent?.includes(${JSON.stringify(text)}));
    if (!el) return false;
    el.click();
    return true;
  })()`);
  assert(ok, `找不到按钮「${text}」`);
}

try {
  await goto("/admin/login", "Boolean(document.querySelector('#admin-username'))");
  await setField("#admin-username", "admin");
  await setField("#admin-password", "123456");
  await click('form button[type="submit"]');
  await waitFor("location.pathname === '/admin' && document.body.innerText.includes('概览')");
  log("登录成功并进入控制台");

  await goto("/admin/profile", "Boolean(document.querySelector('#profile-name'))");
  await setField("#profile-name", `林知远-${MARK}`);
  await click('form button[type="submit"]');
  await waitFor("document.body.innerText.includes('已保存到本地')");
  await goto("/admin/profile", "Boolean(document.querySelector('#profile-name'))");
  assert(
    (await evaluate("document.querySelector('#profile-name').value")).includes(MARK),
    "个人信息应持久化到 localStorage",
  );
  await goto("/", "Boolean(document.querySelector('#contact-name'))");
  assert((await evaluate("document.body.innerText")).includes(MARK), "首页应同步后台修改");
  log("个人信息保存、持久化与前台同步正常");

  const message = `自动化验收消息 ${MARK}`;
  await setField("#contact-name", "验收访客");
  await setField("#contact-email", "e2e@example.com");
  await setField("#contact-message", message);
  await click('form button[type="submit"]');
  await waitFor("document.body.innerText.includes('信号已接收')");
  await goto("/admin/messages", "document.body.innerText.includes('访客消息')");
  assert((await evaluate("document.body.innerText")).includes(message), "消息应出现在后台收件箱");
  await clickText("标记为已读");
  await waitFor("document.body.innerText.includes('标记为未读')");
  log("前台提交消息、后台查看并标记已读正常");

  const title = `自动化验收日志 ${MARK}`;
  await goto("/admin/blog", "document.body.innerText.includes('日志管理')");
  await clickText("新建日志");
  await waitFor("Boolean(document.querySelector('#post-title'))");
  await setField("#post-title", title);
  await setField("#post-excerpt", "这是一条用于验收日志编辑与发布流程的摘要内容。");
  await setField(
    "#post-content",
    "## 验收段落\n\n这是一段用于验证正文渲染的测试内容，长度需要超过三十个字符。",
  );
  await setField("#post-tags", "验收, 自动化");
  await evaluate('document.querySelector(\'input[type="checkbox"]\').click()');
  await click('form button[type="submit"]');
  await waitFor(`!document.querySelector('#post-title') && document.body.innerText.includes(${JSON.stringify(title)})`);
  const slug = await evaluate(`(() => {
    const data = JSON.parse(localStorage.getItem("portfolio.site-data.v1"));
    return data.posts.find((post) => post.title === ${JSON.stringify(title)})?.slug ?? "";
  })()`);
  assert(slug.length > 0, "新日志应写入 localStorage");
  const stored = await evaluate(`(() => {
    const data = JSON.parse(localStorage.getItem("portfolio.site-data.v1"));
    return data.posts.find((post) => post.title === ${JSON.stringify(title)}) ?? null;
  })()`);
  console.log("DEBUG stored post:", JSON.stringify({ slug, published: stored?.published, title: stored?.title }));
  assert(stored?.published === true, "新日志应处于已发布状态");
  await goto(`/blog/${slug}`, `document.body.innerText.includes(${JSON.stringify(title)})`);
  await goto("/blog", "document.body.innerText.includes('观测日志')");
  assert((await evaluate("document.body.innerText")).includes(title), "日志应出现在前台列表");
  log(`日志创建、发布与前台详情正常（/${slug}）`);

  await goto("/admin", "document.body.innerText.includes('恢复默认数据')");
  await evaluate("window.confirm = () => true");
  await clickText("恢复默认数据");
  await sleep(800);
  const restored = await evaluate('JSON.parse(localStorage.getItem("portfolio.site-data.v1"))');
  assert(!restored.posts.some((post) => post.title === title), "恢复默认后测试日志应被清除");
  assert(!restored.profile.name.includes(MARK), "恢复默认后测试资料应被清除");
  log("恢复默认数据正常清理测试内容");

  assert(errors.length === 0, `浏览器控制台错误：${errors.join(" | ")}`);
  log("浏览器控制台无运行时错误");
  console.log("E2E_SMOKE_PASS");
} finally {
  socket.close();
  chrome.kill();
  await sleep(500);
  try {
    rmSync(profileDir, { recursive: true, force: true });
  } catch {
    /* 临时目录可能被占用 */
  }
}

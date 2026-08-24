import { Builder, By, Key, error as seleniumError, until } from 'selenium-webdriver'
import chrome from 'selenium-webdriver/chrome.js'
import firefox from 'selenium-webdriver/firefox.js'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const argv = process.argv.slice(2)
const hasFlag = (name) => argv.includes(`--${name}`)
const flagValue = (name) => argv.find((a) => a.startsWith(`--${name}=`))?.split('=')[1]

export const BASE_URL = process.env.BASE_URL ?? 'http://localhost:5173'
export const BROWSER = process.env.BROWSER ?? 'chrome'
export const TIMEOUT = Number(process.env.TIMEOUT ?? 10000)

export const HEADLESS = (() => {
  if (hasFlag('headed')) return false
  if (hasFlag('headless')) return true
  if (process.env.HEADLESS) return process.env.HEADLESS === 'true'
  return false
})()

export const SLOWMO = (() => {
  const fromFlag = flagValue('slow')
  if (fromFlag) return Number(fromFlag)
  if (hasFlag('slow')) return 400
  return Number(process.env.SLOWMO ?? 0)
})()

const pause = () => (SLOWMO ? new Promise((r) => setTimeout(r, SLOWMO)) : Promise.resolve())

const MODAL_OVERLAY = By.css('[data-testid="modal-overlay"]')

async function highlight(driver, el) {
  if (!SLOWMO) return
  await driver.executeScript(
    `const el = arguments[0], prev = el.style.outline
     el.style.outline = '3px solid #f43f5e'
     setTimeout(() => { el.style.outline = prev }, ${Math.min(SLOWMO, 1500)})`,
    el
  )
}

export { By, Key, until }

export async function buildDriver() {
  const chromeOpts = new chrome.Options()
    .windowSize({ width: 1440, height: 900 })
    .addArguments(
      '--log-level=3',
      '--disable-gpu',
      '--disable-software-rasterizer',
      '--disable-features=UseChromeOSDirectVideoDecoder'
    )
    .excludeSwitches('enable-logging')
  const firefoxOpts = new firefox.Options().windowSize({ width: 1440, height: 900 })

  if (HEADLESS) {
    chromeOpts.addArguments('--headless=new', '--no-sandbox')
    firefoxOpts.addArguments('-headless')
  }

  const chromeService = new chrome.ServiceBuilder().addArguments('--silent')

  const driver = await new Builder()
    .forBrowser(BROWSER)
    .setChromeOptions(chromeOpts)
    .setChromeService(BROWSER === 'chrome' ? chromeService : undefined)
    .setFirefoxOptions(firefoxOpts)
    .build()

  await driver.manage().setTimeouts({ implicit: 0, pageLoad: 30000, script: 30000 })
  return driver
}

export async function goto(driver, route = '/') {
  await driver.get(new URL(route, BASE_URL).href)
}

export async function waitFor(driver, locator, timeout = TIMEOUT) {
  const el = await driver.wait(until.elementLocated(locator), timeout)
  await driver.wait(until.elementIsVisible(el), timeout)
  return el
}

export async function click(driver, locator, timeout = TIMEOUT) {
  const deadline = Date.now() + timeout
  let el = await waitFor(driver, locator, timeout)

  for (;;) {
    try {
      await driver.wait(until.elementIsEnabled(el), Math.max(deadline - Date.now(), 1))
      await driver.executeScript('arguments[0].scrollIntoView({ block: "center" })', el)
      await highlight(driver, el)
      await pause()
      await el.click()
      return el
    } catch (error) {
      const retriable =
        error instanceof seleniumError.ElementClickInterceptedError ||
        error instanceof seleniumError.ElementNotInteractableError ||
        error instanceof seleniumError.StaleElementReferenceError
      if (!retriable || Date.now() >= deadline) throw error
      await new Promise((r) => setTimeout(r, 100))
      el = await waitFor(driver, locator, Math.max(deadline - Date.now(), 1))
    }
  }
}

export async function waitForModalClosed(driver, timeout = TIMEOUT) {
  await driver.wait(
    async () => (await driver.findElements(MODAL_OVERLAY)).length === 0,
    timeout,
    'El modal sigue abierto: su overlay intercepta los clicks'
  )
}

export async function waitForGone(driver, locator, timeout = TIMEOUT) {
  await driver.wait(
    async () => {
      const found = await driver.findElements(locator)
      if (found.length === 0) return true
      return !(await found[0].isDisplayed().catch(() => false))
    },
    timeout,
    `El elemento sigue presente: ${locator}`
  )
}

export async function type(driver, locator, text, timeout = TIMEOUT) {
  const el = await waitFor(driver, locator, timeout)
  await highlight(driver, el)
  await el.clear()
  await el.sendKeys(text)
  await pause()
  return el
}

export async function waitForText(driver, text, timeout = TIMEOUT) {
  return waitFor(
    driver,
    By.xpath(`//*[contains(normalize-space(.), ${xpathLiteral(text)})]`),
    timeout
  )
}

export async function waitForUrl(driver, fragment, timeout = TIMEOUT) {
  await driver.wait(until.urlContains(fragment), timeout)
}

export async function screenshot(driver, name) {
  const dir = path.join(__dirname, 'screenshots')
  await fs.mkdir(dir, { recursive: true })
  const file = path.join(dir, `${name}-${Date.now()}.png`)
  await fs.writeFile(file, await driver.takeScreenshot(), 'base64')
  console.log(`  📸 ${file}`)
  return file
}

export async function step(driver, name, fn) {
  const started = Date.now()
  process.stdout.write(`▶ ${name} ... `)
  try {
    const result = await fn()
    console.log(`ok (${Date.now() - started}ms)`)
    await pause()
    return result
  } catch (error) {
    console.log('FALLÓ')
    await screenshot(driver, `fail-${name.replace(/\W+/g, '-').toLowerCase()}`)
    throw error
  }
}

function xpathLiteral(value) {
  if (!value.includes("'")) return `'${value}'`
  return `concat('${value.split("'").join(`', "'", '`)}')`
}

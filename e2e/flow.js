/**
 * Base de flujo Selenium para CAIS.
 *
 * Requisitos: la app corriendo (`pnpm dev` en la raíz) y Chrome instalado.
 * Ejecutar:   cd e2e && node flow.js            (abre el navegador y lo ves correr)
 *             cd e2e && node flow.js --slow     (pausa 400ms entre acciones)
 *             cd e2e && node flow.js --headless (sin ventana, para CI)
 * Flags:      --headed | --headless | --slow[=ms]
 * Variables:  BASE_URL, BROWSER (chrome|firefox), HEADLESS, SLOWMO (ms), TIMEOUT (ms)
 *
 * Llena `flow()` con los pasos que quieras probar.
 */
// Todos los helpers quedan importados aunque aún no los uses; el flujo los irá ocupando.
/* eslint-disable no-unused-vars */
import {
  BASE_URL,
  BROWSER,
  By,
  HEADLESS,
  SLOWMO,
  Key,
  buildDriver,
  click,
  goto,
  screenshot,
  step,
  type,
  until,
  waitFor,
  waitForGone,
  waitForModalClosed,
  waitForText,
  waitForUrl,
} from './helpers.js'
/* eslint-enable no-unused-vars */

const USER = {
  email: process.env.E2E_EMAIL ?? 'sofia.navarro',
  password: process.env.E2E_PASSWORD ?? '123',
}

/** Login reutilizable. Ajusta los selectores a lo que renderiza Auth.jsx. */
async function login(driver, { email, password } = USER) {
  await step(driver, 'login', async () => {
    await goto(driver, '/')
    await type(driver, By.css('input[name="email"]'), email)
    await type(driver, By.css('input[name="password"]'), password)
    await click(driver, By.css('button[type="submit"]'))
    await waitForUrl(driver, '/dashboard')
  })
}

async function evolutionNoteFlow(driver, times) {
  await login(driver)

  await step(driver, 'abrir paciente de ejemplo', async () => {
    await goto(driver, '/pacientes/e13a2f3a-7187-4670-bf04-deffabc3c869?tab=notas')
  })

  await step(driver, 'crear notas de evolución', async () => {
    console.log()

    for (let i = 0; i < times; i++) {
      await click(driver, By.css('[data-testid="create-note-btn"]'))
      await click(driver, By.css('[data-testid="modal-primary-btn"]'))
      await click(driver, By.css('[data-testid="modal-primary-btn"]'))
      await click(driver, By.css('[data-testid="modal-primary-btn"]'))
      await click(driver, By.css('[data-testid="modal-primary-btn"]'))
      // El modal tarda en cerrarse (espera a la mutación); si no esperamos, su
      // overlay intercepta el click de la siguiente vuelta.
      await waitForModalClosed(driver)
      console.log(`Nota #${i}`)
    }
  })
}

async function emergencyNoteFlow(driver, times) {
  await login(driver)

  await step(driver, 'abrir la página de emergencias', async () => {
    await goto(driver, '/emergencias')
  })

  await step(driver, 'crear emergencias', async () => {
    console.log()

    for (let i = 0; i < times; i++) {
      await click(driver, By.css('[data-testid="add-emergency-btn"]'))
      await type(driver, By.id('ubicacion'), 'Ubicacion')
      await click(driver, By.css('[data-testid="modal-primary-btn"]'))
      // Idem: esperamos a que el overlay se vaya antes de reabrir el modal.
      await waitForModalClosed(driver)
      console.log(`Emergencia #${i}`)
    }
  })
}

async function main() {
  const mode = HEADLESS ? 'headless' : 'con ventana'
  const slow = SLOWMO ? `, slowmo ${SLOWMO}ms` : ''
  console.log(`CAIS e2e → ${BASE_URL} (${BROWSER}, ${mode}${slow})\n`)
  const driver = await buildDriver()
  try {
    await evolutionNoteFlow(driver, 1000)
    await emergencyNoteFlow(driver, 1000)
    console.log('\nFlujo completado')
  } catch (error) {
    console.error(`\nFlujo fallido: ${error.message}`)
    process.exitCode = 1
  } finally {
    await driver.quit()
  }
}

main()

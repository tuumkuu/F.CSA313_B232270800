import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright конфигурацийн тохиргоо
 * Лаборатори №1: UI автомат тест - Playwright
 * Оюутан: Н. Төрболд (B232270800)
 * Хичээл: F.CSA313 — Программ хангамжийн чанарын баталгаа ба тест
 */
export default defineConfig({
  testDir: './tests',
  /* Тестүүдийг зэрэгцээ горимоор ажиллуулах */
  fullyParallel: true,
  /* CI орчинд санамсаргүй test.only үлдээсэн эсэхийг шалгах */
  forbidOnly: !!process.env.CI,
  /* Амжилтгүй болсон тестийг дахин ажиллуулах тоо */
  retries: process.env.CI ? 2 : 0,
  /* CI орчинд 1 worker ашиглах */
  workers: process.env.CI ? 1 : undefined,
  /* Тестийн тайланг HTML хэлбэрээр үүсгэх */
  reporter: 'html',
  /* Бүх төсөлд ашиглах үндсэн тохиргоо */
  use: {
    /* Системийн үндсэн хаяг */
    baseURL: 'https://www.saucedemo.com',
    /* Эхний алдаа гарсан үед trace файл хадгалах */
    trace: 'on-first-retry',
    /* Тест ажиллах явцын видео бичлэг хийх */
    video: 'on',
    /* Алдаа гарсан үед скриншот хадгалах */
    screenshot: 'only-on-failure',
  },

  /* Үндсэн browser-уудын тохиргоо */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});

import { test, expect } from '@playwright/test';

/**
 * Лабораторийн ажил №1: UI автомат тест (Playwright)
 * Оюутан: Н. Төрболд (B232270800)
 * Веб сайт: SauceDemo (https://www.saucedemo.com)
 */

test.describe('SauceDemo UI автоматжуулсан тестүүд', () => {

  // Тест 1: Зөв хэрэглэгчийн мэдээллээр амжилттай нэвтрэх болон гарах үйлдлийг шалгах
  test('1. Амжилттай нэвтрэх болон системийн үндсэн элементийн шалгалт', async ({ page }) => {
    // 1. SauceDemo веб сайт руу зочлох
    await page.goto('https://www.saucedemo.com');

    // Хуудасны гарчиг зөв эсэхийг баталгаажуулах
    await expect(page).toHaveTitle(/Swag Labs/i);

    // 2. Хэрэглэгчийн нэр болон нууц үгийн талбарт утга оруулах
    await page.getByPlaceholder('Username').fill('standard_user');
    await page.getByPlaceholder('Password').fill('secret_sauce');

    // 3. 'Login' товч дээр дарах
    await page.getByRole('button', { name: 'Login' }).click();

    // 4. Нэвтэрсний дараах хуудасны URL зөв шилжсэн эсэхийг шалгах
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');

    // 5. 'Products' гарчиг болон системийн лого текст харагдаж байгааг шалгах
    await expect(page.getByText('Products')).toBeVisible();
    const logoLocator = page.locator('.app_logo');
    await expect(logoLocator).toHaveText('Swag Labs');

    // 6. Хажуугийн цэсийг нээж Logout хийж аюулгүй гарах
    await page.getByRole('button', { name: 'Open Menu' }).click();
    await page.locator('#logout_sidebar_link').click();

    // 7. Буцаад Login хуудас руу шилжсэн эсэхийг шалгах
    await expect(page).toHaveURL('https://www.saucedemo.com/');
    await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
  });

  // Тест 2: Буруу нууц үгээр нэвтрэх үед анхааруулга алдааны мессеж гарахыг шалгах
  test('2. Буруу нууц үгээр нэвтрэх оролдлогын алдааны мэдэгдэл шалгах', async ({ page }) => {
    // 1. SauceDemo веб сайт руу зочлох
    await page.goto('https://www.saucedemo.com');

    // 2. Хэрэглэгчийн нэр зөв, гэвч нууц үгийг зориуд буруу оруулах
    await page.getByPlaceholder('Username').fill('standard_user');
    await page.getByPlaceholder('Password').fill('invalid_secret_pass');

    // 3. 'Login' товч дээр дарах
    await page.getByRole('button', { name: 'Login' }).click();

    // 4. Алдааны анхааруулга харагдаж байгааг болон текст нь тохирч байгааг шалгах
    const errorContainer = page.locator('[data-test="error"]');
    await expect(errorContainer).toBeVisible();
    await expect(errorContainer).toContainText('Username and password do not match any user in this service');

    // 5. Нэвтрэх боломжгүй тул хуудасны URL өөрчлөгдөөгүй үлдсэн эсэхийг шалгах
    await expect(page).toHaveURL('https://www.saucedemo.com/');

    // 6. Алдаа гарсан input талбар error CSS class-тай болсныг шалгах
    const passwordInput = page.getByPlaceholder('Password');
    await expect(passwordInput).toHaveClass(/error/);
  });

  // Тест 3: Нэвтэрсний дараа сагсанд бараа нэмэх болон Checkout алхам шалгах
  test('3. Бараа сагсанд нэмэх, сагс шалгах болон Checkout алхам руу шилжих', async ({ page }) => {
    // 1. Системд амжилттай нэвтрэх
    await page.goto('https://www.saucedemo.com');
    await page.getByPlaceholder('Username').fill('standard_user');
    await page.getByPlaceholder('Password').fill('secret_sauce');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');

    // 2. 'Sauce Labs Backpack' барааг сагсанд нэмэх
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();

    // 3. Сагсан дээрх тэмдэглэгээ '1' болж шинэчлэгдсэнийг шалгах
    const cartBadge = page.locator('.shopping_cart_badge');
    await expect(cartBadge).toHaveText('1');

    // 4. Сагсны хуудас руу шилжих
    await page.locator('[data-test="shopping-cart-link"]').click();
    await expect(page).toHaveURL('https://www.saucedemo.com/cart.html');

    // 5. Сагсанд нэмсэн барааны нэр зөв харагдаж байгааг шалгах
    await expect(page.locator('.inventory_item_name')).toHaveText('Sauce Labs Backpack');

    // 6. Checkout товчийг дарж захиалгын алхам руу шилжих
    const checkoutBtn = page.getByRole('button', { name: 'Checkout' });
    await expect(checkoutBtn).toBeVisible();
    await checkoutBtn.click();
    await expect(page).toHaveURL('https://www.saucedemo.com/checkout-step-one.html');

    // 7. Захиалгыг цуцалж буцах (Cancel үйлдэл)
    await page.locator('[data-test="cancel"]').click();
    await expect(page).toHaveURL('https://www.saucedemo.com/cart.html');

    // 8. Дэлгүүрийн хуудас руу буцах (Continue Shopping)
    await page.getByRole('button', { name: 'Continue Shopping' }).click();
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');

    // 9. Logout хийж тестийг төгсгөх
    await page.getByRole('button', { name: 'Open Menu' }).click();
    await page.locator('#logout_sidebar_link').click();
    await expect(page).toHaveURL('https://www.saucedemo.com/');
  });

  // Тест 4: Playwright Codegen ашиглан бичүүлсэн болон сайжруулсан тест
  test('4. Codegen хэрэгслээр бичүүлж, цэгцэлсэн худалдан авалтын урсгал', async ({ page }) => {
    // Codegen нь бидний хийсэн үйлдэл бүрийг бичиж авдаг.
    // Энд шаардлагагүй илүүдэл click-үүдийг цэвэрлэж, тодорхой assertion-ууд нэмсэн болно.
    await page.goto('https://www.saucedemo.com/');

    // Нэвтрэх хэсэг
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    await expect(page).toHaveURL(/.*inventory.html/);

    // Бараа нэмэх болон сагс руу шилжих
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="shopping-cart-link"]').click();
    await expect(page).toHaveURL(/.*cart.html/);

    // Захиалгын мэдээлэл оруулах хуудас руу орох
    await page.locator('[data-test="checkout"]').click();
    await expect(page).toHaveURL(/.*checkout-step-one.html/);

    // Захиалагчийн мэдээлэл бөглөх
    await page.locator('[data-test="firstName"]').fill('Torbold');
    await page.locator('[data-test="lastName"]').fill('N');
    await page.locator('[data-test="postalCode"]').fill('14200');

    // Мэдээлэл баталгаажуулах алхам руу очих
    await page.locator('[data-test="continue"]').click();
    await expect(page).toHaveURL(/.*checkout-step-two.html/);

    // Цуцлаад буцах
    await page.locator('[data-test="cancel"]').click();
    await expect(page).toHaveURL(/.*inventory.html/);

    // Logout хийж аюулгүй гарах
    await page.getByRole('button', { name: 'Open Menu' }).click();
    await page.locator('[data-test="logout-sidebar-link"]').click();
    await expect(page).toHaveURL('https://www.saucedemo.com/');
  });

});
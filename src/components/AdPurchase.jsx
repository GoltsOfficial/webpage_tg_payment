import React, { useEffect, useCallback } from 'react'; // Import useCallback
import './AdPurchase.css';

const AdPurchase = () => {
  // Use useCallback to memoize the close function and prevent unnecessary effect re-runs
  const handleClose = useCallback(() => {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.close();
    }
  }, []); // Dependency array is empty as handleClose does not depend on any state or props

  useEffect(() => {
  if (window.Telegram?.WebApp) {
    const tg = window.Telegram.WebApp;
    tg.ready(); // Важно: сообщаем Telegram, что приложение готово
    tg.expand(); // Раскрываем на весь экран
    tg.enableClosingConfirmation();
    
    // Настройка цветов для лучшей интеграции
    tg.setHeaderColor('#2A2A2A');
    tg.setBackgroundColor('#E6E6E6');

    tg.BackButton.show();
    tg.BackButton.onClick(() => {
      tg.close();
    });
  }
}, []); // Effect depends on the stable handleClose function

  const handleBuy = (months, price) => {
  // Анимация нажатия (опционально)
  const button = event.target;
  button.classList.add('button-clicked');
  setTimeout(() => button.classList.remove('button-clicked'), 200);

  // Проверяем, что мы в Telegram Mini App
  if (window.Telegram?.WebApp) {
    const tg = window.Telegram.WebApp;

    // Создаем инвойс для платежа
    const invoice = {
      title: `Рекламная подписка на ${months} месяц(ев)`,
      description: `Размещение рекламного поста в канале на ${months} месяцев`,
      currency: 'RUB', // Валюта платежа
      prices: [{ label: 'Подписка', amount: price * 100 }], // Сумма в копейках
      payload: JSON.stringify({ // Данные для вашего бота
        action: 'buy_subscription',
        months: months,
        price: price,
        user_id: tg.initDataUnsafe?.user?.id,
        username: tg.initDataUnsafe?.user?.username
      })
    };

    // Открываем нативный интерфейс оплаты Telegram
    tg.openInvoice(invoice, (status) => {
      // Обрабатываем результат платежа
      if (status === 'paid') {
        // Платеж успешен
        console.log('Платеж прошел успешно!');
        tg.showAlert('Спасибо за покупку! Ваша реклама скоро будет активирована.', () => {
          tg.close(); // Закрываем мини-приложение
        });
      } else if (status === 'failed') {
        // Платеж не прошел
        tg.showAlert('Извините, оплата не прошла. Пожалуйста, попробуйте еще раз.');
      } else if (status === 'cancelled') {
        // Пользователь отменил платеж
        console.log('Пользователь отменил платеж');
      }
    });

  } else {
    // Режим разработки (вне Telegram)
    console.log(`Покупка: ${months} мес за ${price} руб`);
    alert(`✅ Вы выбрали подписку на ${months} мес за ${price} руб.\n\nВ Telegram Mini App будет запущен процесс оплаты.`);
  }
};

  // Your JSX remains largely the same, it's correctly structured for the UI
  return (
    <div className="ad-purchase-container">
      {/* ... (your existing JSX for header, hero section, buttons, etc.) ... */}
      <div className="header"></div>
      <div className="hero-section">
        <div className="dashboard-background"></div>
        <svg
          className="decorative-background"
          // ... (your existing SVG paths) ...
        >
          {/* ... (keep your existing SVG content) ... */}
        </svg>
        <h1 className="main-title">Покупка рекламы</h1>
        <div className="subscription-options">
          <div className="subscription-item">
            <div className="subscription-label">
              <span className="subscription-text">Подписка на 1 месяц</span>
            </div>
            <button
              className="price-button"
              onClick={() => handleBuy(1, 250)}
            >
              <span className="price-text">Купить за 250 руб.</span>
            </button>
          </div>
          <div className="subscription-item">
            <div className="subscription-label">
              <span className="subscription-text">Подписка на 3 месяца</span>
            </div>
            <button
              className="price-button"
              onClick={() => handleBuy(3, 500)}
            >
              <span className="price-text">Купить за 500 руб.</span>
            </button>
          </div>
          <div className="subscription-item">
            <div className="subscription-label">
              <span className="subscription-text">Подписка на 6 месяцев</span>
            </div>
            <button
              className="price-button"
              onClick={() => handleBuy(6, 750)}
            >
              <span className="price-text">Купить за 750 руб.</span>
            </button>
          </div>
        </div>
      </div>
      <div className="footer"></div>
    </div>
  );
};

export default AdPurchase;

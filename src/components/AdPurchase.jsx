import React, { useEffect } from 'react';
import './AdPurchase.css';

const AdPurchase = () => {
  useEffect(() => {
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      
      // Базовая инициализация
      tg.ready();
      tg.expand();
      
      // Простая настройка цветов
      tg.setHeaderColor('#2A2A2A');
      tg.setBackgroundColor('#FFFFFF');
      
      // Кнопка назад
      tg.BackButton.show();
      tg.BackButton.onClick(() => {
        tg.close();
      });

      console.log('Telegram Web App инициализирован');
    }
  }, []);

  const handleBuy = async (months, price) => {
  // Анимация нажатия
  const button = event?.target;
  if (button) {
    button.classList.add('button-clicked');
    setTimeout(() => button.classList.remove('button-clicked'), 200);
  }

  // Проверяем, находимся ли мы в Telegram Mini App
  if (window.Telegram?.WebApp) {
    const tg = window.Telegram.WebApp;
    
    // Отправляем данные в бота
    const data = {
      action: 'buy_subscription',
      months: months,
      price: price,
      user_id: tg.initDataUnsafe?.user?.id,
      username: tg.initDataUnsafe?.user?.username,
      timestamp: Date.now()
    };
    
    // Отправляем данные в бота
    tg.sendData(JSON.stringify(data));
    
    // Закрываем Mini App после отправки
    setTimeout(() => {
      tg.close();
    }, 500);
    
  } else {
    // Режим разработки
    console.log(`Покупка: ${months} мес за ${price} руб`);
    alert(`✅ Вы выбрали подписку на ${months} мес за ${price} руб.`);
  }
};

  return (
    <div className="ad-purchase-container">
      {/* Простой заголовок */}
      <div className="header">
        <div className="header-content">Реклама</div>
      </div>

      {/* Основной контент */}
      <div className="main-content">
        <h1 className="main-title">Покупка рекламы</h1>
        
        <div className="subscription-options">
          <div className="subscription-card">
            <div className="subscription-info">
              <span className="subscription-text">1 месяц</span>
            </div>
            <button
              className="price-button"
              onClick={(e) => handleBuy(1, 250, e)}
            >
              <span className="price-text">250 руб.</span>
            </button>
          </div>

          <div className="subscription-card">
            <div className="subscription-info">
              <span className="subscription-text">3 месяца</span>
            </div>
            <button
              className="price-button"
              onClick={(e) => handleBuy(3, 500, e)}
            >
              <span className="price-text">500 руб.</span>
            </button>
          </div>

          <div className="subscription-card">
            <div className="subscription-info">
              <span className="subscription-text">6 месяцев</span>
            </div>
            <button
              className="price-button"
              onClick={(e) => handleBuy(6, 750, e)}
            >
              <span className="price-text">750 руб.</span>
            </button>
          </div>
        </div>
      </div>

      {/* Простой футер */}
      <div className="footer">
        <div className="footer-content">Telegram Mini App</div>
      </div>
    </div>
  );
};

export default AdPurchase;

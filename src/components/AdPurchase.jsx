import React, { useEffect, useCallback } from 'react';
import './AdPurchase.css';

const AdPurchase = () => {
  const handleClose = useCallback(() => {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.close();
    }
  }, []);

  useEffect(() => {
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      
      // Полная инициализация Telegram Web App
      tg.ready();
      tg.expand(); // Раскрываем на весь экран
      tg.enableClosingConfirmation();
      
      // Устанавливаем цвета для полной интеграции
      tg.setHeaderColor('#2A2A2A');
      tg.setBackgroundColor('#E6E6E6');

      // Настраиваем кнопку назад
      tg.BackButton.show();
      tg.BackButton.onClick(handleClose);

      // Обработчик изменений viewport для адаптации
      tg.onEvent('viewportChanged', () => {
        if (!tg.isExpanded) {
          tg.expand();
        }
      });

      return () => {
        tg.offEvent('viewportChanged', () => {});
        tg.BackButton.offClick(handleClose);
      };
    }
  }, [handleClose]);

  const handleBuy = useCallback((months, price, event) => {
    // Анимация нажатия кнопки
    if (event && event.target) {
      const button = event.target;
      button.classList.add('button-clicked');
      setTimeout(() => button.classList.remove('button-clicked'), 200);
    }

    // Проверяем, что мы в Telegram Mini App
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;

      // Создаем инвойс для платежа
      const invoice = {
        title: `Рекламная подписка на ${months} ${months === 1 ? 'месяц' : 'месяца'}`,
        description: `Размещение рекламного поста в канале на ${months} ${months === 1 ? 'месяц' : 'месяцев'}`,
        currency: 'RUB',
        prices: [{ label: 'Рекламная подписка', amount: price * 100 }], // Сумма в копейках
        payload: JSON.stringify({
          action: 'buy_subscription',
          months: months,
          price: price,
          user_id: tg.initDataUnsafe?.user?.id,
          username: tg.initDataUnsafe?.user?.username,
          timestamp: Date.now()
        })
      };

      console.log('Открываем инвойс:', invoice);

      // Открываем нативный интерфейс оплаты Telegram
      try {
        tg.openInvoice(invoice, (status) => {
          console.log('Статус платежа:', status);
          
          switch (status) {
            case 'paid':
              tg.showAlert('✅ Спасибо за покупку! Ваша реклама активирована.', () => {
                // Дополнительные действия после успешной оплаты
                setTimeout(() => tg.close(), 1000);
              });
              break;
              
            case 'failed':
              tg.showAlert('❌ Оплата не прошла. Пожалуйста, попробуйте еще раз.');
              break;
              
            case 'cancelled':
              console.log('Пользователь отменил платеж');
              break;
              
            default:
              console.log('Неизвестный статус платежа:', status);
          }
        });
      } catch (error) {
        console.error('Ошибка при открытии инвойса:', error);
        tg.showAlert('⚠️ Произошла ошибка при обработке платежа. Попробуйте позже.');
      }

    } else {
      // Режим разработки (вне Telegram)
      console.log(`Покупка: ${months} мес за ${price} руб`);
      alert(`✅ Вы выбрали подписку на ${months} мес за ${price} руб.\n\nВ Telegram Mini App будет запущен процесс оплаты.`);
    }
  }, []);

  return (
    <div className="ad-purchase-container">
      <div className="header"></div>

      <div className="hero-section">
        <div className="dashboard-background"></div>

        {/* Декоративный SVG фон */}
        <svg
          className="decorative-background"
          width="100%"
          height="100%"
          viewBox="0 0 310 500"
          preserveAspectRatio="xMidYMid meet"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M22.4026 344.234C22.4026 342.207 22.4026 337.446 22.6329 331.308C22.7254 328.843 23.324 327.873 24.5595 327.351C25.7951 326.829 27.7915 326.829 29.2039 328.35C34.6932 334.258 32.0217 350.695 31.3283 354.954C30.6282 359.254 28.1498 359.93 26.4489 360.441C25.5211 360.721 24.4409 360.615 24.0406 359.94C23.6404 359.264 23.9476 357.913 24.7969 357.723C29.5776 356.657 31.7052 365.038 32.4801 368.1C33.3372 371.486 32.3382 379.669 30.8676 388.709C30.1649 392.006 29.5506 392.682 28.3895 393.03C27.2284 393.378 25.5391 393.378 24.7294 390.306"
            stroke="black"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M37.2943 355.496C37.2943 354.821 37.2943 353.121 37.6783 351.073C37.868 350.062 38.83 350.377 39.3792 351.391C40.6247 353.69 40.5519 361.926 40.168 370.454C39.9634 374.998 37.1501 375.287 36.3659 375.799C34.4661 377.039 41.1615 377.324 43.0207 379.879C43.8315 380.993 44.2655 382.095 44.4261 383.8C44.5866 385.505 44.4331 387.87 44.0468 389.426C43.6606 390.982 43.0463 391.658 42.1923 392.006C41.3384 392.354 40.2634 392.354 39.7864 391.51C39.3094 390.665 39.4629 388.976 39.6212 387.235"
            stroke="black"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M27.5216 453.784C29.3738 454.46 32.4731 457.183 44.9985 464.677C47.9432 466.439 49.366 466.07 50.2316 465.225C51.0971 464.38 51.4043 462.691 51.5625 461.145C51.7207 459.599 51.7207 458.248 51.7207 456.855"
            stroke="black"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M40.0865 422.045C39.933 423.397 39.7794 424.748 39.7003 427.134C39.6212 429.519 39.6212 432.898 40.0051 434.469C40.389 436.041 41.1569 435.703 41.948 435.355"
            stroke="black"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M46.1363 426.14C45.9828 426.478 45.8292 426.816 45.5965 428.342C45.3638 429.867 45.0567 432.57 44.8984 434.807C44.7402 437.044 44.7402 438.734 45.671 440.474"
            stroke="black"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M45.671 417.95C45.9781 417.95 47.2113 418.626 48.9937 421.339C50.0082 426.755 50.3246 432.601 50.0175 436.353C49.7104 437.74 49.0961 438.078 48.4632 438.426"
            stroke="black"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M43.8095 416.926C43.8095 415.237 43.8095 413.547 43.4256 412.339C42.6032 409.751 39.7934 410.097 36.8499 411.116C34.7125 411.856 33.4225 415.206 32.3382 418.098C31.8681 419.639 31.561 421.329 31.7099 424.057C31.8588 426.786 32.4731 430.502 33.5714 436.379"
            stroke="black"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M14.9566 39.1336C15.2638 38.4579 20.0292 33.0419 31.2329 22.6603C37.707 16.6613 46.2759 11.9408 53.3914 8.14235C60.5069 4.34395 66.0355 2.31677 75.4103 1.61032C84.7851 0.903885 97.8387 1.57961 105.869 2.43451C116.531 3.56963 120.428 6.36089 122.52 8.74129C124.224 10.6809 124.318 22.9981 124.165 39.6967C123.948 63.2515 119.827 79.37 116.053 91.5843C113.233 100.712 107.826 114.61 102.064 127.664C96.303 140.718 90.1601 152.205 78.8563 166.907C67.5526 181.609 51.274 199.178 36.6684 211.777C22.0628 224.375 9.62356 231.47 3.90651 232.422C-1.81054 233.374 -0.428411 227.968 2.81753 218.595C6.06347 209.222 11.1313 196.045 21.3438 180.473C31.5563 164.901 46.7599 147.332 67.3385 137.605C87.9171 127.879 113.41 126.528 128.539 126.169C143.668 125.811 147.661 126.487 151.791 127.679C155.921 128.872 160.068 130.561 167.963 135.486C175.858 140.411 187.376 148.519 194.998 155.062C206.304 164.765 210.555 173.91 212.722 181.046C215.636 190.647 216.149 200.868 215.614 215.78C215.186 227.71 213.39 248.261 210.295 268.338C207.2 288.415 202.593 307.335 199.529 319.278C196.464 331.221 195.082 335.614 190.07 346.661C185.058 357.708 176.458 375.277 168.188 389.226C159.919 403.176 152.24 412.974 145.367 420.049C138.493 427.123 132.658 431.178 126.042 434.111C119.427 437.044 112.209 438.734 105.727 439.604C93.7313 441.214 85.1016 439.46 80.4502 435.56C78.4186 433.856 78.256 427.942 78.249 424.661C78.2202 411.1 88.4708 402.951 96.7846 397.857C103.627 393.665 116.156 389.385 130.089 388.633C144.022 387.88 159.072 391.597 170.127 395.538C181.181 399.48 187.785 403.534 193.337 407.988C203.389 416.052 208.848 424.748 211.323 431.715C214.513 440.692 214.297 454.06 212.519 465.138C211.179 473.49 205.176 480.014 196.748 488.87C192.275 493.571 186.938 496.375 181.638 498.285C176.337 500.194 171.116 500.532 163.051 499.185C154.986 497.839 144.236 494.798 136.702 490.36C124.703 483.292 120.293 471.557 118.822 464.084C117.917 459.481 117.505 452.555 117.88 445.189C118.254 437.822 119.637 430.051 124.956 419.291C130.275 408.531 139.489 395.016 163.048 383.155C186.608 371.294 224.233 361.496 251.371 358.476C278.509 355.455 294.019 359.51 310 363.687"
            stroke="black"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M154.567 7.39493C155.181 7.39493 160.259 6.04348 171.311 3.3201C185.249 -0.114264 192.271 -0.457823 190.491 0.391947C180.888 4.97643 168.686 28.1991 168.682 30.7536C168.675 34.2412 178.38 34.0145 188.399 35.3659C190.258 35.6167 185.435 43.5565 186.128 46.2799C186.531 47.863 187.59 49.0033 187.68 51.051C188.243 63.7549 176.784 71.507 173.345 76.319C172.787 77.0999 172.567 78.6943 172.716 80.0662C172.865 81.4382 173.48 82.7896 174.334 83.8237C176.263 85.5335 181.363 86.2296 192.481 84.7093C199.605 83.1889 209.741 80.1481 220.184 77.0152"
            stroke="black"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>

        <h1 className="main-title">Покупка рекламы</h1>

        <div className="subscription-options">
          <div className="subscription-item">
            <div className="subscription-label">
              <span className="subscription-text">Подписка на 1 месяц</span>
            </div>
            <button
              className="price-button"
              onClick={(e) => handleBuy(1, 250, e)}
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
              onClick={(e) => handleBuy(3, 500, e)}
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
              onClick={(e) => handleBuy(6, 750, e)}
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

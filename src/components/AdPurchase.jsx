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
      
      // Initialize the app
      tg.ready(); // Inform Telegram the app is ready:cite[1]
      tg.expand(); // Request to expand the app to full height:cite[5]
      tg.enableClosingConfirmation(); // Enable confirmation on close attempt
      
      // Show and set up the BackButton
      tg.BackButton.show();
      tg.BackButton.onClick(handleClose); // Use the memoized function

      // Optional: Set colors to better blend with Telegram
      tg.setHeaderColor('#2A2A2A'); // Match your header color
      tg.setBackgroundColor('#E6E6E6'); // Match your background color

      // Cleanup function to remove event listeners
      return () => {
        tg.BackButton.offClick(handleClose); // Clean up the BackButton click handler:cite[10]
        // Note: 'viewportChanged' event is managed internally by Telegram, but if you added custom logic, consider if it needs cleanup.
      };
    }
  }, [handleClose]); // Effect depends on the stable handleClose function

  const handleBuy = useCallback((months, price) => {
    // Get the button element and add click animation
    const button = event?.target;
    if (button) {
      button.classList.add('button-clicked');
      setTimeout(() => button.classList.remove('button-clicked'), 200);
    }

    // Process payment via Telegram Web App
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;

      // Create an invoice for the payment system:cite[5]
      const invoice = {
        title: `Рекламная подписка на ${months} месяц(ев)`,
        description: `Размещение рекламного поста в канале на ${months} месяцев`,
        currency: 'RUB',
        prices: [{ label: 'Подписка', amount: price * 100 }], // Amount in kopeks
        payload: JSON.stringify({
          action: 'buy_subscription',
          months: months,
          price: price,
          user_id: tg.initDataUnsafe?.user?.id,
          username: tg.initDataUnsafe?.user?.username
        })
      };

      // Open the native Telegram payment interface:cite[5]
      tg.openInvoice(invoice, (status) => {
        if (status === 'paid') {
          // Payment was successful
          console.log('Payment successful!');
          // You can send data to your bot here if needed, or let your bot handle the pre-checkout query
          tg.showAlert('Спасибо за покупку! Ваша реклама скоро будет активирована.', () => {
            tg.close(); // Close the Mini App after user acknowledgment
          });
        } else if (status === 'failed') {
          tg.showAlert('Извините, оплата не прошла. Пожалуйста, попробуйте еще раз.');
        } else if (status === 'cancelled') {
          // User closed the invoice without paying
          console.log('Payment was cancelled by the user.');
        }
      });

    } else {
      // Development mode fallback
      console.log(`Покупка: ${months} мес за ${price} руб`);
      alert(`✅ Вы выбрали подписку на ${months} мес за ${price} руб.\n\nВ Telegram Mini App будет запущен процесс оплаты.`);
    }
  }, []); // handleBuy uses useCallback and has no dependencies

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

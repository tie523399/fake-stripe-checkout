import React, { useState } from 'react';
import visa from './assets/visa.svg';
import amex from './assets/amex.svg';
import jcb from './assets/jcb.svg';
import msc from './assets/msc.svg';
import up from './assets/up.svg';
import './index.css'; // 引入整合 CSS

const detectCardType = (number) => {
  const n = number.replace(/\s/g, '');
  if (/^4/.test(n)) return visa;
  if (/^5[1-5]/.test(n)) return msc;
  if (/^3[47]/.test(n)) return amex;
  if (/^35/.test(n)) return jcb;
  if (/^62/.test(n)) return up;
  return null;
};

const luhnCheck = (cardNumber) => {
  const digits = cardNumber.replace(/\D/g, '').split('').reverse().map(Number);
  let sum = 0;
  for (let i = 0; i < digits.length; i++) {
    let digit = digits[i];
    if (i % 2 === 1) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
  }
  return sum % 10 === 0;
};

const i18n = {
  zh: {
    email: '電子郵件', card: '卡號', expiry: '到期日', cvc: 'CVV', name: '持卡人姓名', submit: '新增', saved: '我想要安全儲存我的卡片。', success: '付款成功，我們已收到您的資料。', error: '卡號不正確，請重新輸入', currency: 'NT$'
  },
};

export default function App() {
  const [lang] = useState('zh');
  const [loading, setLoading] = useState(false);
  const [cardType, setCardType] = useState(null);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    card: '', expiry: '', cvc: '', name: '', saveInfo: false
  });

  const formatCard = (value) => value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim();
  const formatExpiry = (value) => value.replace(/\D/g, '').replace(/(\d{2})(\d{1,2})/, '$1 / $2');
  const formatCVC = (value) => value.replace(/\D/g, '').slice(0, 4);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let newValue = value;
    if (name === 'card') {
      newValue = formatCard(value);
      setCardType(detectCardType(value));
      setError(null);
    } else if (name === 'expiry') {
      newValue = formatExpiry(value);
    } else if (name === 'cvc') {
      newValue = formatCVC(value);
    }
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : newValue });
  };

  const handleSubmit = async () => {
    const validCard = luhnCheck(formData.card);
    if (!validCard) {
      setError(i18n[lang].error);
      return;
    }
    setLoading(true);
    setTimeout(() => {
      alert(i18n[lang].success);
      setLoading(false);
    }, 1000);
  };

  return (
  <div className="checkout-wrapper">
    <div className="checkout-modal">
      <div className="checkout-container">
        <div className="checkout-header">新增卡片</div>
        <input type="text" placeholder="卡片名稱" className="input" />

        <div className="card-logos">
          {[visa, amex, msc, up, jcb].map((logo, i) => (
            <img key={i} src={logo} alt="logo" className="logo" />
          ))}
        </div>

        <input name="card" value={formData.card} onChange={handleChange} type="text" placeholder="卡號" className="input" />
        <input name="name" value={formData.name} onChange={handleChange} type="text" placeholder="持卡人姓名" className="input" />

        <div className="row">
          <input name="expiry" value={formData.expiry} onChange={handleChange} type="text" placeholder="到期日" className="input" />
          <input name="cvc" value={formData.cvc} onChange={handleChange} type="text" placeholder="CVV" className="input" />
        </div>

        <div className="checkbox-row">
          <input name="saveInfo" type="checkbox" checked={formData.saveInfo} onChange={handleChange} />
          <span>{i18n[lang].saved}</span>
        </div>

        <div className="description">
        <div className="desc-title">進一步瞭解安全性</div>
        <div>
        Stripe 已通過 PCI 認證稽核者的稽核，並獲得 PCI 服務業者第 1 級的認證。此為支付業界目前最嚴格的認證等級。
        <a href="https://stripe.com/docs/security/stripe" target="_blank" rel="noopener noreferrer">瞭解詳情</a>
        </div>
        </div>

        <div className="stripe-logo-wrapper">
        <img src="./assets/stripe.svg" />

        </div>

        <button className="button" onClick={handleSubmit}>
        {loading ? '處理中...' : '新增'}
        </button>
        </div>
      </div>
    </div>
  );
}

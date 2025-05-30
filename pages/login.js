import { useState } from 'react';
import { useRouter } from 'next/router';
import Header from '../components/Header';

export default function LoginPage() {
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mobile, password }),
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem('user', JSON.stringify(data.user));
      router.push(data.user.role === 'admin' ? '/admin' : '/employee');
    } else {
      alert(data.message || 'Login failed');
    }
  };

  return (
    <>
      <Header />
      <div style={{ padding: '20px' }}>
        <h2>Login</h2>
        <input
          type="text"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          placeholder="Mobile"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button onClick={handleLogin}>Login</button>
      </div>
    </>
  );
}

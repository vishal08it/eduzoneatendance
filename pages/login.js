import { useState } from 'react';
import { useRouter } from 'next/router';
import Header from '../components/Header';
import styles from '../styles/Home.module.css';

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

  // Close and redirect to home
  const handleClose = () => {
    router.push('/');
  };

  return (
    <>
      <Header />
      <div className={styles.overlay}>
        <div className={styles.popup}>
          <button className={styles.closeButton} onClick={handleClose}>
            &times;
          </button>
          <img src="/logo.jpg" alt="Logo" className={styles.logo} />
          <h2 className={styles.title}>Login</h2>
          <input
            type="text"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            placeholder="Mobile"
            className={styles.input}
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className={styles.input}
          />
          <button className={styles.button} onClick={handleLogin}>
            Login
          </button>
        </div>
      </div>
    </>
  );
}

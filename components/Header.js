import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import styles from '../styles/Home.module.css';

export default function Header() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    router.push('/');
  };

  const handleLogin = () => {
    router.push('/login');
  };

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <img src="/logo.jpg" alt="Logo" className={styles.logo} />
      </div>

      <div className={styles.center}>
        <h1 className={styles.title}>Edu Zone Classes</h1>
        <p className={styles.address}>
          2nd Floor, Punjab National Bank Devli, bus stand, 245, Devli Rd, Durga Vihar, Khanpur Village, Khanpur, New Delhi, Delhi 110062
        </p>
      </div>

      <div className={styles.right}>
        {user ? (
          <button className={styles.logoutButton} onClick={handleLogout}>Logout</button>
        ) : (
          <button className={styles.loginButton} onClick={handleLogin}>Login</button>
        )}
      </div>
    </header>
  );
}

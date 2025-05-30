import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

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
    router.push('/login');
  };

  const handleLogin = () => {
    router.push('/login');
  };

  return (
    <header style={styles.header}>
      <h1 style={styles.title}>Eduzone Attendance</h1>
      <div>
        {user ? (
          <button style={styles.button} onClick={handleLogout}>Logout</button>
        ) : (
          <button style={styles.button} onClick={handleLogin}>Login</button>
        )}
      </div>
    </header>
  );
}

const styles = {
  header: {
    padding: '10px 20px',
    backgroundColor: '#333',
    color: '#fff',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    margin: 0,
  },
  button: {
    padding: '6px 12px',
    backgroundColor: '#fff',
    color: '#333',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

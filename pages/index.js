import Header from '../components/Header';
import ImageSlider from '../components/ImageSlider';
import styles from '../styles/Home.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <div className={styles.mainContent}>
        <Header />
         {/* <main style={{ padding: '20px', color: '#eee' }}>
          <h2>Welcome to Eduzone Attendance</h2>
          <p>Please login to continue.</p>
        </main> */}
        <ImageSlider />
       
      </div>
    </div>
  );
}

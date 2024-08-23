import React from 'react';

export default function FooterBar() {
  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        {/* About Us Section */}
        <div style={styles.section}>
          <p style={styles.text}>
            Welcome to our blog where we share insightful articles on a variety of topics.
          </p>
        </div>
      </div>
      
       <div style={styles.copyright}>
        <p>&copy; {new Date().getFullYear()} TECH-BLOG. All rights reserved.</p>
      </div>
    </footer>
  );
}

// CSS-in-JS Styles
const styles = {
  footer: {
    backgroundColor: '#333',
    color: '#fff',
    padding: '5px 0',  // Footer'ı daha ince yapmak için padding'i azalttık
    textAlign: 'center' as 'center',
    width: '100%',
    position: 'fixed' as 'fixed', // Footer'ı ekranın altına sabitlemek için
    bottom: 0,
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
  },
  section: {
    padding: '0',  // Ekstra boşluk bırakmadık
  },
  text: {
    fontSize: '12px',  // Metin boyutunu küçülttük
    margin: 0,
  },
  copyright: {
    fontSize: '12px',
    margin: 0,
  },
};


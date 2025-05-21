import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { motion } from 'framer-motion';

const Layout = () => {
  useEffect(() => {
    // Create floating flowers animation
    const createFlower = () => {
      const colors = ['#FFE4E1', '#FFF4D2', '#D4F1F4', '#E8D5E4'];
      const flower = document.createElement('div');
      flower.classList.add('floating-flowers');
      flower.style.left = Math.random() * 100 + '%';
      flower.style.animationDelay = Math.random() * 10 + 's';
      flower.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      flower.style.borderRadius = '50%';
      
      const heroSection = document.querySelector('.hero-bg');
      if (heroSection) {
        heroSection.appendChild(flower);
        setTimeout(() => {
          flower.remove();
        }, 15000);
      }
    };

    // Initialize flowers on hero section if it exists
    const initFlowers = () => {
      const heroSection = document.querySelector('.hero-bg');
      if (heroSection) {
        const interval = setInterval(createFlower, 2000);
        
        // Create initial flowers
        for (let i = 0; i < 10; i++) {
          createFlower();
        }
        
        return () => clearInterval(interval);
      }
    };

    const cleanup = initFlowers();
    return cleanup;
  }, []);

  return (
    <div className="flower-cursor flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout; 
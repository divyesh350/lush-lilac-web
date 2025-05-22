import { Link } from 'react-router-dom';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { RiInstagramLine, RiFacebookLine, RiPinterestLine, RiTiktokLine, RiVisaLine, RiMastercardLine, RiPaypalLine, RiAppleFill } from '@remixicon/react';

const socialIconMap = {
  'ri-instagram-line': RiInstagramLine,
  'ri-facebook-line': RiFacebookLine,
  'ri-pinterest-line': RiPinterestLine,
  'ri-tiktok-line': RiTiktokLine,
};

const paymentIconMap = {
  'ri-visa-line': RiVisaLine,
  'ri-mastercard-line': RiMastercardLine,
  'ri-paypal-line': RiPaypalLine,
  'ri-apple-fill': RiAppleFill,
};

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would connect to your newsletter API
    // For now, just show a success state
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  // Footer animation variants
  const footerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const socialLinks = [
    { icon: "ri-instagram-line", url: "#" },
    { icon: "ri-facebook-line", url: "#" },
    { icon: "ri-pinterest-line", url: "#" },
    { icon: "ri-tiktok-line", url: "#" }
  ];

  const shopLinks = [
    { name: "Phone Cases", url: "/shop?category=phone-cases" },
    { name: "Mouse Pads", url: "/shop?category=mouse-pads" },
    { name: "Mirrors", url: "/shop?category=mirrors" },
    { name: "Glass Tumblers", url: "/shop?category=tumblers" },
    { name: "Candles", url: "/shop?category=candles" }
  ];

  const helpLinks = [
    { name: "FAQs", url: "/faqs" },
    { name: "Shipping", url: "/shipping" },
    { name: "Returns", url: "/returns" },
    { name: "Track Order", url: "/track-order" },
    { name: "Contact Us", url: "/contact" }
  ];

  const aboutLinks = [
    { name: "Our Story", url: "/about" },
    { name: "Blog", url: "/blog" },
    { name: "Sustainability", url: "/sustainability" },
    { name: "Wholesale", url: "/wholesale" },
    { name: "Careers", url: "/careers" }
  ];

  const paymentIcons = [
    "ri-visa-line", 
    "ri-mastercard-line", 
    "ri-paypal-line", 
    "ri-apple-fill"
  ];

  return (
    <footer className="bg-white dark:bg-bg-secondary pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Newsletter Section */}
        <motion.div 
          className="bg-[#F9F0F7] dark:bg-gray-800 rounded-lg p-8 md:p-12 shadow-sm mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-semibold text-dark-purple dark:text-primary mb-4">Join Our Cute Community 🌸</h2>
            <p className="text-medium-purple dark:text-text-secondary max-w-2xl mx-auto">
              Subscribe to our newsletter for exclusive offers, cute updates, and first access to new releases!
            </p>
          </div>
          <div className="max-w-md mx-auto relative">
            <form onSubmit={handleSubmit} className="flex">
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address" 
                className="cute-input flex-1 py-3 px-4 rounded-l-button text-dark-purple dark:text-text-primary" 
                required
              />
              <button 
                type="submit" 
                className="bg-primary hover:bg-[#D4B6D0] text-white px-6 py-3 rounded-r-button font-medium transition-all duration-300 btn-hover whitespace-nowrap"
              >
                {subscribed ? "Subscribed!" : "Subscribe"}
              </button>
            </form>
            <motion.div 
              className="absolute -right-28 top-1/2 transform -translate-y-1/2 w-20 h-20 hidden md:block"
              style={{
                backgroundImage: "url('https://readdy.ai/api/search-image?query=cute%20purple%20gift%20box%20with%20pastel%20pink%20ribbon%20bow%20on%20top%2C%20soft%20lighting%2C%20delicate%20details%2C%203D%20rendered%2C%20centered%20composition%20on%20pure%20white%20background&width=200&height=200&seq=5&orientation=squarish')",
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center"
              }}
              animate={{ 
                rotate: [0, 5, 0, -5, 0],
                y: [0, -5, 0, -5, 0] 
              }}
              transition={{ 
                duration: 5, 
                ease: "easeInOut", 
                repeat: Infinity 
              }}
            />
          </div>
        </motion.div>

        {/* Footer Links */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-4 gap-8"
          variants={footerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Brand Column */}
          <motion.div variants={itemVariants}>
            <Link to="/" className="font-pacifico text-2xl text-primary">Lush Lilac</Link>
            <p className="mt-4 text-sky-blue dark:text-text-secondary">Making your everyday life cuter, one accessory at a time! 🌸</p>
            <div className="flex space-x-4 mt-6">
              {socialLinks.map((social, index) => {
                const Icon = socialIconMap[social.icon];
                return (
                  <motion.a 
                    key={index}
                    href={social.url} 
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-[#F9F0F7] dark:bg-gray-800 text-primary hover:bg-primary hover:text-white transition-all duration-300"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {Icon && <Icon className="w-5 h-5" />}
                  </motion.a>
                );
              })}
            </div>
          </motion.div>

          {/* Shop Links */}
          <motion.div variants={itemVariants}>
            <h3 className="text-dark-purple dark:text-primary font-medium mb-4">Shop</h3>
            <ul className="space-y-2 text-sky-blue dark:text-text-secondary">
              {shopLinks.map((link, index) => (
                <li key={index}>
                  <Link to={link.url} className="hover:text-primary">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Help Links */}
          <motion.div variants={itemVariants}>
            <h3 className="text-dark-purple dark:text-primary font-medium mb-4">Help</h3>
            <ul className="space-y-2 text-sky-blue dark:text-text-secondary">
              {helpLinks.map((link, index) => (
                <li key={index}>
                  <Link to={link.url} className="hover:text-primary">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* About Links */}
          <motion.div variants={itemVariants}>
            <h3 className="text-dark-purple dark:text-primary font-medium mb-4">About</h3>
            <ul className="space-y-2 text-sky-blue dark:text-text-secondary">
              {aboutLinks.map((link, index) => (
                <li key={index}>
                  <Link to={link.url} className="hover:text-primary">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>

        {/* Bottom Section */}
        <motion.div 
          className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700"
          variants={itemVariants}
        >
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sky-blue dark:text-text-secondary text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} Lush Lilac. All rights reserved.
            </p>
            <div className="flex space-x-4">
              {paymentIcons.map((icon, index) => {
                const Icon = paymentIconMap[icon];
                return (
                  <div 
                    key={index}
                    className="w-8 h-8 flex items-center justify-center text-gray-400 dark:text-gray-500"
                  >
                    {Icon && <Icon className="w-6 h-6" />}
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer; 
import { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';
import { RiMailLine, RiCustomerService2Line, RiMapPinLine, RiInstagramLine, RiFacebookLine, RiPinterestLine, RiTiktokLine } from '@remixicon/react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [formStatus, setFormStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simple validation
    if (!formData.name || !formData.email || !formData.message) {
      setFormStatus({ type: 'error', message: 'Please fill in all required fields' });
      return;
    }
    
    // In a real app, this would be an API call
    // For now, we'll just simulate a successful submission
    setFormStatus({ type: 'success', message: 'Your message has been sent! We will get back to you soon.' });
    
    // Reset form after successful submission
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
    
    // Clear success message after a few seconds
    setTimeout(() => {
      setFormStatus(null);
    }, 5000);
  };

  return (
    <div className="bg-bg-main dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl md:text-4xl font-semibold text-dark-purple dark:text-primary mb-3">Contact Us 🌸</h1>
          <p className="text-medium-purple dark:text-text-secondary max-w-xl mx-auto">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Form */}
          <motion.div 
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl font-semibold text-dark-purple dark:text-primary mb-6">Send us a Message</h2>
            
            {formStatus && (
              <div className={`p-4 rounded-lg mb-6 ${
                formStatus.type === 'success' 
                  ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-100' 
                  : 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-100'
              }`}>
                {formStatus.message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-dark-purple dark:text-text-primary mb-2">
                  Your Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:ring-opacity-20 dark:bg-gray-700 dark:text-text-primary"
                  placeholder="Enter your name"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-dark-purple dark:text-text-primary mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:ring-opacity-20 dark:bg-gray-700 dark:text-text-primary"
                  placeholder="Enter your email"
                  required
                />
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-dark-purple dark:text-text-primary mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:ring-opacity-20 dark:bg-gray-700 dark:text-text-primary"
                  placeholder="Enter subject"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-dark-purple dark:text-text-primary mb-2">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows="4"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:ring-opacity-20 dark:bg-gray-700 dark:text-text-primary"
                  placeholder="Enter your message"
                  required
                ></textarea>
              </div>
              <Button 
                type="submit" 
                className="w-full"
              >
                Send Message
              </Button>
            </form>
          </motion.div>

          {/* Contact Information */}
          <motion.div 
            className="space-y-8"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-semibold text-dark-purple dark:text-primary mb-6">Contact Information</h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-[#FFE4E1] dark:bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
                    <RiMapPinLine className="w-6 h-6 text-dark-purple dark:text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-dark-purple dark:text-primary mb-1">Our Location</h3>
                    <p className="text-medium-purple dark:text-text-secondary">
                      123 Cute Street, Kawaii City<br />
                      Prefecture, Japan 123-4567
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-[#FFF4D2] dark:bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
                    <RiMailLine className="w-6 h-6 text-dark-purple dark:text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-dark-purple dark:text-primary mb-1">Email Us</h3>
                    <p className="text-medium-purple dark:text-text-secondary">
                      hello@lushlilac.com<br />
                      support@lushlilac.com
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-[#D4F1F4] dark:bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
                    <RiCustomerService2Line className="w-6 h-6 text-dark-purple dark:text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-dark-purple dark:text-primary mb-1">Customer Support</h3>
                    <p className="text-medium-purple dark:text-text-secondary">
                      Monday - Friday: 9:00 AM - 6:00 PM<br />
                      Saturday: 10:00 AM - 4:00 PM<br />
                      Sunday: Closed
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-semibold text-dark-purple dark:text-primary mb-4">Follow Us</h2>
              <p className="text-medium-purple dark:text-text-secondary mb-4">
                Stay updated with our latest products and promotions on social media!
              </p>
              
              <div className="flex space-x-4">
                {[
                  { Icon: RiInstagramLine },
                  { Icon: RiFacebookLine },
                  { Icon: RiPinterestLine },
                  { Icon: RiTiktokLine }
                ].map(({ Icon }, index) => (
                  <motion.a 
                    key={index}
                    href="#" 
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-[#F9F0F7] dark:bg-gray-700 text-primary hover:bg-primary hover:text-white transition-all duration-300"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon />
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact; 
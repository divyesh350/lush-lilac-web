import { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';

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
    <div className="bg-bg-main py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl md:text-4xl font-semibold text-dark-purple mb-3">Contact Us 💌</h1>
          <p className="text-medium-purple max-w-xl mx-auto">
            We'd love to hear from you! Send us a message and we'll respond as soon as possible.
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Contact Form */}
          <motion.div 
            className="lg:w-2/3"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-semibold text-dark-purple mb-6">Send Us a Message</h2>
              
              {formStatus && (
                <div className={`p-4 rounded-lg mb-6 ${formStatus.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {formStatus.message}
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="name" className="block text-dark-purple font-medium mb-2">Your Name <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="cute-input w-full py-3 px-4 rounded-button text-dark-purple"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-dark-purple font-medium mb-2">Your Email <span className="text-red-500">*</span></label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="cute-input w-full py-3 px-4 rounded-button text-dark-purple"
                      required
                    />
                  </div>
                </div>
                
                <div className="mb-6">
                  <label htmlFor="subject" className="block text-dark-purple font-medium mb-2">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="cute-input w-full py-3 px-4 rounded-button text-dark-purple"
                  />
                </div>
                
                <div className="mb-6">
                  <label htmlFor="message" className="block text-dark-purple font-medium mb-2">Message <span className="text-red-500">*</span></label>
                  <textarea
                    id="message"
                    name="message"
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    className="cute-input w-full py-3 px-4 rounded-button text-dark-purple"
                    required
                  ></textarea>
                </div>
                
                <Button type="submit" className="w-full md:w-auto">
                  Send Message
                </Button>
              </form>
            </div>
          </motion.div>

          {/* Contact Info */}
          <motion.div 
            className="lg:w-1/3"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
              <h2 className="text-2xl font-semibold text-dark-purple mb-6">Contact Information</h2>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-[#F9F0F7] rounded-full flex items-center justify-center flex-shrink-0 mr-4">
                    <i className="ri-mail-line text-primary"></i>
                  </div>
                  <div>
                    <h3 className="text-dark-purple font-medium">Email</h3>
                    <p className="text-medium-purple">support@lushlilac.com</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-[#F9F0F7] rounded-full flex items-center justify-center flex-shrink-0 mr-4">
                    <i className="ri-customer-service-2-line text-primary"></i>
                  </div>
                  <div>
                    <h3 className="text-dark-purple font-medium">Customer Service</h3>
                    <p className="text-medium-purple">Monday - Friday: 9am - 5pm EST</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-[#F9F0F7] rounded-full flex items-center justify-center flex-shrink-0 mr-4">
                    <i className="ri-map-pin-line text-primary"></i>
                  </div>
                  <div>
                    <h3 className="text-dark-purple font-medium">Location</h3>
                    <p className="text-medium-purple">123 Lilac Lane, Suite 456<br />Pastel City, PC 12345<br />United States</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-semibold text-dark-purple mb-4">Follow Us</h2>
              <p className="text-medium-purple mb-4">
                Stay updated with our latest products and promotions on social media!
              </p>
              
              <div className="flex space-x-4">
                {['ri-instagram-line', 'ri-facebook-line', 'ri-pinterest-line', 'ri-tiktok-line'].map((icon, index) => (
                  <motion.a 
                    key={index}
                    href="#" 
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-[#F9F0F7] text-primary hover:bg-primary hover:text-white transition-all duration-300"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <i className={icon}></i>
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
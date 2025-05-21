import { motion } from 'framer-motion';

const About = () => {
  return (
    <div className="bg-bg-main py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl md:text-4xl font-semibold text-dark-purple mb-3">About Lush Lilac 🌸</h1>
          <p className="text-medium-purple max-w-xl mx-auto">
            Our mission is to bring joy and cuteness to your everyday life.
          </p>
        </motion.div>

        <motion.div 
          className="bg-white rounded-lg shadow-sm p-8 mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/2">
              <h2 className="text-2xl font-semibold text-dark-purple mb-4">Our Story</h2>
              <p className="text-medium-purple mb-4">
                Lush Lilac was founded in 2022 with a simple goal - to create adorable accessories that bring a touch of cuteness to everyday items. What started as a small Etsy shop has grown into a beloved brand that ships products worldwide.
              </p>
              <p className="text-medium-purple mb-4">
                Our founder, Maya, has always been passionate about creating cute and aesthetic designs. After struggling to find phone cases and accessories that matched her aesthetic, she decided to create her own - and Lush Lilac was born!
              </p>
              <p className="text-medium-purple">
                Today, our team of designers work together to create unique, high-quality products that help you express your style and personality through the items you use every day.
              </p>
            </div>
            <div className="md:w-1/2 bg-[#F9F0F7] rounded-lg flex items-center justify-center min-h-[300px]">
              <div className="text-center">
                <span className="text-6xl">🌸</span>
                <p className="text-primary mt-2">Image placeholder</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
        >
          <motion.div 
            className="bg-white rounded-lg shadow-sm p-6 text-center"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
            }}
          >
            <div className="w-16 h-16 bg-[#FFE4E1] rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="ri-heart-line ri-xl text-dark-purple"></i>
            </div>
            <h3 className="text-xl font-medium text-dark-purple mb-2">Handcrafted With Love</h3>
            <p className="text-medium-purple">
              Each of our products is designed with care and attention to detail, ensuring quality you can trust.
            </p>
          </motion.div>
          
          <motion.div 
            className="bg-white rounded-lg shadow-sm p-6 text-center"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
            }}
          >
            <div className="w-16 h-16 bg-[#FFF4D2] rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="ri-recycle-line ri-xl text-dark-purple"></i>
            </div>
            <h3 className="text-xl font-medium text-dark-purple mb-2">Eco-Friendly Materials</h3>
            <p className="text-medium-purple">
              We're committed to sustainability, using recyclable and eco-friendly materials whenever possible.
            </p>
          </motion.div>
          
          <motion.div 
            className="bg-white rounded-lg shadow-sm p-6 text-center"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
            }}
          >
            <div className="w-16 h-16 bg-[#D4F1F4] rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="ri-community-line ri-xl text-dark-purple"></i>
            </div>
            <h3 className="text-xl font-medium text-dark-purple mb-2">Community Focused</h3>
            <p className="text-medium-purple">
              We value our customers and community, incorporating your feedback into our designs and products.
            </p>
          </motion.div>
        </motion.div>

        <motion.div 
          className="bg-white rounded-lg shadow-sm p-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl font-semibold text-dark-purple mb-6 text-center">Meet Our Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'Maya Lin', role: 'Founder & Designer', bg: '#FFE4E1' },
              { name: 'Alex Johnson', role: 'Creative Director', bg: '#FFF4D2' },
              { name: 'Sophia Chen', role: 'Product Manager', bg: '#D4F1F4' },
              { name: 'Jake Murphy', role: 'Customer Experience', bg: '#E8D5E4' }
            ].map((member, index) => (
              <motion.div 
                key={index}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <div 
                  className="w-32 h-32 rounded-full mx-auto mb-4 flex items-center justify-center"
                  style={{ backgroundColor: member.bg }}
                >
                  <span className="text-4xl">👤</span>
                </div>
                <h3 className="text-lg font-medium text-dark-purple">{member.name}</h3>
                <p className="text-medium-purple">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default About; 
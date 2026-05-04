import React, { useState, useContext } from 'react';
import { Card, Button, Input } from '../components/ui';
import { ThemeContext } from '../ThemeContext';
import { motion } from 'framer-motion';
import { FiMail, FiPhone, FiMapPin, FiUser } from 'react-icons/fi';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const { darkMode } = useContext(ThemeContext);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({ name: '', email: '', message: '' });
  };

  const contactInfo = [
    { icon: <FiMail />, text: 'support@resumebuilder.com' },
    { icon: <FiPhone />, text: '+1 (555) 123-4567' },
    { icon: <FiMapPin />, text: '123 Resume Lane, Workville, WS 45678' },
  ];

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-neutral-900 text-white' : 'bg-neutral-50 text-neutral-900'} p-4 sm:p-6 lg:p-8 transition-colors duration-300`}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-extrabold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">Contact Us</h1>
          <p className={`text-xl ${darkMode ? 'text-neutral-400' : 'text-neutral-600'}`}>We're here to help. Reach out with questions, feedback, or just to say hello.</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            <Card className="p-8 sm:p-10 shadow-2xl rounded-2xl h-full">
              <h2 className="text-3xl font-bold mb-6">Send a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="relative">
                  <FiUser className="absolute top-1/2 -translate-y-1/2 left-4 text-neutral-400" />
                  <Input id="name" name="name" type="text" value={formData.name} onChange={handleInputChange} required placeholder="Your Name" className="pl-12" />
                </div>
                <div className="relative">
                  <FiMail className="absolute top-1/2 -translate-y-1/2 left-4 text-neutral-400" />
                  <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} required placeholder="Your Email" className="pl-12" />
                </div>
                <div>
                  <textarea
                    id="message"
                    name="message"
                    rows="7"
                    className={`w-full p-4 rounded-lg ${darkMode ? 'bg-neutral-800 border-neutral-700 focus:ring-blue-500' : 'bg-neutral-100 border-neutral-300 focus:ring-blue-500'} border transition focus:ring-2 focus:border-transparent`}
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    placeholder="How can we help you?"
                  ></textarea>
                </div>
                <div className="text-right">
                  <Button type="submit" size="lg" className="w-full sm:w-auto">Send Message</Button>
                </div>
              </form>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.2 }}
            className="space-y-8"
          >
            <Card className="p-8 sm:p-10 shadow-2xl rounded-2xl">
              <h2 className="text-3xl font-bold mb-6">Contact Information</h2>
              <div className="space-y-6">
                {contactInfo.map((item, index) => (
                  <div key={index} className="flex items-center">
                    <div className={`flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl`}>
                      {item.icon}
                    </div>
                    <p className="ml-4 text-lg">{item.text}</p>
                  </div>
                ))}
              </div>
            </Card>
            <Card className="p-8 sm:p-10 shadow-2xl rounded-2xl">
              <h2 className="text-3xl font-bold mb-6">Office Hours</h2>
              <p className="text-lg">Monday - Friday: 9:00 AM - 5:00 PM</p>
              <p className="text-lg">Saturday - Sunday: Closed</p>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;

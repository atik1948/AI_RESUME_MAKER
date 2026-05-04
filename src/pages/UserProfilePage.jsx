import React, { useState, useContext, useEffect } from 'react';
import { Card, Button, Input } from '../components/ui';
import { ThemeContext } from '../ThemeContext';
import { motion } from 'framer-motion';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { FiCamera, FiUser, FiMail, FiEdit2 } from 'react-icons/fi';

const UserProfilePage = () => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    bio: '',
  });
  const { darkMode } = useContext(ThemeContext);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setProfile({
          name: currentUser.displayName || 'Anonymous',
          email: currentUser.email,
          bio: 'A passionate frontend developer specializing in React and modern web technologies. Enthusiastic about creating seamless user experiences and beautiful UIs.',
        });
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile(prevProfile => ({ ...prevProfile, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Profile updated:', profile);
    alert('Profile updated successfully!');
    setIsEditing(false);
  };

  if (!user) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-neutral-900 text-white' : 'bg-neutral-50 text-neutral-900'} transition-colors duration-300`}>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-600 relative">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
            <div className="relative group">
              <div className="w-32 h-32 bg-white dark:bg-neutral-800 rounded-full flex items-center justify-center shadow-lg border-4 border-white dark:border-neutral-900">
                <span className="text-5xl font-bold text-blue-500">{profile.name.charAt(0)}</span>
              </div>
              <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <FiCamera className="text-white text-3xl" />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold">{profile.name}</h1>
            <p className={`mt-2 text-lg ${darkMode ? 'text-neutral-400' : 'text-neutral-600'}`}>{profile.email}</p>
          </div>

          <Card className="p-8 shadow-xl rounded-2xl">
            {isEditing ? (
              <form onSubmit={handleSubmit}>
                <h2 className="text-2xl font-bold mb-6 flex items-center"><FiEdit2 className="mr-3" /> Edit Profile</h2>
                <div className="space-y-6">
                  <div className="relative">
                    <FiUser className="absolute top-1/2 -translate-y-1/2 left-3 text-neutral-400" />
                    <Input id="name" name="name" type="text" value={profile.name} onChange={handleInputChange} placeholder="Your full name" className="pl-10" />
                  </div>
                  <div className="relative">
                    <FiMail className="absolute top-1/2 -translate-y-1/2 left-3 text-neutral-400" />
                    <Input id="email" name="email" type="email" value={profile.email} onChange={handleInputChange} disabled className="pl-10" />
                  </div>
                  <div>
                    <textarea
                      id="bio"
                      name="bio"
                      rows="5"
                      className={`w-full p-3 rounded-lg ${darkMode ? 'bg-neutral-800 border-neutral-700 focus:ring-blue-500' : 'bg-neutral-100 border-neutral-300 focus:ring-blue-500'} border transition focus:ring-2 focus:border-transparent`}
                      value={profile.bio}
                      onChange={handleInputChange}
                      placeholder="Tell us a little about yourself"
                    ></textarea>
                  </div>
                </div>
                <div className="mt-8 flex justify-end space-x-4">
                  <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                  <Button type="submit" size="lg">Save Changes</Button>
                </div>
              </form>
            ) : (
              <div>
                <div className="flex justify-between items-start">
                  <h2 className="text-2xl font-bold">About Me</h2>
                  <Button variant="ghost" size="icon" onClick={() => setIsEditing(true)}>
                    <FiEdit2 />
                  </Button>
                </div>
                <p className={`mt-4 text-lg leading-relaxed ${darkMode ? 'text-neutral-300' : 'text-neutral-700'}`}>
                  {profile.bio}
                </p>
                <div className="mt-10 border-t dark:border-neutral-700 pt-6">
                  <h3 className="text-lg font-semibold mb-4">Account Settings</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Button variant="outline">Change Password</Button>
                    <Button variant="outline">Notification Settings</Button>
                    <Button variant="danger" className="sm:col-span-2">Delete Account</Button>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default UserProfilePage;

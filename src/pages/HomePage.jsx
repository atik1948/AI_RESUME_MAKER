import React, { useState, useEffect, useContext } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Button, Card, Modal, Progress } from '../components/ui';
import { ThemeContext } from '../ThemeContext'; // Import ThemeContext
import {
  getExperienceExamples,
  getProjectExamples,
  getSummaryExamples,
} from '../utils/exampleLibrary';

function TestimonialAvatar({ src, name }) {
  const [hasError, setHasError] = useState(false);
  const initials = name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  if (hasError || !src) {
    return (
      <div className="mr-4 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-sm font-semibold text-white">
        {initials}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={name}
      className="mr-4 h-12 w-12 shrink-0 rounded-full object-cover"
      onError={() => setHasError(true)}
    />
  );
}

const HomePage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showExamples, setShowExamples] = useState(false);
  const [exampleRole, setExampleRole] = useState('frontend');
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 300], [0, -50]);
  const y2 = useTransform(scrollY, [0, 300], [0, -100]);
  const { darkMode } = useContext(ThemeContext); // Use ThemeContext to get darkMode

  const roleOptions = {
    frontend: {
      label: 'Frontend Developer',
      profileType: 'Developer',
      targetJobTitle: 'Frontend Developer',
      experienceJobTitle: 'Frontend Developer',
      projectName: 'Portfolio Website',
      technologies: 'React, Tailwind CSS',
      badge: 'Best for web roles',
      highlights: [
        'Strong UI, component, and performance focus',
        'Clean one-page structure for ATS-friendly review',
        'Balances product thinking with technical execution',
      ],
    },
    backend: {
      label: 'Backend Developer',
      profileType: 'Developer',
      targetJobTitle: 'Backend Developer',
      experienceJobTitle: 'Backend Engineer',
      projectName: 'API Service',
      technologies: 'Node.js, PostgreSQL, Express',
      badge: 'Best for engineering roles',
      highlights: [
        'Emphasizes APIs, databases, and system reliability',
        'Highlights measurable backend impact clearly',
        'Works well for service and platform-focused resumes',
      ],
    },
    marketing: {
      label: 'Digital Marketer',
      profileType: 'Marketing Professional',
      targetJobTitle: 'Digital Marketing Specialist',
      experienceJobTitle: 'Marketing Executive',
      projectName: 'Campaign Launch',
      technologies: 'Meta Ads, Analytics, Content Calendar',
      badge: 'Best for growth roles',
      highlights: [
        'Showcases campaigns, reporting, and audience results',
        'Keeps achievements and content strategy readable',
        'Useful for performance, brand, and content applications',
      ],
    },
    design: {
      label: 'UI/UX Designer',
      profileType: 'Designer',
      targetJobTitle: 'UI/UX Designer',
      experienceJobTitle: 'Product Designer',
      projectName: 'Mobile App Redesign',
      technologies: 'Figma, Prototyping, Design System',
      badge: 'Best for product design roles',
      highlights: [
        'Frames design decisions in a recruiter-friendly way',
        'Highlights UX thinking, prototyping, and systems work',
        'Keeps portfolio-style experience concise and scannable',
      ],
    },
  };

  const selectedRole = roleOptions[exampleRole] || roleOptions.frontend;
  const genericExampleContext = {
    profileType: selectedRole.profileType,
    targetJobTitle: selectedRole.targetJobTitle,
  };

  const summaryExamples = getSummaryExamples(genericExampleContext);
  const experienceExamples = getExperienceExamples(
    { jobTitle: selectedRole.experienceJobTitle },
    genericExampleContext,
  );
  const projectExamples = getProjectExamples(
    { name: selectedRole.projectName, technologies: selectedRole.technologies },
    genericExampleContext,
  );

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  // Feature data
  const features = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: "AI-Powered Writing",
      description: "Advanced AI helps craft compelling content tailored to your industry and experience level."
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "ATS Optimized",
      description: "Templates designed to pass Applicant Tracking Systems and reach human recruiters."
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17v4a2 2 0 002 2h4M15 5l2 2" />
        </svg>
      ),
      title: "Professional Templates",
      description: "Choose from expertly designed templates that make a lasting impression."
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "Quick & Easy",
      description: "Build a professional resume in minutes with our intuitive step-by-step process."
    }
  ];

  const stats = [
    { number: "50K+", label: "Resumes Created" },
    { number: "95%", label: "Success Rate" },
    { number: "24/7", label: "AI Support" },
    { number: "15+", label: "Templates" }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Software Engineer",
      company: "Tech Corp",
      content: "This AI resume builder helped me land my dream job! The suggestions were spot-on and the templates are beautiful.",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=64&h=64&fit=crop&crop=face"
    },
    {
      name: "Michael Chen",
      role: "Marketing Manager",
      company: "Growth Inc",
      content: "I was amazed by how quickly I could create a professional resume. The AI writing assistance is incredible.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face"
    },
    {
      name: "Emily Rodriguez",
      role: "UX Designer",
      company: "Design Studio",
      content: "The templates are modern and eye-catching. I received multiple interview calls within a week!",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:bg-gradient-to-br dark:from-neutral-900 dark:via-neutral-800 dark:to-gray-900 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-pink-400/20 to-yellow-400/20 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-cyan-400/10 to-blue-400/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <motion.div
          className="max-w-7xl mx-auto text-center"
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
        >
          {/* Main Heading */}
          <motion.div variants={itemVariants} className="mb-8">
            <motion.h1
              className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-gray-100 mb-6 leading-tight"
              style={{ y: y1 }}
            >
              Build Your{' '}
              <span className="text-gradient bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Perfect Resume
              </span>
              <br />
              <span className="text-4xl sm:text-5xl lg:text-6xl text-gray-700 dark:text-gray-300">
                in Minutes
              </span>
            </motion.h1>
            
            <motion.p
              className="text-xl sm:text-2xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed"
              variants={itemVariants}
            >
              Harness the power of AI to create a professional, ATS-optimized resume that gets you noticed by top employers.
            </motion.p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
          >
            <Button
              size="xl"
              className="px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              gradient
              glow
              onClick={() => window.location.href = '/builder?new=1'}
            >
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Start Building Now
              </div>
            </Button>
            
            <Button
              variant="outline"
              size="xl"
              className="px-8 py-4 text-lg font-semibold border-2 hover:bg-white/50 dark:hover:bg-neutral-800/50 backdrop-blur-sm"
              onClick={() => setShowExamples(true)}
            >
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                See Examples
              </div>
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="text-center"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <div className="text-3xl sm:text-4xl font-bold text-gradient bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 dark:text-gray-400 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Floating Elements */}
        <motion.div
          className="absolute top-20 right-20 hidden lg:block"
          variants={floatingVariants}
          animate="animate"
        >
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl shadow-lg opacity-80" />
        </motion.div>
        
        <motion.div
          className="absolute bottom-32 left-20 hidden lg:block"
          variants={floatingVariants}
          animate="animate"
          transition={{ delay: 1 }}
        >
          <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-yellow-500 rounded-full shadow-lg opacity-70" />
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          className="max-w-7xl mx-auto"
          style={{ y: y2 }}
        >
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-6">
              Why Choose Our{' '}
              <span className="text-gradient bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AI Resume Builder
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Experience the future of resume building with cutting-edge AI technology and professional design.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card
                  className="h-full p-8 text-center hover:shadow-2xl transition-all duration-300 group cursor-pointer"
                  hover="lift"
                  gradient
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Process Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white/50 dark:bg-neutral-800/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-6">
              Simple 3-Step Process
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Get your professional resume ready in just three easy steps.
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <Progress.Steps
              steps={[
                {
                  title: "Enter Your Information",
                  description: "Fill in your details with AI assistance"
                },
                {
                  title: "Choose Your Template",
                  description: "Select from professional designs"
                },
                {
                  title: "Download & Apply",
                  description: "Get your polished resume instantly"
                }
              ]}
              currentStep={1}
              variant="primary"
              size="lg"
              animated
            />
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-6">
              Success Stories
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Join thousands of professionals who landed their dream jobs with our AI resume builder.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="p-8 h-full hover:shadow-xl transition-all duration-300" hover="lift">
                  <div className="flex items-center mb-6">
                    <TestimonialAvatar src={testimonial.avatar} name={testimonial.name} />
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100">{testimonial.name}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{testimonial.role} at {testimonial.company}</p>
                    </div>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed italic">"{testimonial.content}"</p>
                  <div className="flex text-yellow-400 mt-4">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <motion.div
          className="max-w-4xl mx-auto text-center relative z-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Ready to Land Your Dream Job?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of successful professionals who used our AI resume builder to advance their careers.
          </p>
          <Button
            size="xl"
            variant="secondary"
            className={`px-12 py-4 text-lg font-semibold flex items-center justify-center space-x-2 ${
              darkMode
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600'
                : 'bg-gradient-to-r from-blue-500 to-teal-500 text-white hover:from-blue-600 hover:to-teal-600'
            } shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 ease-in-out`}
            onClick={() => window.location.href = '/builder?new=1'}
          >
            <div className="flex items-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>Start Building Your Resume Now</span>
            </div>
          </Button>
          <p className="text-blue-200 mt-4 text-sm">
            No credit card required • Free to start • Professional results
          </p>
        </motion.div>
      </section>

      <Modal
        isOpen={showExamples}
        onClose={() => setShowExamples(false)}
        title="Resume Content Examples"
        panelClassName="max-w-4xl sm:max-w-5xl"
      >
        <div className="space-y-5 overflow-x-hidden">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Pick a role to preview how a polished resume could be framed for that kind of candidate.
          </p>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {Object.entries(roleOptions).map(([key, option]) => (
              <button
                key={key}
                type="button"
                onClick={() => setExampleRole(key)}
                className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                  exampleRole === key
                    ? 'border-blue-600 bg-blue-600 text-white'
                    : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-gray-200 dark:hover:bg-neutral-800'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.35fr_0.95fr] xl:items-stretch">
            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-neutral-700 dark:bg-neutral-900 sm:p-5 xl:max-h-[70vh] xl:overflow-y-auto">
              <div className="mb-4 flex flex-col gap-3 border-b border-gray-100 pb-4 dark:border-neutral-800 md:flex-row md:items-start md:justify-between">
                <div className="min-w-0">
                  <p className="text-xl font-bold leading-tight text-gray-900 dark:text-gray-100 sm:text-2xl">
                    {selectedRole.label}
                  </p>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Sample one-page positioning for a strong first impression
                  </p>
                </div>
                <span className="inline-flex w-fit rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-900/40 dark:text-blue-200">
                  {selectedRole.badge}
                </span>
              </div>

              <div className="space-y-4">
                <section>
                  <h4 className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-purple-700 dark:text-purple-300">
                    Professional Summary
                  </h4>
                  <p className="rounded-xl bg-purple-50 p-4 text-sm leading-6 text-gray-700 dark:bg-purple-900/20 dark:text-gray-200">
                    {summaryExamples[0]}
                  </p>
                </section>

                <section>
                  <h4 className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-blue-700 dark:text-blue-300">
                    Experience Example
                  </h4>
                  <div className="rounded-xl bg-blue-50 p-4 dark:bg-blue-900/20">
                    <div className="mb-2 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                        {selectedRole.experienceJobTitle}
                      </p>
                      <span className="text-xs text-gray-500 dark:text-gray-400">Recent role</span>
                    </div>
                    <div className="whitespace-pre-line text-sm leading-6 text-gray-700 dark:text-gray-200">
                      {experienceExamples[0]}
                    </div>
                  </div>
                </section>

                <section>
                  <h4 className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-green-700 dark:text-green-300">
                    Project Example
                  </h4>
                  <div className="rounded-xl bg-green-50 p-4 dark:bg-green-900/20">
                    <div className="mb-2 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                        {selectedRole.projectName}
                      </p>
                      <span className="text-xs text-gray-500 dark:text-gray-400 sm:text-right">
                        {selectedRole.technologies}
                      </span>
                    </div>
                    <p className="text-sm leading-6 text-gray-700 dark:text-gray-200">
                      {projectExamples[0]}
                    </p>
                  </div>
                </section>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-neutral-700 dark:bg-neutral-900/40 sm:p-5 xl:max-h-[70vh] xl:overflow-y-auto">
              <h4 className="text-sm font-semibold uppercase tracking-[0.18em] text-gray-700 dark:text-gray-200">
                Why This Works
              </h4>
              <div className="mt-4 space-y-3">
                {selectedRole.highlights.map((item, index) => (
                  <div
                    key={index}
                    className="rounded-xl bg-white p-3 text-sm leading-6 text-gray-700 shadow-sm dark:bg-neutral-900 dark:text-gray-200"
                  >
                    {item}
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-xl border border-dashed border-gray-300 p-4 dark:border-neutral-700">
                <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
                  What you will customize in the builder
                </p>
                <ul className="mt-2 space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <li>Your own summary, projects, and achievements</li>
                  <li>Template, colors, and one-page layout choices</li>
                  <li>AI-assisted writing when quota is available</li>
                </ul>
              </div>

              <div className="mt-5 flex flex-col gap-3">
                <Button
                  onClick={() => window.location.href = '/builder?new=1'}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0"
                >
                  Start Building
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowExamples(false)}
                  className="border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-neutral-700 dark:text-gray-200 dark:hover:bg-neutral-800"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default HomePage;

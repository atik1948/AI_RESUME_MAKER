import React, { useState, useRef } from 'react';
import { auth } from '../firebase';
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  RecaptchaVerifier,
  signInWithPhoneNumber
} from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const LoginPage = () => {
  const [mode, setMode] = useState('login'); // 'login', 'signup', or 'phone'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState('');
  const recaptchaRef = useRef(null);

  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      navigate('/builder');
    } catch (error) {
      if (error.code === 'auth/popup-closed-by-user') {
        // User closed the popup, do not show error, just reset loading
        setError('');
      } else {
        setError('Error signing in with Google.');
      }
      console.error('Error signing in with Google:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    if (!email || !password || (mode === 'signup' && !displayName)) {
      setError('Please fill in all required fields.');
      setLoading(false);
      return;
    }
    try {
      if (mode === 'login') {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName });
      }
      navigate('/builder');
    } catch (err) {
      if (err.code === 'auth/user-not-found') {
        setError('No user found with this email.');
      } else if (err.code === 'auth/wrong-password') {
        setError('Incorrect password.');
      } else if (err.code === 'auth/email-already-in-use') {
        setError('Email is already in use.');
      } else if (err.code === 'auth/weak-password') {
        setError('Password should be at least 6 characters.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Invalid email address.');
      } else {
        setError('Authentication error. Please try again.');
      }
      console.error('Auth error:', err);
    } finally {
      setLoading(false);
    }
  };

  // --- Phone Auth Handlers ---
  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        'recaptcha-container',
        {
          size: 'invisible',
          callback: () => {},
        },
        auth
      );
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setOtpError('');
    setOtpLoading(true);
    if (!phone) {
      setOtpError('Please enter your phone number.');
      setOtpLoading(false);
      return;
    }
    try {
      setupRecaptcha();
      const appVerifier = window.recaptchaVerifier;
      await signInWithPhoneNumber(auth, phone, appVerifier)
        .then((confirmationResult) => {
          window.confirmationResult = confirmationResult;
          setOtpSent(true);
        })
        .catch((err) => {
          if (err.code === 'auth/invalid-phone-number') {
            setOtpError('Invalid phone number.');
          } else if (err.code === 'auth/too-many-requests') {
            setOtpError('Too many requests. Please try again later.');
          } else {
            setOtpError('Failed to send OTP. Please try again.');
          }
        });
    } catch (err) {
      setOtpError('Failed to send OTP. Please try again.');
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setOtpError('');
    setOtpLoading(true);
    if (!otp) {
      setOtpError('Please enter the OTP.');
      setOtpLoading(false);
      return;
    }
    try {
      await window.confirmationResult.confirm(otp);
      navigate('/builder');
    } catch (err) {
      if (err.code === 'auth/invalid-verification-code') {
        setOtpError('Invalid OTP.');
      } else if (err.code === 'auth/code-expired') {
        setOtpError('OTP expired. Please try again.');
      } else {
        setOtpError('Failed to verify OTP. Please try again.');
      }
    } finally {
      setOtpLoading(false);
    }
  };

  // --- UI ---
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 dark:from-neutral-900 dark:to-neutral-800 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-neutral-900 shadow-xl rounded-2xl px-8 pt-8 pb-6 mb-4">
          <div className="mb-6">
            <h1 className="text-center text-3xl font-extrabold text-gray-900 dark:text-gray-100 mb-2 tracking-tight">
              {mode === 'login' ? 'Login' : mode === 'signup' ? 'Sign Up' : 'Login with Phone'}
            </h1>
            <p className="text-center text-gray-500 dark:text-gray-400 text-sm">
              Welcome to AI Resume Maker
            </p>
          </div>

          {/* Email/Password or Signup Form */}
          {(mode === 'login' || mode === 'signup') && (
            <form onSubmit={handleEmailAuth} className="space-y-4">
              {mode === 'signup' && (
                <Input
                  label="Name"
                  type="text"
                  value={displayName}
                  onChange={e => setDisplayName(e.target.value)}
                  required
                  disabled={loading}
                  placeholder="Your Name"
                  autoComplete="name"
                />
              )}
              <Input
                label="Email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                disabled={loading}
                placeholder="you@example.com"
                autoComplete="email"
              />
              <Input
                label="Password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                disabled={loading}
                placeholder="********"
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              />
              {error && (
                <div className="text-red-600 text-sm text-center">{error}</div>
              )}
              <Button
                type="submit"
                loading={loading}
                fullWidth
                rounded="md"
                variant="primary"
                className="mt-2"
              >
                {mode === 'login' ? 'Login' : 'Sign Up'}
              </Button>
            </form>
          )}

          {/* Phone Auth Form */}
          {mode === 'phone' && (
            <form onSubmit={otpSent ? handleVerifyOtp : handleSendOtp} className="space-y-4">
              <Input
                label="Phone Number"
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                required
                disabled={otpLoading || otpSent}
                placeholder="+8801XXXXXXXXX"
                autoComplete="tel"
              />
              {otpSent && (
                <Input
                  label="OTP"
                  type="text"
                  value={otp}
                  onChange={e => setOtp(e.target.value)}
                  required
                  disabled={otpLoading}
                  placeholder="Enter OTP"
                  autoComplete="one-time-code"
                />
              )}
              {otpError && (
                <div className="text-red-600 text-sm text-center">{otpError}</div>
              )}
              <div id="recaptcha-container" ref={recaptchaRef}></div>
              <Button
                type="submit"
                loading={otpLoading}
                fullWidth
                rounded="md"
                variant="primary"
                className="mt-2"
              >
                {otpSent ? 'Verify OTP' : 'Send OTP'}
              </Button>
            </form>
          )}

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-grow border-t border-gray-300 dark:border-neutral-700" />
            <span className="mx-2 text-gray-400 text-xs">or</span>
            <div className="flex-grow border-t border-gray-300 dark:border-neutral-700" />
          </div>

          {/* Social/Phone Buttons */}
          <div className="flex flex-col gap-2">
            <Button
              onClick={handleGoogleSignIn}
              loading={loading}
              fullWidth
              rounded="md"
              variant="danger"
              type="button"
            >
              Sign in with Google
            </Button>
            <Button
              onClick={() => {
                setMode('phone');
                setError('');
                setOtpError('');
                setOtp('');
                setPhone('');
                setOtpSent(false);
              }}
              loading={otpLoading}
              fullWidth
              rounded="md"
              variant="secondary"
              type="button"
            >
              Login with Phone
            </Button>
          </div>

          {/* Switch between login/signup/phone */}
          <div className="text-center mt-4">
            {mode === 'login' ? (
              <span className="text-gray-600 dark:text-gray-300 text-sm">
                Don't have an account?{' '}
                <button
                  type="button"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                  onClick={() => {
                    setMode('signup');
                    setError('');
                  }}
                  disabled={loading}
                >
                  Sign Up
                </button>
                {' '}|{' '}
                <button
                  type="button"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                  onClick={() => {
                    setMode('phone');
                    setError('');
                    setOtpError('');
                    setOtp('');
                    setPhone('');
                    setOtpSent(false);
                  }}
                  disabled={loading}
                >
                  Login with Phone
                </button>
              </span>
            ) : mode === 'signup' ? (
              <span className="text-gray-600 dark:text-gray-300 text-sm">
                Already have an account?{' '}
                <button
                  type="button"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                  onClick={() => {
                    setMode('login');
                    setError('');
                  }}
                  disabled={loading}
                >
                  Login
                </button>
                {' '}|{' '}
                <button
                  type="button"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                  onClick={() => {
                    setMode('phone');
                    setError('');
                    setOtpError('');
                    setOtp('');
                    setPhone('');
                    setOtpSent(false);
                  }}
                  disabled={loading}
                >
                  Login with Phone
                </button>
              </span>
            ) : (
              <span className="text-gray-600 dark:text-gray-300 text-sm">
                <button
                  type="button"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                  onClick={() => {
                    setMode('login');
                    setError('');
                  }}
                  disabled={loading}
                >
                  Login with Email
                </button>
                {' '}|{' '}
                <button
                  type="button"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                  onClick={() => {
                    setMode('signup');
                    setError('');
                  }}
                  disabled={loading}
                >
                  Sign Up
                </button>
              </span>
            )}
          </div>
        </div>
        <p className="text-center text-gray-500 dark:text-gray-400 text-xs">
          &copy;2025 AI Resume Maker. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;

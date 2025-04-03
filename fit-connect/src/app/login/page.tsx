'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { User, Lock, AlertCircle } from 'lucide-react';


import { login } from './actions';

export default function Login() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const result = await login(formData);
      if (result?.error) {
        setErrorMessage(result.error);
      }
    } catch (error) {
      setErrorMessage('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="absolute top-0 right-0 mt-8 mr-8 text-lg font-bold">
        <Link href="/signup" className="text-white hover:underline">
          Sign Up
        </Link>
      </div>

      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 mt-28">
        <Image src="/logo.jpeg" alt="Logo" width={150} height={150} />
      </div>

      <div className="w-80 mt-48">
        {errorMessage && (
          <div className="mb-4 p-3 ml-7 bg-red-100 border border-red-400 text-red-700 rounded flex items-center justify-center">
            <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form className="flex flex-col items-center w-full" action={handleSubmit}>
          <div className="mb-2 flex items-center w-full">
            <User className="mr-2" />
            <input
              type="email"
              name="email"
              placeholder="example@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="p-2 border rounded w-full"
              required
            />
          </div>
          <div className="mb-2 flex items-center w-full">
            <Lock className="mr-2" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="p-2 border rounded w-full"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`mt-12 py-3 px-16 bg-blue-500 text-white rounded hover:bg-blue-600 font-bold ${
              isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? 'Logging in...' : 'Login'}
          </button>
          <div className="pt-2 text-sm hover:underline">
            <Link href={'/passwordRecovery'}>Forgot your password?</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

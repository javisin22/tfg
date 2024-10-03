'use client';

import Link from 'next/link';
import Image from 'next/image';
import { User, Mail, Lock } from 'lucide-react';
import { useState } from 'react';
import { signup } from '@/login/actions';

export default function Signup() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [error, setError] = useState('');

  // const handleSignup = (e: React.FormEvent) => {
  //   e.preventDefault();

  //   // Username validation
  //   if (!username) {
  //     setError('Username cannot be empty');
  //     return;
  //   }

  //   // Email validation
  //   if (!email.includes('@')) {
  //     setError('Please enter a valid email address');
  //     return;
  //   }

  //   // Password validation
  //   const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
  //   if (!passwordRegex.test(password)) {
  //     setError(
  //       'Password must be at least 8 characters long, contain at least 1 capital letter and 1 digit'
  //     );
  //     return;
  //   }

  //   // Repeat password validation
  //   if (password !== repeatPassword) {
  //     setError('Passwords do not match');
  //     return;
  //   }

  //   setError('');
  //   console.log('Username: ', username);
  //   console.log('Email: ', email);
  //   console.log('Password: ', password);
  //   console.log('Repeat Password: ', repeatPassword);
  //   // Proceed with account creation logic
  // };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen">
      <div className="absolute top-0 right-0 mt-8 mr-8 text-lg font-bold">
        <Link href="/login" className="text-white hover:underline">
          Log In
        </Link>
      </div>

      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 mt-28">
        <Image src="/logo.jpeg" alt="Logo" width={150} height={150} />
      </div>
      <form className="flex flex-col items-center w-full max-w-2xl mt-24">
        <div className="flex w-full">
          <div className="flex flex-col items-center w-1/2 pr-4">
            <div className="mb-2 flex items-center w-full">
              <User className="mr-2" />
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="p-2 border rounded w-full text-black"
              />
            </div>
            <div className="mb-2 flex items-center w-full">
              <Mail className="mr-2" />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="p-2 border rounded w-full text-black"
              />
            </div>
          </div>
          <div className="border-r border-gray-300"></div>
          <div className="flex flex-col items-center w-1/2 pl-4">
            <div className="mb-2 flex items-center w-full">
              <Lock className="mr-2" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="p-2 border rounded w-full text-black"
              />
            </div>
            <div className="mb-2 flex items-center w-full">
              <Lock className="mr-2" />
              <input
                type="password"
                placeholder="Repeat Password"
                value={repeatPassword}
                onChange={(e) => setRepeatPassword(e.target.value)}
                className="p-2 border rounded w-full text-black"
              />
            </div>
          </div>
        </div>
        {error && <div className="text-red-500 mt-2 w-full text-center">{error}</div>}
        <button
          type="submit"
          formAction={signup}
          className="mt-12 py-3 px-16 bg-blue-500 text-white rounded hover:bg-blue-600 font-bold"
        >
          Create Account
        </button>
      </form>
    </div>
  );
}

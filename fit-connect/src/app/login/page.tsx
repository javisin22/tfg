'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { User, Lock } from 'lucide-react';


import { login } from './actions';

export default function Login() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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
      <form className="flex flex-col items-center w-80 mt-24">
        <div className="mb-2 flex items-center w-full">
          <User className="mr-2" />
          <input
            type="email"
            name='email'
            placeholder="example@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-2 border rounded w-full"
          />
        </div>
        <div className="mb-2 flex items-center w-full">
          <Lock className="mr-2" />
          <input
            type="password"
            name='password'
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-2 border rounded w-full"
          />
        </div>
        <button
          type="submit"
          formAction={login}
          className="mt-12 py-3 px-16 bg-blue-500 text-white rounded hover:bg-blue-600 font-bold"
        >
          Login
        </button>
        <div className="pt-2 text-sm hover:underline">
          <Link href={'/passwordRecovery'}>Forgot your password?</Link>
        </div>
      </form>
    </div>
  );


  // return (
  //   <form>
  //     <label htmlFor="email">Email:</label>
  //     <input id="email" name="email" type="email" required />
  //     <label htmlFor="password">Password:</label>
  //     <input id="password" name="password" type="password" required />
  //     <button formAction={login}>Log in</button>
  //     <button formAction={signup}>Sign up</button>
  //   </form>
  // );

}

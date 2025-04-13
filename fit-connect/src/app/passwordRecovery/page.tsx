'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Mail } from 'lucide-react';

export default function RecoverPassword() {
  const [email, setEmail] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [error, setError] = useState('');
  const [sentEmail, setSentEmail] = useState('');

  const handlePasswordRecovery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    setError('');

    try {
      const res = await fetch('/auth/recover', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      // Check if the response is OK before trying to parse JSON
      if (res.ok) {
        try {
          await res.json(); // Try to parse JSON but we don't actually need it
          setSentEmail(email); // Store the email for the popup
          setEmail('');
          setShowPopup(true);
        } catch (jsonError) {
          console.error('Error parsing JSON response:', jsonError);
          setSentEmail(email); // Store the email for the popup
          setShowPopup(true); // Still show success if the status was OK
        }
      } else {
        // Handle error response
        if (res.headers.get('content-type')?.includes('application/json')) {
          // Only try to parse as JSON if the content type is correct
          const errorData = await res.json();
          setError(errorData.error || 'An error occurred. Please try again.');
        } else {
          // If not JSON, use the status text
          setError(`Error: ${res.status} ${res.statusText || 'Something went wrong'}`);
        }
      }
    } catch (fetchError) {
      console.error('Network error:', fetchError);
      setError('Network error. Please check your connection and try again.');
    }
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="flex absolute top-0 right-0 mt-8 mr-8 text-lg font-bold gap-4">
        <Link href="/login" className="text-white hover:underline">
          Login
        </Link>
        <Link href="/signup" className="text-white hover:underline">
          Sign Up
        </Link>
      </div>

      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 mt-28">
        <Image src="/logo.jpeg" alt="Logo" width={150} height={150} />
      </div>
      <form onSubmit={handlePasswordRecovery} className="flex flex-col items-center w-80 mt-24">
        <div className="mb-2 flex items-center w-full justify-center">Enter your email address</div>

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
        {error && <div className="text-red-500 mt-2 w-full text-center">{error}</div>}
        <button type="submit" className="mt-12 py-3 px-5 bg-blue-500 text-white rounded hover:bg-blue-600 font-bold">
          Send verification email
        </button>
      </form>

      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold mb-4 text-black">Verification Email Sent</h2>
            <p className="mb-4 text-black">
              A verification email has been sent to <span className="underline">{sentEmail}</span>.
            </p>
            <button onClick={closePopup} className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
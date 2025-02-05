"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { signIn } from 'next-auth/react';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    // Handle signup logic (e.g., API calls or form validation)
  };

  // Google login handler for sign up
  const handleGoogleSignIn = () => {
    signIn("google"); // This will handle both sign-up and sign-in
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white shadow-md rounded-lg text-center">
        <h1 className="text-3xl font-semibold text-center mb-6">Create Account</h1>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </div>
          <div className="mb-4">
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
            />
          </div>
          <Button type="submit" className="w-full py-2">Sign Up</Button>
        </form>

        <p className="my-1">or</p>

        <div className="">
          <Button
            type="button"
            className="w-full py-2 bg-white hover:text-white hover:bg-zinc-900 border border-black-600 text-black-600"
            onClick={handleGoogleSignIn}
          >
            Continue with Google <img src="/images/google.png" alt="Google" className="w-4 h-4" />
          </Button>
        </div>

        <p className="mt-4 text-center">
          Already have an account?{' '}
          <Link href="/login" className="text-black-600 hover:underline font-semibold" passHref>
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}

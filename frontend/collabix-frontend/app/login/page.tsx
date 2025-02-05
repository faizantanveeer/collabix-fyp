"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { signIn } from 'next-auth/react';


export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
  
    const loginData = { email, password };
  
    try {
      // Using your custom login endpoint and manually calling NextAuth's `signIn`
      const res = await signIn("credentials", {
        redirect: false,  // Prevent automatic redirect to default login page
        email: loginData.email,
        password: loginData.password,
      });
  
      if (res?.error) {
        setError('Login failed. Please check your credentials.');
      } else {
        console.log("Login successful:", res);
        window.location.href = '/';  // Redirect to the dashboard after login
      }
    } catch (err) {
      setError('An error occurred during login. Please try again.');
      console.error(err);
    }
  };
  
  

  // Google login handler
  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl: '/dashboard' });  // Redirect to dashboard after successful login
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white shadow-md rounded-lg text-center">
        <h1 className="text-3xl font-semibold text-center mb-6">Welcome Back</h1>

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
              placeholder="Enter your password"
            />
          </div>
          <Button type="submit" className="w-full py-2" onClick={() => signIn("credentials")}>Login</Button>

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
          Don't have an account?{' '}
          <Link href="/signup" className="text-black-600 hover:underline font-semibold" passHref>
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}

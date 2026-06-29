import React, { useState } from 'react';

interface LoginProps {
  onLogin: (email: string, password: string) => void;
  goToRegister: () => void;
}

export default function Login({
  onLogin,
  goToRegister,
}: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email, password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-emerald-800 text-center mb-6">
          ActiWard AI
        </h1>

        <h2 className="text-xl font-semibold mb-4 text-center">
          Login
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full border p-3 rounded-lg"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full border p-3 rounded-lg"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full bg-emerald-700 text-white py-3 rounded-lg font-semibold"
          >
            Login
          </button>
        </form>

        <p className="text-center mt-4">
          Don't have an account?
          <button
            onClick={goToRegister}
            className="text-emerald-700 font-semibold ml-1"
          >
            Register
          </button>
        </p>
      </div>
    </div>
  );
}
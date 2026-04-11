import { useState } from 'react';
import { Heart, Mail, Lock, ArrowRight } from 'lucide-react';

interface LoginScreenProps {
  onLogin: (userId: string) => void;
  onSwitchToSignup: () => void;
}

export function LoginScreen({ onLogin, onSwitchToSignup }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      onLogin('user-123');
    }
  };

  const canSubmit = email.length > 0 && password.length > 0;

  return (
    <div className="w-full max-w-md">
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            Welcome Back
          </h1>
          <p className="text-sm text-gray-600">
            Sign in to access your estate management dashboard
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="executor@example.com"
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                className="w-4 h-4 border-2 border-gray-300 rounded"
              />
              <span className="text-gray-700">Remember me</span>
            </label>
            <button
              type="button"
              className="text-blue-600 hover:text-blue-700"
            >
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            disabled={!canSubmit}
            className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition-colors ${
              canSubmit
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            Sign In
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <button
              onClick={onSwitchToSignup}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Create one
            </button>
          </p>
        </div>
      </div>

      <div className="mt-6 text-center text-xs text-gray-600">
        <p>Protected by bank-level encryption</p>
        <p className="mt-1">© 2026 Digital Estate Management</p>
      </div>
    </div>
  );
}

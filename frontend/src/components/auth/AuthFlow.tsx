import { useState } from 'react';
import { LoginScreen } from './LoginScreen';
import { SignupScreen } from './SignupScreen';
import { AuthResponse } from '../../services/scanAPI';

interface AuthFlowProps {
  onAuthenticated: (auth: AuthResponse) => void;
}

export type AuthView = 'login' | 'signup';

export function AuthFlow({ onAuthenticated }: AuthFlowProps) {
  const [currentView, setCurrentView] = useState<AuthView>('login');

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      {currentView === 'login' ? (
        <LoginScreen
          onLogin={onAuthenticated}
          onSwitchToSignup={() => setCurrentView('signup')}
        />
      ) : (
        <SignupScreen
          onSignup={onAuthenticated}
          onSwitchToLogin={() => setCurrentView('login')}
        />
      )}
    </div>
  );
}

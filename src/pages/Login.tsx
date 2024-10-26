import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Shield } from 'lucide-react';
import { useAuthStore } from '../stores/useAuthStore';
import AuthLayout from '../components/auth/AuthLayout';
import FormInput from '../components/auth/FormInput';
import FormButton from '../components/auth/FormButton';
import FormMessage from '../components/auth/FormMessage';

export default function Login() {
  const navigate = useNavigate();
  const { signIn } = useAuthStore();
  const [employeeCode, setEmployeeCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!employeeCode.trim()) {
      setError('Please enter your employee code');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await signIn(employeeCode.trim());
      navigate('/');
    } catch (err: any) {
      console.error('Login error:', err);
      setError('Invalid employee code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="ICU Management System">
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && <FormMessage type="error">{error}</FormMessage>}

        <FormInput
          id="employeeCode"
          label="Employee Code"
          icon={User}
          type="text"
          required
          value={employeeCode}
          onChange={(e) => setEmployeeCode(e.target.value)}
          placeholder="Enter your employee code"
          autoComplete="username"
          autoFocus
          disabled={loading}
        />

        <FormButton
          type="submit"
          loading={loading}
          fullWidth
        >
          Sign in
        </FormButton>

        <div className="text-center">
          <FormButton
            type="button"
            variant="secondary"
            onClick={() => navigate('/admin-login')}
            icon={Shield}
          >
            Admin Login
          </FormButton>
        </div>
      </form>
    </AuthLayout>
  );
}
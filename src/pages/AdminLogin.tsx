import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, ArrowLeft } from 'lucide-react';
import { useAuthStore } from '../stores/useAuthStore';
import AuthLayout from '../components/auth/AuthLayout';
import FormInput from '../components/auth/FormInput';
import FormButton from '../components/auth/FormButton';
import FormMessage from '../components/auth/FormMessage';

export default function AdminLogin() {
  const navigate = useNavigate();
  const { signInAdmin } = useAuthStore();
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
      await signInAdmin(employeeCode.trim());
      navigate('/admin');
    } catch (err: any) {
      console.error('Admin login error:', err);
      setError('Invalid admin credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="Admin Login" 
      subtitle="Enter your employee code to access the admin dashboard"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && <FormMessage type="error">{error}</FormMessage>}

        <FormInput
          id="employeeCode"
          label="Admin Employee Code"
          icon={Shield}
          type="text"
          required
          value={employeeCode}
          onChange={(e) => setEmployeeCode(e.target.value)}
          placeholder="Enter your admin code"
          autoComplete="username"
          autoFocus
          disabled={loading}
        />

        <FormButton
          type="submit"
          loading={loading}
          fullWidth
        >
          Sign in as Admin
        </FormButton>

        <div className="text-center">
          <FormButton
            type="button"
            variant="secondary"
            onClick={() => navigate('/login')}
            icon={ArrowLeft}
          >
            Back to User Login
          </FormButton>
        </div>
      </form>
    </AuthLayout>
  );
}
import React from 'react';
import { Construction, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../components/auth/AuthLayout';
import FormButton from '../components/auth/FormButton';

export default function Maintenance() {
  const navigate = useNavigate();

  return (
    <AuthLayout 
      title="System Maintenance"
      subtitle="Authentication System Temporarily Unavailable"
    >
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <Construction className="h-16 w-16 text-blue-500" />
        </div>
        
        <div className="space-y-4">
          <p className="text-gray-600">
            We are currently updating our authentication system to provide you with a better and more secure experience.
          </p>
          
          <p className="text-gray-600">
            During this maintenance period, all login and authentication-related features are temporarily disabled.
          </p>
          
          <p className="text-gray-600">
            Please check back later. We apologize for any inconvenience.
          </p>
        </div>

        <FormButton
          type="button"
          variant="secondary"
          onClick={() => navigate('/welcome')}
          icon={ArrowLeft}
          fullWidth
        >
          Return to Home
        </FormButton>
      </div>
    </AuthLayout>
  );
}
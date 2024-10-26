import React, { useState } from 'react';
import { X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import FormInput from '../auth/FormInput';
import FormButton from '../auth/FormButton';
import FormMessage from '../auth/FormMessage';

interface AddUserModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddUserModal({ onClose, onSuccess }: AddUserModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    employeeCode: '',
    role: 'Doctor',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error } = await supabase
        .from('users')
        .insert([{
          name: formData.name,
          employee_code: formData.employeeCode,
          role: formData.role,
        }]);

      if (error) throw error;
      onSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Add New User</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {error && <FormMessage type="error">{error}</FormMessage>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <FormInput
            id="name"
            label="Name"
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />

          <FormInput
            id="employeeCode"
            label="Employee Code"
            type="text"
            required
            value={formData.employeeCode}
            onChange={(e) => setFormData({ ...formData, employeeCode: e.target.value })}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Role
            </label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="Doctor">Doctor</option>
              <option value="Nurse">Nurse</option>
            </select>
          </div>

          <div className="flex justify-end space-x-3 mt-5">
            <FormButton
              type="button"
              variant="secondary"
              onClick={onClose}
            >
              Cancel
            </FormButton>
            <FormButton
              type="submit"
              loading={loading}
            >
              Add User
            </FormButton>
          </div>
        </form>
      </div>
    </div>
  );
}
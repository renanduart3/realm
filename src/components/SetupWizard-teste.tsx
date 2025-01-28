import React, { useState } from 'react';
import { systemConfigService } from '../services/systemConfigService';
import { userService } from '../services/userService';
import { SystemConfig } from '../model/types';

export default function SetupWizard() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    organization_name: '',
    organization_type: 'profit',
    currency: 'BRL',
    logo: null as File | null
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, logo: e.target.files[0] });
    }
  };

  const handleSubmit = async () => {
    try {
      // Criar usuário master
      const user = await userService.createUser(
        formData.username,
        formData.password,
        'master',
        formData.organization_type as 'profit' | 'nonprofit'
      );

      // Salvar configurações
      const config: Partial<SystemConfig> = {
        organization_type: formData.organization_type as 'profit' | 'nonprofit',
        organization_name: formData.organization_name,
        currency: formData.currency,
        require_auth: true,
        google_sync_enabled: false
      };

      await systemConfigService.saveConfig(config);

      // Redirecionar para dashboard
      window.location.href = '/dashboard';
    } catch (error) {
      console.error('Erro ao configurar sistema:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
        {/* Implementação dos steps do wizard */}
      </div>
    </div>
  );
} 
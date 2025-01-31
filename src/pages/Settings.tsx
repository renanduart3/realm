import React, { useState, useEffect } from 'react';
import { Save, Loader2, CloudCog, Wand2, RotateCcw, CreditCard, Star, Check, X, Brain, Calendar, Cloud, AlertTriangle, Building2, Phone, Globe, Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';
import { systemConfigService } from '../services/systemConfigService';
import { googleSheetsService } from '../services/googleSheets.service';
import { OrganizationSetup } from '../model/types';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../db/AppDatabase';
import { useNavigate } from 'react-router-dom';
import { appConfig } from '../config/app.config';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { useToast } from '../hooks/useToast';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('organization');
  const [isSaving, setIsSaving] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const [isAnnual, setIsAnnual] = useState(false);
  const [earlyUsersCount] = useState(27);
  
  const [config, setConfig] = useState<Partial<OrganizationSetup>>({});
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const { updateOrganizationType } = useAuth();
  const navigate = useNavigate();

  const premiumPrice = {
    monthly: {
      early: 3.99,
      regular: 5.99
    },
    annual: {
      early: 39.99,
      regular: 59.99
    }
  };

  const currentPrice = isAnnual 
    ? premiumPrice.annual.early 
    : premiumPrice.monthly.early;

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    const currentConfig = await systemConfigService.getConfig();
    if (currentConfig) {
      setConfig(currentConfig);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const success = await systemConfigService.saveConfig(config);
      if (success) {
        showToast('Configurações salvas com sucesso!', 'success');
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        showToast('Erro ao salvar configurações', 'error');
      }
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      showToast('Erro ao salvar configurações', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof OrganizationSetup, value: any) => {
    setConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleGoogleSheetsSync = async () => {
    setIsSyncing(true);
    setSyncMessage(null);

    try {
      const result = await googleSheetsService.exportDataToGoogleSheets();
      setSyncMessage({ type: 'success', text: 'Sincronização concluída com sucesso!' });
    } catch (error) {
      setSyncMessage({ 
        type: 'error', 
        text: 'Erro na sincronização. Tente novamente mais tarde.' 
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const handleResetSystem = async () => {
    try {
      await db.delete();
      await db.open();
      window.location.reload();
    } catch (error) {
      console.error('Erro ao resetar sistema:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSave();
  };

  const handleSubscribe = (plan: 'free' | 'premium') => {
    showToast(`Plano ${plan} selecionado`, 'success');
  };

  const tabs = [
    { id: 'organization', label: 'Organização' },
    { id: 'subscription', label: 'Planos e Assinatura' },
    { id: 'integrations', label: 'Integrações' },
    { id: 'reset', label: 'Resetar Sistema' }
  ];

  const renderOrganizationForm = () => (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Organization Type - Read Only */}
      <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Tipo de Organização
        </label>
        <div className="flex items-center justify-between">
          <span className="text-gray-900 dark:text-white font-medium">
            {config.organization_type === 'profit' ? 'Com fins lucrativos' : 'Sem fins lucrativos'}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Para alterar, use a opção "Resetar Sistema"
          </span>
        </div>
      </div>

      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Nome da Organização *
          </label>
          <input
            type="text"
            required
            value={config.organization_name || ''}
            onChange={(e) => handleChange('organization_name', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            CNPJ
          </label>
          <input
            type="text"
            value={config.cnpj || ''}
            onChange={(e) => handleChange('cnpj', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            placeholder="00.000.000/0000-00"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Telefone Comercial
          </label>
          <input
            type="tel"
            value={config.commercial_phone || ''}
            onChange={(e) => handleChange('commercial_phone', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Website
          </label>
          <input
            type="url"
            value={config.website || ''}
            onChange={(e) => handleChange('website', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            placeholder="https://..."
          />
        </div>
      </div>

      {/* Address */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Endereço
        </label>
        <input
          type="text"
          value={config.address || ''}
          onChange={(e) => handleChange('address', e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        />
      </div>

      {/* Social Media */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Redes Sociais</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <Facebook className="w-5 h-5 text-blue-600" />
            <input
              type="url"
              value={config.social_media?.facebook || ''}
              onChange={(e) => handleChange('social_media', { ...config.social_media, facebook: e.target.value })}
              className="flex-1 rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              placeholder="Facebook URL"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Instagram className="w-5 h-5 text-pink-600" />
            <input
              type="url"
              value={config.social_media?.instagram || ''}
              onChange={(e) => handleChange('social_media', { ...config.social_media, instagram: e.target.value })}
              className="flex-1 rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              placeholder="Instagram URL"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Linkedin className="w-5 h-5 text-blue-700" />
            <input
              type="url"
              value={config.social_media?.linkedin || ''}
              onChange={(e) => handleChange('social_media', { ...config.social_media, linkedin: e.target.value })}
              className="flex-1 rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              placeholder="LinkedIn URL"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Twitter className="w-5 h-5 text-blue-400" />
            <input
              type="url"
              value={config.social_media?.twitter || ''}
              onChange={(e) => handleChange('social_media', { ...config.social_media, twitter: e.target.value })}
              className="flex-1 rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              placeholder="Twitter URL"
            />
          </div>
        </div>
      </div>

      {/* PIX Configuration */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Configuração do PIX</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Tipo de Chave PIX
            </label>
            <select
              value={config.pix_key?.type || ''}
              onChange={(e) => handleChange('pix_key', { 
                ...config.pix_key,
                type: e.target.value as 'cnpj' | 'email' | 'phone' | 'random'
              })}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              <option value="">Selecione...</option>
              <option value="cnpj">CNPJ</option>
              <option value="email">E-mail</option>
              <option value="phone">Telefone</option>
              <option value="random">Chave Aleatória</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Chave PIX
            </label>
            <input
              type="text"
              value={config.pix_key?.key || ''}
              onChange={(e) => handleChange('pix_key', { 
                ...config.pix_key,
                key: e.target.value
              })}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* System Settings */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Configurações do Sistema</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Moeda
            </label>
            <select
              value={config.currency || 'BRL'}
              onChange={(e) => handleChange('currency', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              <option value="BRL">BRL (R$)</option>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
            </select>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="require_auth"
              checked={config.require_auth || false}
              onChange={(e) => handleChange('require_auth', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="require_auth" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              Exigir autenticação
            </label>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className={`flex items-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
            loading ? 'opacity-75 cursor-not-allowed' : ''
          }`}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Salvando...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Salvar Configurações
            </>
          )}
        </button>
      </div>
    </form>
  );

  return (
    <div className="p-6">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Configurações
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Gerencie todas as configurações do sistema
        </p>
      </header>

      <nav className="flex space-x-4 mb-8">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`py-2 px-1 border-b-2 ${
              activeTab === tab.id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <div className="space-y-6">
        {activeTab === 'organization' && (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              Configurações da Organização
            </h2>
            {renderOrganizationForm()}
          </div>
        )}

        {activeTab === 'subscription' && (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            {/* Early Access Banner */}
            <div className="mb-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-6 text-white">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <Star className="w-8 h-8" />
                  <div>
                    <h2 className="text-xl font-semibold">Early Access Offer!</h2>
                    <p className="text-white/90">
                      Be one of our first 50 users and get a lifetime discount.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg">
                  <span className="font-semibold text-2xl">{50 - earlyUsersCount}</span>
                  <span className="text-sm">spots remaining</span>
                </div>
              </div>
            </div>

            {/* Billing Toggle */}
            <div className="flex justify-center mb-8">
              <div className="bg-gray-100 dark:bg-gray-700 p-1 rounded-lg inline-flex items-center">
                <button
                  onClick={() => setIsAnnual(false)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    !isAnnual 
                      ? 'bg-white dark:bg-gray-600 shadow-sm' 
                      : 'text-gray-600 dark:text-gray-400'
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setIsAnnual(true)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    isAnnual 
                      ? 'bg-white dark:bg-gray-600 shadow-sm' 
                      : 'text-gray-600 dark:text-gray-400'
                  }`}
                >
                  Annual
                  <span className="ml-1 text-xs text-green-600 dark:text-green-400">
                    Save 33%
                  </span>
                </button>
              </div>
            </div>

            {/* Plan Cards */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Free Plan */}
              <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold mb-2">Free</h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Basic features for small businesses
                  </p>
                </div>

                <div className="mb-6">
                  <div className="text-3xl font-bold">$0</div>
                  <div className="text-gray-600 dark:text-gray-400">Forever free</div>
                </div>

                <ul className="space-y-4 mb-8">
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-600" />
                    <span>Basic business management</span>
                  </li>
                  <li className="flex items-center gap-3 text-gray-500">
                    <X className="w-5 h-5 text-red-600" />
                    <span>No cloud backup</span>
                  </li>
                  <li className="flex items-center gap-3 text-gray-500">
                    <X className="w-5 h-5 text-red-600" />
                    <span>No business intelligence</span>
                  </li>
                  <li className="flex items-center gap-3 text-gray-500">
                    <X className="w-5 h-5 text-red-600" />
                    <span>No scheduling features</span>
                  </li>
                </ul>

                <button
                  onClick={() => handleSubscribe('free')}
                  className="w-full py-2 px-4 border-2 border-gray-300 dark:border-gray-600 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  Current Plan
                </button>
              </div>

              {/* Premium Plan */}
              <div className="bg-gradient-to-b from-blue-600 to-purple-600 rounded-xl shadow-lg p-[2px]">
                <div className="bg-white dark:bg-gray-900 rounded-[calc(0.75rem-2px)] p-8 h-full">
                  <div className="mb-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-2xl font-bold mb-2">Premium</h2>
                        <p className="text-gray-600 dark:text-gray-400">
                          Full features for growing businesses
                        </p>
                      </div>
                      <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
                        <Star className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-baseline gap-2">
                      <div className="text-3xl font-bold">${currentPrice}</div>
                      <div className="text-gray-600 dark:text-gray-400">
                        /{isAnnual ? 'year' : 'month'}
                      </div>
                    </div>
                    {earlyUsersCount < 50 && (
                      <div className="flex items-center gap-1 text-green-600 dark:text-green-400 text-sm mt-2">
                        <AlertTriangle className="w-4 h-4" />
                        <span>Early user price - Lock in this rate!</span>
                      </div>
                    )}
                  </div>

                  <ul className="space-y-4 mb-8">
                    <li className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-green-600" />
                      <span>All Free features</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Cloud className="w-5 h-5 text-blue-600" />
                      <span>Cloud backup included</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Brain className="w-5 h-5 text-purple-600" />
                      <span>Business Intelligence analytics</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-indigo-600" />
                      <span>Advanced scheduling</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Star className="w-5 h-5 text-yellow-600" />
                      <span>Priority support</span>
                    </li>
                  </ul>

                  <button
                    onClick={() => handleSubscribe('premium')}
                    className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <CreditCard className="w-5 h-5" />
                    Subscribe Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'integrations' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Integrações
            </h2>

            <div className="space-y-4">
              <div className="border dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      Google Sheets
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Sincronize seus dados com o Google Sheets
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="google_sync_enabled"
                        checked={config.google_sync_enabled || false}
                        onChange={(e) => handleChange('google_sync_enabled', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="google_sync_enabled" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                        Ativar sincronização
                      </label>
                    </div>
                    <button
                      onClick={handleGoogleSheetsSync}
                      disabled={isSyncing || !config.google_sync_enabled}
                      className={`
                        inline-flex items-center px-4 py-2 rounded-lg
                        ${isSyncing || !config.google_sync_enabled
                          ? 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed text-gray-500'
                          : 'bg-blue-600 hover:bg-blue-700 text-white'}
                        transition-colors duration-200
                      `}
                    >
                      {isSyncing ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Sincronizando...
                        </>
                      ) : (
                        <>
                          <CloudCog className="w-4 h-4 mr-2" />
                          Sincronizar Agora
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {syncMessage && (
                  <div className={`mt-3 p-3 rounded-lg text-sm
                    ${syncMessage.type === 'success'
                      ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                      : 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                    }`}
                  >
                    {syncMessage.text}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'reset' && (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Resetar Sistema</h2>
            <p className="text-gray-600 mb-6">
              Atenção: Esta ação irá apagar todos os dados do sistema e não pode ser desfeita.
            </p>
            <button
              onClick={() => setIsResetDialogOpen(true)}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Reset
            </button>
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={isResetDialogOpen}
        onClose={() => setIsResetDialogOpen(false)}
        onConfirm={handleResetSystem}
        title="Resetar Sistema"
        message="Tem certeza que deseja resetar o sistema? Todos os dados serão perdidos e esta ação não pode ser desfeita."
        confirmText="Resetar"
        cancelText="Cancelar"
        type="danger"
      />
    </div>
  );
}

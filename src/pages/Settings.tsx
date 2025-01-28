import React, { useState, useEffect } from 'react';
import { Save, Loader2, CloudCog, Wand2, RotateCcw } from 'lucide-react';
import { systemConfigService } from '../services/systemConfigService';
import { googleSheetsService } from '../services/googleSheets.service';
import { SystemConfig } from '../model/types';
import { useAuth } from '../contexts/AuthContext';
import { showConfirmDialog } from '../utils/confirmDialog';
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
  
  const [config, setConfig] = useState<Partial<SystemConfig>>({});
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const { organizationType, updateOrganizationType } = useAuth();
  const navigate = useNavigate();

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
        
        // Aguarda um momento para que o toast seja exibido antes do refresh
        setTimeout(() => {
          window.location.reload(); // Faz o refresh da aplicação
        }, 1000); // 1 segundo de atraso
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

  const handleChange = (field: keyof SystemConfig, value: any) => {
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

  const tabs = [
    { id: 'organization', label: 'Organização' },
    { id: 'integrations', label: 'Integrações' },
    { id: 'reset', label: 'Resetar Sistema' }
  ];

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
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Tipo de Organização
                </label>
                <select
                  value={config.organization_type || 'profit'}
                  onChange={(e) => handleChange('organization_type', e.target.value as 'profit' | 'nonprofit')}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                >
                  <option value="profit">Com fins lucrativos</option>
                  <option value="nonprofit">Sem fins lucrativos</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Nome da Organização
                </label>
                <input
                  type="text"
                  value={config.organization_name || ''}
                  onChange={(e) => handleChange('organization_name', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>

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

              {appConfig.isDevelopment && !config.is_configured && (
                <button
                  type="button"
                  onClick={() => navigate('/setup')}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  <Wand2 className="w-4 h-4 mr-2" />
                  Executar Wizard de Configuração
                </button>
              )}

              <button
                type="submit"
                disabled={loading}
                className={`ml-auto flex right items-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
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
            </form>
          </div>
        )}

      </div>

      <div className="space-y-4">
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
      </div>

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
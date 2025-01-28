import { useState, useEffect } from 'react';
import { systemConfigService } from '../services/systemConfigService';

export function useOrganizationType() {
  const [isProfit, setIsProfit] = useState(true);
  
  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    const config = await systemConfigService.getConfig();
    setIsProfit(config?.organization_type === 'profit');
  };

  return isProfit;
} 
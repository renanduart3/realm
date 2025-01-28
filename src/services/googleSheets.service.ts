export const googleSheetsService = {
  exportDataToGoogleSheets: async () => {
    try {
      // Aqui você implementará a lógica de exportação
      const response = await fetch('/api/export-to-sheets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Falha na exportação');
      }

      return { success: true, message: 'Dados exportados com sucesso!' };
    } catch (error) {
      console.error('Erro na exportação:', error);
      throw error;
    }
  }
}; 
import { useState, useCallback } from 'react';
import { scanAPI, ScanResult } from '../services/scanAPI';

interface UseScanState {
  loading: boolean;
  progress: number;
  error: string | null;
  results: ScanResult | null;
}

export function useEmailScan() {
  const [state, setState] = useState<UseScanState>({
    loading: false,
    progress: 0,
    error: null,
    results: null,
  });

  const uploadAndScan = useCallback(async (file: File) => {
    setState({
      loading: true,
      progress: 0,
      error: null,
      results: null,
    });

    try {
      const results = await scanAPI.uploadMboxFile(file, (progress) => {
        setState(prev => ({
          ...prev,
          progress: Math.round(progress),
        }));
      });

      setState({
        loading: false,
        progress: 100,
        error: null,
        results,
      });

      return results;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setState({
        loading: false,
        progress: 0,
        error: errorMessage,
        results: null,
      });
      throw error;
    }
  }, []);

  const reset = useCallback(() => {
    setState({
      loading: false,
      progress: 0,
      error: null,
      results: null,
    });
  }, []);

  return {
    ...state,
    uploadAndScan,
    reset,
  };
}

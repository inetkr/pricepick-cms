import { useEffect, useState } from 'react';
import { pointAPI } from 'src/api';
import type { IConversionRates } from 'src/types/points/conversion_rate';

export const useConversionRates = () => {
  const [conversionRates, setConversionRates] = useState<IConversionRates | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadConversionRates = async () => {
    setIsLoading(true);
    try {
      const responseData = await pointAPI.getConversionRates();
      const value = responseData?.result?.object;
      if (value) {
        setConversionRates(value);
      }
    } catch (error) {
      console.error('Failed to load conversion rates:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadConversionRates();
  }, []);

  return { conversionRates, isLoading, reload: loadConversionRates };
};

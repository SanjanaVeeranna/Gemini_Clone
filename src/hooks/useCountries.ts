import { useState, useEffect } from 'react';
import type { Country } from '../types';

export const useCountries = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://restcountries.com/v3.1/all?fields=name,idd,flag,cca2');
        const data = await response.json();
        
        const validCountries = data.filter((country: any) => 
          country.idd?.root && country.idd?.suffixes?.length > 0
        );

        setCountries(validCountries);
      } catch (err) {
        setError('Failed to fetch countries');
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  return { countries, loading, error };
};
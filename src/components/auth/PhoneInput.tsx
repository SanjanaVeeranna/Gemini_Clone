import React, { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { phoneSchema, type PhoneFormData } from '../../schemas/authSchema';
import { useCountries } from '../../hooks/useCountries';
import { useAuthStore } from '../../store/authStore';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { generateOTP } from '../../utils/helpers';
import { ChevronDown, Search, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface PhoneInputProps {
  onOtpSent: (phone: string, countryCode: string) => void;
}

export const PhoneInput: React.FC<PhoneInputProps> = ({ onOtpSent }) => {
  const { countries, loading: countriesLoading } = useCountries();
  const { isLoading, setLoading, setOtpSent } = useAuthStore();
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<any>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<PhoneFormData>({
    resolver: zodResolver(phoneSchema),
    defaultValues: {
      countryCode: '',
    },
  });

  // Filter countries based on search query
  const filteredCountries = countries
    .filter(country => 
      country.name.common.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => a.name.common.localeCompare(b.name.common));

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isDropdownOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isDropdownOpen]);

  const handleCountrySelect = (country: any) => {
    const countryCode = `${country.idd.root}${country.idd.suffixes[0]}`;
    setSelectedCountry(country);
    setValue('countryCode', countryCode);
    setIsDropdownOpen(false);
    setSearchQuery('');
  };

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
    setSearchQuery('');
  };

  const clearSelection = () => {
    setSelectedCountry(null);
    setValue('countryCode', '');
    setSearchQuery('');
  };

  const onSubmit = async (data: PhoneFormData) => {
    try {
      setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const otp = generateOTP();
      console.log('Generated OTP:', otp); // For testing purposes
      
      // Store OTP in localStorage for validation
      localStorage.setItem('currentOTP', otp);
      localStorage.setItem('otpExpiry', (Date.now() + 300000).toString());
      
      setOtpSent(true);
      onOtpSent(data.phone, data.countryCode);
      
      toast.success(`OTP sent to ${data.countryCode}${data.phone}`);
    } catch (error) {
      toast.error('Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (countriesLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Country Selector */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Country
        </label>
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={handleDropdownToggle}
            className={`
              w-full px-3 py-2 border rounded-lg shadow-sm text-left
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
              ${errors.countryCode 
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                : 'border-gray-300 dark:border-gray-600'
              }
              dark:bg-gray-700 dark:text-white
              flex items-center justify-between
            `}
          >
            {selectedCountry ? (
              <div className="flex items-center">
                <span className="mr-2">{selectedCountry.flag}</span>
                <span className="truncate">
                  {selectedCountry.name.common} ({selectedCountry.idd.root}{selectedCountry.idd.suffixes[0]})
                </span>
              </div>
            ) : (
              <span className="text-gray-500 dark:text-gray-400">Select Country</span>
            )}
            <div className="flex items-center">
              {selectedCountry && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    clearSelection();
                  }}
                  className="mr-2 p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                >
                  <X size={16} className="text-gray-400" />
                </button>
              )}
              <ChevronDown 
                size={16} 
                className={`text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} 
              />
            </div>
          </button>

          {/* Dropdown */}
          {isDropdownOpen && (
            <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-hidden">
              {/* Search Input */}
              <div className="p-3 border-b border-gray-200 dark:border-gray-600">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search countries..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:text-white dark:placeholder-gray-400"
                  />
                </div>
              </div>

              {/* Countries List */}
              <div className="max-h-48 overflow-y-auto">
                {filteredCountries.length === 0 ? (
                  <div className="p-3 text-center text-gray-500 dark:text-gray-400">
                    No countries found
                  </div>
                ) : (
                  filteredCountries.map((country) => (
                    <button
                      key={country.cca2}
                      type="button"
                      onClick={() => handleCountrySelect(country)}
                      className="w-full px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-600 flex items-center"
                    >
                      <span className="mr-3">{country.flag}</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {country.name.common}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {country.idd.root}{country.idd.suffixes[0]}
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
        {errors.countryCode && (
          <p className="text-sm text-red-600 dark:text-red-400">
            {errors.countryCode.message}
          </p>
        )}
      </div>

      {/* Phone Number Input */}
      <Input
        label="Phone Number"
        type="tel"
        placeholder="Enter your phone number"
        error={errors.phone?.message}
        {...register('phone')}
      />

      <Button
        type="submit"
        loading={isLoading}
        fullWidth
        className="mt-6"
      >
        Send OTP
      </Button>
    </form>
  );
};
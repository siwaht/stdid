import { useState, useCallback } from 'react';
import { insertIdCardSchema } from '@shared/schema';
import { ZodError } from 'zod';

export interface IdCardData {
  universityName: string;
  studentName: string;
  studentId: string;
  dateOfBirth: string;
  phone: string;
  department: string;
  address: string;
  academicYear: string;
  photo?: string;
}

export interface ValidationErrors {
  [key: string]: string;
}

export function useIdCard() {
  const [cardData, setCardData] = useState<IdCardData>({
    universityName: 'Guru Gobind Singh Indraprastha University',
    studentName: 'ANIL KUMAR',
    studentId: '9199-8219',
    dateOfBirth: 'March 10, 2004',
    phone: '+91 808270026',
    department: 'Computer Science',
    address: '3448, Hans Puri Rd, Rampura',
    academicYear: '2024-2025',
  });

  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

  const validateField = useCallback((field: keyof IdCardData, value: string) => {
    try {
      const validationData = { ...cardData, [field]: value };
      insertIdCardSchema.parse(validationData);
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
      return true;
    } catch (error) {
      if (error instanceof ZodError) {
        const fieldError = error.errors.find(err => err.path.includes(field));
        if (fieldError) {
          setValidationErrors(prev => ({
            ...prev,
            [field]: fieldError.message
          }));
        }
      }
      return false;
    }
  }, [cardData]);

  const validateAllFields = useCallback(() => {
    try {
      insertIdCardSchema.parse(cardData);
      setValidationErrors({});
      return true;
    } catch (error) {
      if (error instanceof ZodError) {
        const errors: ValidationErrors = {};
        error.errors.forEach(err => {
          if (err.path.length > 0) {
            errors[err.path[0] as string] = err.message;
          }
        });
        setValidationErrors(errors);
      }
      return false;
    }
  }, [cardData]);

  const updateField = useCallback((field: keyof IdCardData, value: string) => {
    setCardData(prev => ({
      ...prev,
      [field]: value
    }));
    validateField(field, value);
  }, [validateField]);

  const setPhoto = useCallback((photo: string) => {
    setCardData(prev => ({
      ...prev,
      photo
    }));
  }, []);

  const removePhoto = useCallback(() => {
    setCardData(prev => ({
      ...prev,
      photo: undefined
    }));
  }, []);

  const resetForm = useCallback(() => {
    setCardData({
      universityName: '',
      studentName: '',
      studentId: '',
      dateOfBirth: '',
      phone: '',
      department: '',
      address: '',
      academicYear: '',
      photo: undefined,
    });
    setValidationErrors({});
  }, []);

  return {
    cardData,
    validationErrors,
    updateField,
    setPhoto,
    removePhoto,
    resetForm,
    validateAllFields,
    isValid: Object.keys(validationErrors).length === 0
  };
}

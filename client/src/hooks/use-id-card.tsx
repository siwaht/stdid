import { useState, useCallback } from 'react';

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

  const updateField = useCallback((field: keyof IdCardData, value: string) => {
    setCardData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

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
  }, []);

  return {
    cardData,
    updateField,
    setPhoto,
    removePhoto,
    resetForm
  };
}

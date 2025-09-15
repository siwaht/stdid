import { useState, useCallback, useEffect } from 'react';
import { cardTemplates, getTemplateById, CardTemplate, CardField, colorThemes } from '@/lib/card-templates';

export interface TemplateCardData {
  [key: string]: string;
}

export function useCardTemplate() {
  const [selectedTemplate, setSelectedTemplate] = useState<CardTemplate>(cardTemplates[0]);
  const [cardData, setCardData] = useState<TemplateCardData>({});
  const [selectedTheme, setSelectedTheme] = useState(cardTemplates[0].design.theme);
  const [photo, setPhoto] = useState<string | undefined>();

  // Initialize card data when template changes
  useEffect(() => {
    const initialData: TemplateCardData = {};
    selectedTemplate.fields.forEach(field => {
      initialData[field.key] = '';
    });
    setCardData(initialData);
    setSelectedTheme(selectedTemplate.design.theme);
  }, [selectedTemplate]);

  const selectTemplate = useCallback((templateId: string) => {
    const template = getTemplateById(templateId);
    if (template) {
      setSelectedTemplate(template);
    }
  }, []);

  const updateField = useCallback((fieldKey: string, value: string) => {
    setCardData(prev => ({
      ...prev,
      [fieldKey]: value
    }));
  }, []);

  const changeTheme = useCallback((themeName: string) => {
    setSelectedTheme(themeName);
  }, []);

  const resetCard = useCallback(() => {
    const initialData: TemplateCardData = {};
    selectedTemplate.fields.forEach(field => {
      initialData[field.key] = '';
    });
    setCardData(initialData);
    setPhoto(undefined);
  }, [selectedTemplate]);

  const getCurrentTheme = useCallback(() => {
    return colorThemes[selectedTheme as keyof typeof colorThemes] || colorThemes[selectedTemplate.design.theme as keyof typeof colorThemes];
  }, [selectedTheme, selectedTemplate]);

  return {
    templates: cardTemplates,
    selectedTemplate,
    cardData,
    photo,
    selectedTheme,
    currentTheme: getCurrentTheme(),
    selectTemplate,
    updateField,
    changeTheme,
    setPhoto,
    resetCard,
    colorThemes,
  };
}
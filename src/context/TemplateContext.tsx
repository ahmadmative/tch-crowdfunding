import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Template {
  _id: string;
  name: string;
  subject: string;
  body: string;
  createdAt: string;
  // Add other template properties as needed
}

interface TemplateContextType {
  selectedTemplate: Template | null;
  setSelectedTemplate: (template: Template | null) => void;
}

const TemplateContext = createContext<TemplateContextType | undefined>(undefined);

export const TemplateProvider = ({ children }: { children: ReactNode }) => {
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);

  return (
    <TemplateContext.Provider value={{ selectedTemplate, setSelectedTemplate }}>
      {children}
    </TemplateContext.Provider>
  );
};

export const useTemplate = () => {
  const context = useContext(TemplateContext);
  if (context === undefined) {
    throw new Error('useTemplate must be used within a TemplateProvider');
  }
  return context;
};
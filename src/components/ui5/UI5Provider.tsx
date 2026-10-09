'use client';

import React, { ReactNode } from 'react';
import { ThemeProvider } from '@ui5/webcomponents-react';

export default function UI5Provider({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      {children}
    </ThemeProvider>
  );
}

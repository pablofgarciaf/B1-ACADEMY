"use client";

import React from 'react';
import { DemoFioriApp } from '../fiori/DemoFioriApp';

interface SimulatorProps {
  trackCode: string;
  submoduleCode: string;
}

export function InteractiveSimulator({ trackCode, submoduleCode }: SimulatorProps) {
  // Temporary bypass to show the new Fiori UI
  return <DemoFioriApp />;
}

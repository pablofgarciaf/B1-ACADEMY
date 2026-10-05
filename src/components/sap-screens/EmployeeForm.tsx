'use client';
import { useCompany } from '@/hooks/useCompany';
import type { CommandData } from '@/lib/company-commands';
import { today } from '@/lib/company-calculations';
import { MasterForm, type FieldDefinition } from './SAPControls';
export default function EmployeeForm() {
  const c = useCompany();
  const initial: CommandData<'employee'> = { firstName: '', lastName: '', identification: '', position: '', department: '', hireDate: today(), contract: 'indefinite', schedule: 'full', baseSalary: 460, employerRate: 12.15, personalRate: 9.45, thirteenthMonthly: false, fourteenthMonthly: false, reserveMonthly: true, vacationDays: 15, active: true };
  const fields: FieldDefinition<typeof initial>[] = [
    { key: 'firstName', label: 'Nombres', required: true }, { key: 'lastName', label: 'Apellidos', required: true }, { key: 'identification', label: 'Cédula ficticia (10 dígitos)', required: true }, { key: 'position', label: 'Cargo' }, { key: 'department', label: 'Área' }, { key: 'hireDate', label: 'Fecha ingreso', kind: 'date', required: true }, { key: 'active', label: 'Activo', kind: 'checkbox' },
    { key: 'contract', label: 'Contrato (escenario educativo)', kind: 'select', tab: 'Laboral', options: [{ value: 'indefinite', label: 'Indefinido' }, { value: 'fixed', label: 'Plazo fijo · ejercicio histórico' }, { value: 'fees', label: 'Honorarios · fuera de nómina' }] }, { key: 'schedule', label: 'Jornada', kind: 'select', tab: 'Laboral', options: [{ value: 'full', label: 'Completa' }, { value: 'partial', label: 'Parcial' }] }, { key: 'baseSalary', label: 'Salario mensual pactado USD', kind: 'number', required: true, tab: 'Laboral' }, { key: 'employerRate', label: 'IESS patronal % (parámetro didáctico)', kind: 'number', max: 100, tab: 'Laboral' }, { key: 'personalRate', label: 'IESS personal %', kind: 'number', max: 100, tab: 'Laboral' },
    { key: 'thirteenthMonthly', label: 'Décimo tercero mensualizado (si no, provisionar)', kind: 'checkbox', tab: 'Beneficios' }, { key: 'fourteenthMonthly', label: 'Décimo cuarto mensualizado (si no, provisionar)', kind: 'checkbox', tab: 'Beneficios' }, { key: 'reserveMonthly', label: 'Fondos de reserva pagados (desde segundo año)', kind: 'checkbox', tab: 'Beneficios' }, { key: 'vacationDays', label: 'Vacaciones anuales (días)', kind: 'number', tab: 'Beneficios' },
  ];
  return <MasterForm title="Ficha de empleado · Parámetros del ejercicio 2024" initial={initial} fields={fields} records={c.data.employees} onSave={data => c.save({ action: 'employee', data })} />;
}

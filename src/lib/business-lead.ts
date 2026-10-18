import { z } from 'zod';

export const businessLeadSchema = z.object({
  requestId: z.string().uuid(),
  company: z.string().trim().min(2).max(120),
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().toLowerCase().email().max(254).or(z.literal('')).optional(),
  phone: z.string().trim().regex(/^[+\d ()-]{7,25}$/).or(z.literal('')).optional().refine(v => !v || (v.replace(/\D/g,'').length>=7 && v.replace(/\D/g,'').length<=15), 'Revisa el teléfono.'),
  teamSize: z.coerce.number().int().min(1).max(10000),
  needs: z.string().trim().min(10).max(2000),
  privacyAccepted: z.literal(true),
  policyVersion: z.string().min(1).max(100),
  marketingConsent: z.boolean().default(false),
  website: z.string().max(0).optional(),
}).refine(d => Boolean(d.email || d.phone), { message: 'Indica correo o teléfono.', path: ['email'] });

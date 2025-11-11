import { z } from 'zod'

export const step2Schema = z.object({
  driverLicenseNumber: z
    .string()
    .min(11, 'CNH deve ter 11 dígitos')
    .regex(/^\d{11}$/, 'CNH deve conter apenas números'),
  driverLicenseIssueDate: z
    .string()
    .min(1, 'Data de emissão é obrigatória')
    .regex(/^\d{2}\/\d{2}\/\d{4}$/, 'Data deve estar no formato DD/MM/AAAA'),
  driverLicenseCategory: z.string().min(1, 'Categoria da CNH é obrigatória'),
  isMainDriver: z.enum(['yes', 'no'], {
    required_error: 'Informe se é o principal condutor',
  }),
  profession: z
    .string()
    .min(3, 'Profissão deve ter pelo menos 3 caracteres')
    .max(50, 'Profissão não pode ter mais de 50 caracteres'),
  zipCode: z
    .string()
    .min(1, 'CEP é obrigatório')
    .regex(/^\d{5}-\d{3}$/, 'CEP deve estar no formato 12345-678'),
})

export const step3Schema = z.object({
  plate: z
    .string()
    .min(1, 'Placa é obrigatória')
    .regex(
      /^[A-Z]{3}-?\d{4}$|^[A-Z]{3}\d[A-Z]\d{2}$/,
      'Formato de placa inválido'
    ),
  brand: z.string().min(1, 'Marca é obrigatória'),
  model: z.string().min(1, 'Modelo é obrigatório'),
  manufacturingYear: z
    .string()
    .min(4, 'Ano de fabricação é obrigatório')
    .refine((val) => {
      const year = Number(val)
      return year >= 1900 && year <= new Date().getFullYear()
    }, 'Ano de fabricação inválido'),
  modelYear: z
    .string()
    .min(4, 'Ano do modelo é obrigatório')
    .refine((val) => {
      const year = Number(val)
      return year >= 1900 && year <= new Date().getFullYear() + 1
    }, 'Ano do modelo inválido'),
  fuelType: z.string().min(1, 'Tipo de combustível é obrigatório'),
  currentMileage: z
    .string()
    .min(1, 'Quilometragem é obrigatória')
    .refine((val) => !isNaN(Number(val)), 'Quilometragem deve ser um número')
    .refine(
      (val) => Number(val) >= 0 && Number(val) <= 9999999,
      'Quilometragem inválida'
    ),
  hasTracker: z.enum(['yes', 'no'], {
    required_error: 'Informe se possui rastreador',
  }),
  hasAlarm: z.enum(['yes', 'no'], {
    required_error: 'Informe se possui alarme',
  }),
  vehicleUsage: z.string().min(1, 'Uso do veículo é obrigatório'),
})

export type Step2Data = z.infer<typeof step2Schema>
export type Step3Data = z.infer<typeof step3Schema>

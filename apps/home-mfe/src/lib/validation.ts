import { z } from 'zod'

export const step2Schema = z.object({
  ownershipStatus: z.string().min(1, 'Condição do imóvel é obrigatória'),
  numberOfResidents: z
    .string()
    .min(1, 'Número de moradores é obrigatório')
    .refine((val) => !isNaN(Number(val)), 'Deve ser um número')
    .refine(
      (val) => Number(val) >= 1 && Number(val) <= 20,
      'Número de moradores inválido'
    ),
  hasPets: z.enum(['yes', 'no'], {
    required_error: 'Informe se possui animais de estimação',
  }),
  isPrimaryResidence: z.enum(['yes', 'no'], {
    required_error: 'Informe se é residência principal',
  }),
  profession: z
    .string()
    .min(3, 'Profissão deve ter pelo menos 3 caracteres')
    .max(50, 'Profissão não pode ter mais de 50 caracteres'),
  monthlyIncome: z
    .string()
    .min(1, 'Renda mensal é obrigatória')
    .refine((val) => !isNaN(Number(val)), 'Renda deve ser um número')
    .refine((val) => Number(val) > 0, 'Renda deve ser maior que zero'),
})

export const step3Schema = z.object({
  postalCode: z
    .string()
    .min(1, 'CEP é obrigatório')
    .regex(/^\d{5}-\d{3}$/, 'CEP deve estar no formato 12345-678'),
  propertyType: z.string().min(1, 'Tipo de imóvel é obrigatório'),
  constructionType: z.string().min(1, 'Tipo de construção é obrigatório'),
  totalArea: z
    .string()
    .min(1, 'Área total é obrigatória')
    .refine((val) => !isNaN(Number(val)), 'Área deve ser um número')
    .refine(
      (val) => Number(val) >= 20 && Number(val) <= 10000,
      'Área deve estar entre 20 e 10.000 m²'
    ),
  numberOfRooms: z
    .string()
    .min(1, 'Número de cômodos é obrigatório')
    .refine((val) => !isNaN(Number(val)), 'Deve ser um número')
    .refine(
      (val) => Number(val) >= 1 && Number(val) <= 50,
      'Número de cômodos inválido'
    ),
  constructionYear: z
    .string()
    .min(4, 'Ano de construção é obrigatório')
    .refine((val) => {
      const year = Number(val)
      return year >= 1900 && year <= new Date().getFullYear()
    }, 'Ano de construção inválido'),
  neighborhoodRisk: z.string().min(1, 'Classificação do bairro é obrigatória'),
  hasAlarm: z.enum(['yes', 'no'], {
    required_error: 'Informe se possui alarme',
  }),
  hasSecurityCameras: z.enum(['yes', 'no'], {
    required_error: 'Informe se possui câmeras de segurança',
  }),
  isGatedCommunity: z.enum(['yes', 'no'], {
    required_error: 'Informe se é condomínio fechado',
  }),
  estimatedValue: z
    .string()
    .min(1, 'Valor estimado é obrigatório')
    .refine((val) => !isNaN(Number(val)), 'Valor deve ser um número')
    .refine((val) => Number(val) >= 50000, 'Valor mínimo é R$ 50.000'),
})

export type Step2Data = z.infer<typeof step2Schema>
export type Step3Data = z.infer<typeof step3Schema>

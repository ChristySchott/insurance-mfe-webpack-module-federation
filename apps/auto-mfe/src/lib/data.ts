export const BRANDS = [
  'Chevrolet',
  'Fiat',
  'Ford',
  'Honda',
  'Hyundai',
  'Nissan',
  'Renault',
  'Toyota',
  'Volkswagen',
]

export const MODELS_BY_BRAND: Record<string, string[]> = {
  Chevrolet: ['Onix', 'Tracker', 'S10', 'Cruze'],
  Fiat: ['Argo', 'Mobi', 'Toro', 'Strada'],
  Ford: ['Ka', 'Ranger', 'EcoSport', 'Territory'],
  Honda: ['Civic', 'HR-V', 'Fit', 'City'],
  Hyundai: ['HB20', 'Creta', 'Tucson', 'Santa Fe'],
  Nissan: ['Kicks', 'Versa', 'Frontier', 'Sentra'],
  Renault: ['Kwid', 'Sandero', 'Duster', 'Oroch'],
  Toyota: ['Corolla', 'Hilux', 'Yaris', 'SW4'],
  Volkswagen: ['Gol', 'Polo', 'T-Cross', 'Amarok'],
}

export const FUEL_TYPES = [
  { value: 'gasoline', label: 'Gasolina' },
  { value: 'ethanol', label: 'Etanol' },
  { value: 'flex', label: 'Flex (Gasolina/Etanol)' },
  { value: 'diesel', label: 'Diesel' },
  { value: 'electric', label: 'Elétrico' },
  { value: 'hybrid', label: 'Híbrido' },
]

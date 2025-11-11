import { StepWizard } from './components/StepWizard'

export default function App() {
  return (
    <div className="min-h-screen bg-linear-to-br from-primary-50 to-blue-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-primary-600">Multicotador</h1>
          <p className="text-gray-600 mt-1">Cote um seguro em minutos</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <StepWizard />
      </main>
    </div>
  )
}

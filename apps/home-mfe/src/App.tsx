export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Products MFE</h1>
        <p className="text-gray-600">Este é um Micro Frontend independente.</p>
        <p className="text-sm text-gray-500 mt-4">
          Os componentes são carregados pelo Host via Module Federation.
        </p>
      </div>
    </div>
  )
}

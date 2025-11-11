interface LoadingSpinnerProps {
  message?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'primary' | 'secondary'
}

export function LoadingSpinner({
  message = 'Carregando...',
  size = 'md',
  variant = 'primary',
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-6 h-6 border-2',
    md: 'w-10 h-10 border-4',
    lg: 'w-16 h-16 border-4',
  }

  const colorClasses = {
    primary: 'border-blue-600 border-t-transparent',
    secondary: 'border-gray-600 border-t-transparent',
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-col items-center justify-center gap-3"
    >
      <div
        className={`
          ${sizeClasses[size]} 
          ${colorClasses[variant]}
          rounded-full 
          animate-spin
        `}
      />
      {message && <p className="text-sm text-gray-600">{message}</p>}
      <span className="sr-only">{message}</span>
    </div>
  )
}

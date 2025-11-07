import { useState } from 'react';
import TransactionForm from './components/TransactionForm';
import SuccessMessage from './components/SuccessMessage';
import ErrorMessage from './components/ErrorMessage';

function App() {
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSuccess = (message: string) => {
    setSuccess(message);
    setError(null);
  };

  const handleError = (message: string) => {
    setError(message);
    setSuccess(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Formulario de Transacción
          </h1>
          <p className="text-gray-600">
            Complete el formulario para enviar una nueva transacción
          </p>
        </header>

        {success && (
          <SuccessMessage message={success} onClose={() => setSuccess(null)} />
        )}

        {error && (
          <ErrorMessage message={error} onClose={() => setError(null)} />
        )}

        <TransactionForm
          onSuccess={handleSuccess}
          onError={handleError}
        />
      </div>
    </div>
  );
}

export default App;


import React from 'react';

const ErrorBoundary = ({ children }) => {
    const [hasError, setHasError] = React.useState(false);
    const [error, setError] = React.useState(null);

    React.useEffect(() => {
        const handleError = (error) => {
            setHasError(true);
            setError(error);
        };

        window.addEventListener('error', handleError);
        window.addEventListener('unhandledrejection', handleError);

        return () => {
            window.removeEventListener('error', handleError);
            window.removeEventListener('unhandledrejection', handleError);
        };
    }, []);

    if (hasError) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
                    <div className="text-6xl mb-4">⚠️</div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Something went wrong</h2>
                    <p className="text-gray-600 mb-4">
                        An unexpected error occurred. Please refresh the page and try again.
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Refresh Page
                    </button>
                    {process.env.NODE_ENV === 'development' && (
                        <details className="mt-4 text-left">
                            <summary className="cursor-pointer text-gray-500">Error Details</summary>
                            <pre className="mt-2 text-xs text-gray-700 bg-gray-100 p-2 rounded overflow-auto">
                                {error?.toString()}
                            </pre>
                        </details>
                    )}
                </div>
            </div>
        );
    }

    return children;
};

export default ErrorBoundary;

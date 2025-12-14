import React, { useState } from 'react';
import TagInput from './components/TagInput';
import ResultPanel from './components/ResultPanel';

function App() {
    const [tag, setTag] = useState('');
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleValidate = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/validate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tag, mode: 'lenient' })
            });
            const data = await response.json();
            setResults(data);
        } catch (error) {
            console.error('Validation failed', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                        Tag Validator
                    </h1>
                    <p className="mt-4 text-lg text-gray-500">
                        Validate your ad tags against defined rules.
                    </p>
                </div>

                <div className="bg-white shadow rounded-lg p-6 mb-8">
                    <TagInput value={tag} onChange={setTag} />

                    <div className="flex justify-end">
                        <button
                            className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
                            onClick={handleValidate}
                            disabled={loading}
                        >
                            {loading ? 'Validating...' : 'Validate Tag'}
                        </button>
                    </div>
                </div>

                {results && <ResultPanel results={results} />}
            </div>
        </div>
    );
}

export default App;

import React from 'react';

function ResultPanel({ results }) {
    if (!results) return null;

    const { valid, summary, groups } = results;

    // Icons
    const CheckCircleIcon = () => (
        <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    );

    const XCircleIcon = () => (
        <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    );

    const ExclamationIcon = () => (
        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
    );

    const renderTable = (title, groupData) => {
        if (!groupData || groupData.results.length === 0) return null;

        return (
            <div className="mb-8 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-gray-800 flex items-center">
                        {title}
                    </h3>
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${groupData.valid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {groupData.valid ? 'PASSED' : 'FAILED'}
                    </span>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-100">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Requirement</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Description / Message</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Suggestion</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                            {groupData.results.map((result, index) => (
                                <tr key={index} className={`transition-colors duration-150 ${result.status === 'fail' ? 'bg-red-50 hover:bg-red-100' : result.status === 'warning' ? 'bg-amber-50 hover:bg-amber-100' : 'hover:bg-gray-50'}`}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {result.status === 'pass' && (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                                Pass
                                            </span>
                                        )}
                                        {result.status === 'fail' && (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                                                Fail
                                            </span>
                                        )}
                                        {result.status === 'warning' && (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                                                <ExclamationIcon />
                                                Warning
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {result.severity === 'error' ? (
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                                                Required
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                                                Recommended
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <span className="font-mono bg-gray-100 px-2 py-1 rounded text-xs text-gray-600 border border-gray-200" title={`Rule ID: ${result.id}`}>
                                            {result.id.split('_')[0]}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-700">
                                        <div className="font-medium">{result.description}</div>
                                        {result.message && result.message !== result.description && <div className="text-xs mt-1 text-gray-500">{result.message}</div>}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500 italic">{result.suggestion || '-'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    return (
        <div className="mt-8 space-y-8 animate-fade-in">
            {/* Verdict Banner */}
            <div className={`p-6 rounded-xl shadow-sm border-l-4 flex items-center justify-between ${valid ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'}`}>
                <div className="flex items-center">
                    {valid ? <CheckCircleIcon /> : <XCircleIcon />}
                    <div>
                        <h2 className={`text-2xl font-bold ${valid ? 'text-green-800' : 'text-red-800'}`}>
                            {valid ? 'PASSED' : 'FAILED'}
                        </h2>
                        <p className={`text-sm mt-1 ${valid ? 'text-green-700' : 'text-red-700'}`}>
                            {valid ? 'Tag validation successful. No critical errors found.' : 'Tag validation failed. Please fix the errors below.'}
                        </p>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Summary</div>
                    <div className="flex space-x-4 text-sm font-bold">
                        <span className="text-green-600">{summary.passed} Passed</span>
                        <span className="text-red-600">{summary.failed} Failed</span>
                        <span className="text-amber-600">{summary.warnings} Warnings</span>
                    </div>
                </div>
            </div>

            {/* Documentation Links */}
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100 flex items-start">
                <svg className="w-5 h-5 text-blue-500 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <div>
                    <h4 className="text-sm font-bold text-blue-800 mb-1">Need help fixing validation errors?</h4>
                    <p className="text-sm text-blue-700 mb-2">Check our official documentation for detailed specifications:</p>
                    <ul className="list-disc list-inside text-sm text-blue-600 space-y-1">
                        <li>
                            <a href="https://help.pubmatic.com/openwrap/docs/openwrap-ottctv#bidresponse-specification" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-800">
                                OpenWrap OTT/CTV BidResponse Specification
                            </a>
                        </li>
                        <li>
                            <a href="https://wiki.pubmatic.com/confluence/spaces/Products/pages/273843498/Validation+for+Request+Parameters+by+Prebid+Server" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-800">
                                Validation for Request Parameters by Prebid Server
                            </a>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Result Tables */}
            {renderTable("OpenWrap Validation Rules", groups.openwrap)}
            {renderTable("Prebid Validation Rules", groups.prebid)}
        </div>
    );
}

export default ResultPanel;

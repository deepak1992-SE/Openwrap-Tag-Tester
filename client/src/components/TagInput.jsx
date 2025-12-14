import React from 'react';

function TagInput({ value, onChange }) {
    return (
        <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                    Tag / Snippet
                </label>
                <button
                    onClick={() => onChange("https://ow.pubmatic.com/video/vast?site.pub.id=123&site.page=test.com&imp.tagid=abc&req.ext.wrapper.profileid=11133")}
                    className="text-xs text-blue-600 hover:text-blue-800 underline focus:outline-none"
                >
                    Load Example Tag
                </button>
            </div>
            <textarea
                className="w-full h-40 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                placeholder="<script src='...'></script> or JSON config..."
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
            <div className="mt-2 text-xs text-gray-500">
                Paste your tag here. Supports HTML snippets and JSON objects.
            </div>
        </div>
    );
}

export default TagInput;

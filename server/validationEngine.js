const validationEngine = {
    validate: (tag, rules, mode = 'strict') => {
        const results = [];
        let passed = 0;
        let failed = 0;
        let warnings = 0;

        // Basic parsing (heuristic)
        // Assuming tag is a script src or an object.
        // For this demo, we'll treat it as a URL string or a JSON object string.

        let parsedTag = tag;
        let isJson = false;

        try {
            parsedTag = JSON.parse(tag);
            isJson = true;
        } catch (e) {
            // Not JSON, try parsing as URL/Query String
            try {
                const urlObj = new URL(tag);
                const params = Object.fromEntries(urlObj.searchParams);
                parsedTag = unflatten(params);

                // Post-processing for OpenRTB compliance

                // 1. Map 'site.pub.id' to 'site.publisher.id'
                if (parsedTag.site && parsedTag.site.pub && parsedTag.site.pub.id) {
                    if (!parsedTag.site.publisher) parsedTag.site.publisher = {};
                    parsedTag.site.publisher.id = parsedTag.site.pub.id;
                    delete parsedTag.site.pub;
                }

                // 2. Map 'app.pub.id' to 'app.publisher.id'
                if (parsedTag.app && parsedTag.app.pub && parsedTag.app.pub.id) {
                    if (!parsedTag.app.publisher) parsedTag.app.publisher = {};
                    parsedTag.app.publisher.id = parsedTag.app.pub.id;
                    delete parsedTag.app.pub;
                }

                // 3. Ensure 'imp' is an array
                if (parsedTag.imp && !Array.isArray(parsedTag.imp)) {
                    parsedTag.imp = [parsedTag.imp];
                }

                // 3. Process Imp Objects
                if (parsedTag.imp && Array.isArray(parsedTag.imp)) {
                    parsedTag.imp.forEach(i => {
                        // Map 'vid' to 'video'
                        if (i.vid && !i.video) {
                            i.video = i.vid;
                            delete i.vid;
                        }

                        // Convert comma-separated strings to arrays for Video
                        if (i.video) {
                            ['mimes', 'protocols', 'playbackmethod', 'delivery', 'api'].forEach(field => {
                                if (i.video[field] && typeof i.video[field] === 'string') {
                                    i.video[field] = i.video[field].split(',').map(s => {
                                        const num = Number(s);
                                        return isNaN(num) ? s.trim() : num;
                                    });
                                }
                            });
                        }

                        // Auto-generate imp.id if missing (common in URL requests)
                        if (!i.id) {
                            i.id = "1";
                        }
                    });
                }

                isJson = true; // Treat as object for validation
            } catch (urlError) {
                // Maybe just a query string?
                try {
                    const searchParams = new URLSearchParams(tag);
                    const params = Object.fromEntries(searchParams);
                    if (Object.keys(params).length > 0) {
                        parsedTag = unflatten(params);

                        // Post-processing for OpenRTB compliance

                        // 1. Map 'site.pub.id' to 'site.publisher.id'
                        if (parsedTag.site && parsedTag.site.pub && parsedTag.site.pub.id) {
                            if (!parsedTag.site.publisher) parsedTag.site.publisher = {};
                            parsedTag.site.publisher.id = parsedTag.site.pub.id;
                            delete parsedTag.site.pub;
                        }

                        // 2. Map 'app.pub.id' to 'app.publisher.id'
                        if (parsedTag.app && parsedTag.app.pub && parsedTag.app.pub.id) {
                            if (!parsedTag.app.publisher) parsedTag.app.publisher = {};
                            parsedTag.app.publisher.id = parsedTag.app.pub.id;
                            delete parsedTag.app.pub;
                        }

                        // 3. Ensure 'imp' is an array
                        if (parsedTag.imp && !Array.isArray(parsedTag.imp)) {
                            parsedTag.imp = [parsedTag.imp];
                        }

                        // 3. Process Imp Objects
                        if (parsedTag.imp && Array.isArray(parsedTag.imp)) {
                            parsedTag.imp.forEach(i => {
                                // Map 'vid' to 'video'
                                if (i.vid && !i.video) {
                                    i.video = i.vid;
                                    delete i.vid;
                                }

                                // Convert comma-separated strings to arrays for Video
                                if (i.video) {
                                    ['mimes', 'protocols', 'playbackmethod', 'delivery', 'api'].forEach(field => {
                                        if (i.video[field] && typeof i.video[field] === 'string') {
                                            i.video[field] = i.video[field].split(',').map(s => {
                                                const num = Number(s);
                                                return isNaN(num) ? s.trim() : num;
                                            });
                                        }
                                    });
                                }

                                // Auto-generate imp.id if missing
                                if (!i.id) {
                                    i.id = "1";
                                }
                            });
                        }

                        isJson = true;
                    }
                } catch (qsError) {
                    // Treat as string
                }
            }
        }

        rules.forEach(rule => {
            // Check if rule is applicable
            if (rule.when && isJson) {
                try {
                    if (!rule.when(parsedTag)) {
                        return; // Skip rule
                    }
                } catch (e) {
                    console.error(`Error checking condition for rule ${rule.id}:`, e);
                    return; // Skip on error
                }
            }

            let status = 'pass';
            let message = 'Rule passed';
            let suggestion = null;
            let example = null;

            if (rule.type === 'custom' && isJson) {
                try {
                    if (!rule.validate(parsedTag)) {
                        status = rule.severity === 'error' ? 'fail' : 'warning';
                        message = rule.description;
                        suggestion = rule.suggestion;
                    }
                } catch (e) {
                    console.error(`Error executing rule ${rule.id}:`, e);
                    status = 'warning';
                    message = `Error executing rule ${rule.id}`;
                }
            } else if (rule.type === 'regex' && !isJson) {
                const regex = new RegExp(rule.pattern);
                if (!regex.test(tag)) {
                    status = rule.severity === 'error' ? 'fail' : 'warning';
                    message = rule.description || 'Pattern mismatch';
                    suggestion = rule.suggestion;
                    example = rule.example;
                }
            } else if (rule.type === 'required' && isJson) {
                // Simple nested field check could be added here, but custom rules handle most
                // For now, let's just support simple dot notation if needed, or rely on custom
                // Check if field exists in JSON
                if (!parsedTag.hasOwnProperty(rule.field)) {
                    status = rule.severity === 'error' ? 'fail' : 'warning';
                    message = `Missing required field: ${rule.field}`;
                    suggestion = `Add "${rule.field}": <value>`;
                }
            }
            // Add more rule types here

            if (status === 'fail') failed++;
            else if (status === 'warning') {
                if (mode === 'strict') {
                    failed++;
                    status = 'fail'; // Treat warning as fail in strict mode
                } else {
                    warnings++;
                }
            }
            else passed++;

            // Always push result to show in table
            results.push({
                id: rule.id,
                source: rule.source,
                status,
                message: status === 'pass' ? rule.description : message,
                suggestion,
                example,
                confidence: 1.0,
                severity: rule.severity // Add severity to help grouping
            });
        });

        // Group results by source and type (Required/Recommended)
        const groupedResults = {
            prebid: { valid: true, results: [] },
            openwrap: { valid: true, results: [] },
            required: { valid: true, results: [] },
            recommended: { valid: true, results: [] }
        };

        results.forEach(result => {
            const source = result.source || 'prebid'; // Default to prebid if undefined
            if (groupedResults[source]) {
                groupedResults[source].results.push(result);
                if (result.status === 'fail') {
                    groupedResults[source].valid = false;
                }
            }

            // Group by Required (error) vs Recommended (warning)
            if (result.severity === 'error') {
                groupedResults.required.results.push(result);
                if (result.status === 'fail') groupedResults.required.valid = false;
            } else {
                groupedResults.recommended.results.push(result);
                if (result.status === 'fail') groupedResults.recommended.valid = false;
            }
        });

        // Calculate combined validity (both must be valid)
        const isValid = groupedResults.prebid.valid && groupedResults.openwrap.valid;

        return {
            valid: isValid,
            summary: {
                passed: results.filter(r => r.status === 'pass').length,
                failed: results.filter(r => r.status === 'fail').length,
                warnings: results.filter(r => r.status === 'warning').length
            },
            groups: groupedResults,
            results,
            fixedTag: null
        };
    }
};

function unflatten(data) {
    if (Object(data) !== data || Array.isArray(data)) return data;
    var result = {}, cur, prop, parts, idx;
    for (var p in data) {
        cur = result, prop = "";
        parts = p.split(".");
        for (var i = 0; i < parts.length; i++) {
            idx = !isNaN(parseInt(parts[i]));
            cur = cur[prop] || (cur[prop] = (idx ? [] : {}));
            prop = parts[i];
        }
        cur[prop] = data[p];
    }
    return result[""] || result;
}

module.exports = validationEngine;

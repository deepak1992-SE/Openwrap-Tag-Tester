const validationEngine = require('./validationEngine');
const rules = require('./rules');

const testTag = JSON.stringify({
    id: "123",
    tmax: 1000,
    imp: [{
        id: "1",
        video: {
            mimes: ["video/mp4"],
            protocols: [2, 3],
            linearity: 1,
            minduration: 5,
            maxduration: 30,
            w: 640,
            h: 480,
            placement: 1,
            playbackend: 1
        }
    }],
    site: {
        id: "site123"
    },
    device: {
        ua: "Mozilla",
        ip: "1.2.3.4",
        devicetype: 1,
        w: 1920,
        h: 1080,
        ppi: 400
    },
    app: {
        id: "app123",
        name: "MyApp",
        bundle: "com.my.app"
    }
});

const results = validationEngine.validate(testTag, rules);

console.log("Valid:", results.valid);
console.log("Required Group Results:", results.groups.required.results.length);
console.log("Recommended Group Results:", results.groups.recommended.results.length);

console.log("\n--- Required Failures ---");
results.groups.required.results.filter(r => r.status === 'fail').forEach(r => console.log(r.message));

console.log("\n--- Recommended Warnings ---");
results.groups.recommended.results.filter(r => r.status === 'warning').forEach(r => console.log(r.message));

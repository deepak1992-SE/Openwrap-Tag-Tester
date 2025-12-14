const rules = [
    // --- REQUIRED PARAMETERS (PREBID) ---
    // --- REQUIRED PARAMETERS (PREBID) ---

    {
        id: "REQ_002",
        type: "custom",
        source: "prebid",
        severity: "error",
        description: "Request TMax must be non-negative",
        suggestion: "Ensure 'tmax' is >= 0.",
        when: (data) => data.tmax !== undefined,
        validate: (data) => data.tmax >= 0
    },
    {
        id: "REQ_003",
        type: "custom",
        source: "prebid",
        severity: "error",
        description: "Request Imp array must not be empty",
        suggestion: "Add at least one impression object to 'imp'.",
        validate: (data) => Array.isArray(data.imp) && data.imp.length > 0
    },
    {
        id: "REQ_004",
        type: "custom",
        source: "prebid",
        severity: "error",
        description: "Exactly one inventory type (site, app, dooh) must be defined",
        suggestion: "Ensure exactly one of 'site', 'app', or 'dooh' is present.",
        validate: (data) => {
            const types = ['site', 'app', 'dooh'];
            const present = types.filter(t => data[t]).length;
            return present === 1;
        }
    },
    {
        id: "REQ_005",
        type: "custom",
        source: "prebid",
        severity: "error",
        description: "Site ID or Page is required (if Site)",
        suggestion: "Add 'id' or 'page' to the 'site' object.",
        when: (data) => !!data.site,
        validate: (data) => (data.site.id && data.site.id.length > 0) || (data.site.page && data.site.page.length > 0)
    },
    {
        id: "REQ_006",
        type: "custom",
        source: "prebid",
        severity: "error",
        description: "App ID is required (if App)",
        suggestion: "Add 'id' to the 'app' object.",
        when: (data) => !!data.app,
        validate: (data) => !!data.app.id
    },
    {
        id: "REQ_007",
        type: "custom",
        source: "prebid",
        severity: "error",
        description: "Device dimensions (w, h) must be non-negative",
        suggestion: "Ensure 'device.w' and 'device.h' are >= 0.",
        when: (data) => !!data.device,
        validate: (data) => {
            if (data.device.w !== undefined && data.device.w < 0) return false;
            if (data.device.h !== undefined && data.device.h < 0) return false;
            return true;
        }
    },
    {
        id: "REQ_008",
        type: "custom",
        source: "prebid",
        severity: "error",
        description: "Impression ID is required",
        suggestion: "Add 'id' to each impression object.",
        when: (data) => !!data.imp,
        validate: (data) => data.imp.every(i => i.id && i.id.length > 0)
    },
    {
        id: "REQ_009",
        type: "custom",
        source: "prebid",
        severity: "error",
        description: "Impression TagID is required",
        suggestion: "Add 'tagid' to each impression object.",
        when: (data) => !!data.imp,
        validate: (data) => data.imp.every(i => i.tagid && i.tagid.length > 0)
    },
    {
        id: "REQ_010",
        type: "custom",
        source: "prebid",
        severity: "error",
        description: "Impression must have Banner, Video, or Native",
        suggestion: "Add 'banner', 'video', or 'native' object to each impression.",
        when: (data) => !!data.imp,
        validate: (data) => data.imp.every(i => i.banner || i.video || i.native)
    },

    // --- REQUIRED PARAMETERS (OPENWRAP) ---
    {
        id: "OW_REQ_001",
        type: "custom",
        source: "openwrap",
        severity: "warning",
        description: "Video Placement is required",
        suggestion: "Add 'video.placement' to video object.",
        when: (data) => !!data.imp && data.imp.some(i => i.video),
        validate: (data) => data.imp.filter(i => i.video).every(i => i.video.placement !== undefined)
    },
    {
        id: "OW_REQ_002",
        type: "custom",
        source: "openwrap",
        severity: "warning",
        description: "Video Playback Method/Backend is required",
        suggestion: "Add 'video.playbackend' (or 'playbackmethod') to video object.",
        when: (data) => !!data.imp && data.imp.some(i => i.video),
        validate: (data) => data.imp.filter(i => i.video).every(i => i.video.playbackend !== undefined || (i.video.playbackmethod && i.video.playbackmethod.length > 0))
    },
    {
        id: "OW_REQ_003",
        type: "custom",
        source: "openwrap",
        severity: "error",
        description: "Video Width (w) and Height (h) are required",
        suggestion: "Add 'w' and 'h' to video object.",
        when: (data) => !!data.imp && data.imp.some(i => i.video),
        validate: (data) => data.imp.filter(i => i.video).every(i => i.video.w && i.video.h)
    },
    {
        id: "OW_REQ_004",
        type: "custom",
        source: "openwrap",
        severity: "error",
        description: "Video Mimes are required",
        suggestion: "Add 'mimes' array to video object.",
        when: (data) => !!data.imp && data.imp.some(i => i.video),
        validate: (data) => data.imp.filter(i => i.video).every(i => i.video.mimes && i.video.mimes.length > 0)
    },
    {
        id: "OW_REQ_005",
        type: "custom",
        source: "openwrap",
        severity: "error",
        description: "Video Protocols are required",
        suggestion: "Add 'protocols' array to video object.",
        when: (data) => !!data.imp && data.imp.some(i => i.video),
        validate: (data) => data.imp.filter(i => i.video).every(i => i.video.protocols && i.video.protocols.length > 0)
    },
    {
        id: "OW_REQ_006",
        type: "custom",
        source: "openwrap",
        severity: "error",
        description: "Video Linearity is required",
        suggestion: "Add 'linearity' to video object.",
        when: (data) => !!data.imp && data.imp.some(i => i.video),
        validate: (data) => data.imp.filter(i => i.video).every(i => i.video.linearity !== undefined)
    },
    {
        id: "OW_REQ_007",
        type: "custom",
        source: "openwrap",
        severity: "error",
        description: "Video Min/Max Duration are required",
        suggestion: "Add 'minduration' and 'maxduration' to video object.",
        when: (data) => !!data.imp && data.imp.some(i => i.video),
        validate: (data) => data.imp.filter(i => i.video).every(i => i.video.minduration !== undefined && i.video.maxduration !== undefined)
    },
    {
        id: "OW_REQ_008",
        type: "custom",
        source: "openwrap",
        severity: "error",
        description: "App ID, Name, and Bundle are required (if App)",
        suggestion: "Add 'id', 'name', and 'bundle' to app object.",
        when: (data) => !!data.app,
        validate: (data) => data.app.id && data.app.name && data.app.bundle
    },
    {
        id: "OW_REQ_009",
        type: "custom",
        source: "openwrap",
        severity: "error",
        description: "Device UA, IP, and DeviceType are required",
        suggestion: "Add 'ua', 'ip', and 'devicetype' to device object.",
        when: (data) => !!data.device,
        validate: (data) => data.device.ua && data.device.ip && data.device.devicetype !== undefined
    },
    {
        id: "OW_REQ_010",
        type: "custom",
        source: "openwrap",
        severity: "error",
        description: "OpenWrap Profile ID is required",
        suggestion: "Add 'req.ext.wrapper.profileid' to the request.",
        validate: (data) => {
            if (data.ext && data.ext.wrapper && data.ext.wrapper.profileid) return true;
            if (data.req && data.req.ext && data.req.ext.wrapper && data.req.ext.wrapper.profileid) return true;
            return false;
        }
    },

    // --- RECOMMENDED PARAMETERS (OPENWRAP) ---
    {
        id: "OW_REC_001",
        type: "custom",
        source: "openwrap",
        severity: "warning",
        description: "Recommended: Video Extension Params (maxad, minad, etc.)",
        suggestion: "Consider adding 'video.ext' parameters like 'maxad', 'minad', 'maxduration', 'minduration'.",
        when: (data) => !!data.imp && data.imp.some(i => i.video),
        validate: (data) => data.imp.filter(i => i.video).every(i => i.video.ext && (i.video.ext.maxad || i.video.ext.minad || i.video.ext.maxduration || i.video.ext.minduration))
    },
    {
        id: "OW_REC_002",
        type: "custom",
        source: "openwrap",
        severity: "warning",
        description: "Recommended: Video API Frameworks",
        suggestion: "Add 'api' to video object.",
        when: (data) => !!data.imp && data.imp.some(i => i.video),
        validate: (data) => data.imp.filter(i => i.video).every(i => i.video.api && i.video.api.length > 0)
    },
    {
        id: "OW_REC_003",
        type: "custom",
        source: "openwrap",
        severity: "warning",
        description: "Recommended: Video Delivery Method",
        suggestion: "Add 'delivery' to video object.",
        when: (data) => !!data.imp && data.imp.some(i => i.video),
        validate: (data) => data.imp.filter(i => i.video).every(i => i.video.delivery && i.video.delivery.length > 0)
    },
    {
        id: "OW_REC_004",
        type: "custom",
        source: "openwrap",
        severity: "warning",
        description: "Recommended: Video Start Delay",
        suggestion: "Add 'startdelay' to video object.",
        when: (data) => !!data.imp && data.imp.some(i => i.video),
        validate: (data) => data.imp.filter(i => i.video).every(i => i.video.startdelay !== undefined)
    },
    {
        id: "OW_REC_005",
        type: "custom",
        source: "openwrap",
        severity: "warning",
        description: "Recommended: Video Position",
        suggestion: "Add 'pos' to video object.",
        when: (data) => !!data.imp && data.imp.some(i => i.video),
        validate: (data) => data.imp.filter(i => i.video).every(i => i.video.pos !== undefined)
    },
    {
        id: "OW_REC_006",
        type: "custom",
        source: "openwrap",
        severity: "warning",
        description: "Recommended: App Details (Domain, StoreURL, Ver, PrivacyPolicy)",
        suggestion: "Add 'domain', 'storeurl', 'ver', 'privacypolicy' to app object.",
        when: (data) => !!data.app,
        validate: (data) => data.app.domain || data.app.storeurl || data.app.ver || data.app.privacypolicy
    },
    {
        id: "OW_REC_007",
        type: "custom",
        source: "openwrap",
        severity: "warning",
        description: "Recommended: Device Details (Make, Model, OS, OSV, IFA)",
        suggestion: "Add 'make', 'model', 'os', 'osv', 'ifa' to device object.",
        when: (data) => !!data.device,
        validate: (data) => data.device.make && data.device.model && data.device.os && data.device.osv && data.device.ifa
    },
    {
        id: "OW_REC_008",
        type: "custom",
        source: "openwrap",
        severity: "warning",
        description: "Recommended: User Details (ID, BuyerUID, YOB, Gender)",
        suggestion: "Add 'id', 'buyeruid', 'yob', 'gender' to user object.",
        when: (data) => !!data.user,
        validate: (data) => data.user.id || data.user.buyeruid || data.user.yob || data.user.gender
    },
    {
        id: "OW_REC_009",
        type: "custom",
        source: "openwrap",
        severity: "warning",
        description: "Recommended: Regulations (COPPA, GDPR)",
        suggestion: "Add 'regs.coppa' and 'regs.ext.gdpr'.",
        when: (data) => !!data.regs,
        validate: (data) => data.regs.coppa !== undefined || (data.regs.ext && data.regs.ext.gdpr !== undefined)
    }
];

module.exports = rules;

import sanitizeHtml from 'sanitize-html';

function sanitizeValue(value) {
    if (typeof value === 'string') {
        return sanitizeHtml(value, {
            allowedTags: [],
            allowedAttributes: {}
        }).trim();
    } else if (typeof value === 'number') {
        return Number.isFinite(value) ? value : null;
    } else if (typeof value === 'boolean') {
        return value === true || value === false ? value : null;
    } else if (Array.isArray(value)) {
        return value.map(sanitizeValue);
    } else if (typeof value === 'object' && value !== null) {
        return sanitizeFormData(value);
    } else {
        return value;
    }
}

export function sanitizeFormData(formData) {
    return Object.fromEntries(
        Object.entries(formData).map(([key, value]) => [key, sanitizeValue(value)])
    );
}
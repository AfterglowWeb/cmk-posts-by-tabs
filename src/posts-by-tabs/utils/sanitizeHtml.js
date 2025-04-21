import DOMPurify from 'dompurify';

export default function sanitizeHtml (html) {
    return DOMPurify.sanitize(html, { 
        USE_PROFILES: { html: true },
        ALLOW_ARIA_ATTR: true
    });
};
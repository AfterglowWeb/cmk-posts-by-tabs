import React from 'react';
import sanitizeHtml from '../utils/sanitizeHtml';

export default function SubEvent({post, className = ''}) {

    if(!post) {
        return null;
    }
    if(!post.acf) {
        return null;
    }
    if(!post.acf.sub_event) {
        return null;
    }

    return (
        <p 
            className={`absolute top-[80px] right-0 bg-primary font-narrow-700 text-xs max-w-[220px] ${className}`}
            dangerouslySetInnerHTML={{__html: sanitizeHtml(post.acf.sub_event || '')}}
        />
    )
}
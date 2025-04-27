import { useEffect, useState, useRef } from '@wordpress/element';
import universalFetch from './universalFetch';

let postTypesCache = null;
let isFetching = false;

export async function fetchPostTypes(skipCache = false) {
    if (!skipCache && postTypesCache) {
        return postTypesCache;
    }
    
    if (isFetching) {
        return new Promise((resolve) => {
            const checkCache = setInterval(() => {
                if (!isFetching && postTypesCache) {
                    clearInterval(checkCache);
                    resolve(postTypesCache);
                }
            }, 100);
            
            setTimeout(() => {
                clearInterval(checkCache);
                resolve([]);
            }, 3000);
        });
    }
    
    try {
        isFetching = true;
        
        const types = await universalFetch({ 
            path: `wp/v2/types`,
            method: 'GET'
        });
         
        if (!types || typeof types !== 'object') {
            console.error('Invalid post types response');
            isFetching = false;
            return [];
        }

        const postTypes = Object.keys(types)
            .filter(meta => !meta.startsWith('wp_')
                && meta !== 'attachment' 
                && meta !== 'nav_menu_item' 
                && meta !== 'rm_content_editor')
            .map(meta => {
                const metaLabel = meta.split('_').join(' ');
                return {
                    label: metaLabel.charAt(0).toUpperCase() + metaLabel.slice(1),
                    value: meta
                };
            });
            
        // Store in cache
        postTypesCache = postTypes;
        isFetching = false;
        
        return postTypes;
    } catch (error) {
        console.error(`Error fetching post types:`, error);
        isFetching = false;
        return [];
    }
}

export function usePostTypes() {
    const [postTypes, setPostTypes] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        setIsLoading(true);
        setError(null);
        
        fetchPostTypes()
            .then(keys => {
                setPostTypes(keys);
                setIsLoading(false);
            })
            .catch(err => {
                setError(err);
                setIsLoading(false);
            });
    }, []); // Remove postTypes from dependency array to prevent infinite loop
    
    return { postTypes, isLoading, error };
}
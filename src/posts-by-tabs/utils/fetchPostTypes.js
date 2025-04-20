import { __ } from '@wordpress/i18n';
import { useEffect, useState } from '@wordpress/element';

const postTypesCache = {};

export async function fetchPostTypes(useCache = true) {
    if (useCache && postTypesCache) {
        return postTypesCache;
    }
    
    try {
        const types = await wp.apiFetch({ 
            path: `/wp/v2/types` 
        });
        
        if (!types || typeof types !== 'object') {
            throw new Error(__('Invalid post types response'));
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
            
        postTypesCache = postTypes;
        
        return postTypes;
    } catch (error) {
        console.error(`Error fetching post types:`, error);
        throw error;
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
    }, [postTypes]);
    
    return { postTypes, isLoading, error };
}
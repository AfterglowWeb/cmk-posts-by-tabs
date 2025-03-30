import { useEffect, useState } from '@wordpress/element';

const metaKeysCache = {};

export async function fetchMetaKeys(postType, useCache = true) {
    if (useCache && metaKeysCache[postType]) {
        return metaKeysCache[postType];
    }
    
    try {
        const metas = await wp.apiFetch({ 
            path: `/posts-by-tabs/v1/meta/${postType}?keys_only=true` 
        });
        
        if (!metas || typeof metas !== 'object') {
            throw new Error('Invalid meta fields response');
        }
        
        const metaKeyArray = Object.keys(metas)
            .filter(meta => !meta.startsWith('_'))
            .map(meta => {
                const metaLabel = meta.split('_').join(' ');
                return {
                    label: metaLabel.charAt(0).toUpperCase() + metaLabel.slice(1),
                    value: meta
                };
            });
            
        metaKeysCache[postType] = metaKeyArray;
        
        return metaKeyArray;
    } catch (error) {
        console.error(`Error fetching meta keys for ${postType}:`, error);
        throw error;
    }
}

export function useMetaKeys(postType) {
    const [metaKeys, setMetaKeys] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        if (!postType) {
            setMetaKeys([]);
            return;
        }
        
        setIsLoading(true);
        setError(null);
        
        fetchMetaKeys(postType)
            .then(keys => {
                setMetaKeys(keys);
                setIsLoading(false);
            })
            .catch(err => {
                setError(err);
                setIsLoading(false);
            });
    }, [postType]);
    
    return { metaKeys, isLoading, error };
}
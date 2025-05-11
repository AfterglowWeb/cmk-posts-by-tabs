import { useEffect, useState, useRef } from '@wordpress/element';
import universalFetch from './universalFetch';

const metaKeysCache = {};
const pendingRequests = {};

export async function fetchMetaKeys(postType, useCache = true) {
    if (!postType) {
        return [];
    }
    
    if (useCache && metaKeysCache[postType]) {
        return metaKeysCache[postType];
    }
    
    if (pendingRequests[postType]) {
        return pendingRequests[postType];
    }
    
    const requestPromise = new Promise(async (resolve) => {
        try {
            const fetchedMetaKeys = await universalFetch({ 
                path: `/posts-by-tabs/v1/meta/${postType}?keys_only=true`
            });

            let metaKeysArray = [];
            
            if (Array.isArray(fetchedMetaKeys)) {
                metaKeysArray = fetchedMetaKeys;
            } else if (typeof fetchedMetaKeys === 'object' && fetchedMetaKeys !== null) {
                metaKeysArray = Object.keys(fetchedMetaKeys);
            }
            
            const metaKeyOptions = metaKeysArray
                .filter(meta => typeof meta === 'string' && !meta.startsWith('_'))
                .map(meta => {
                    const metaLabel = meta.split('_').join(' ');
                    return {
                        label: metaLabel.charAt(0).toUpperCase() + metaLabel.slice(1),
                        value: meta
                    };
                });
            
            metaKeysCache[postType] = metaKeyOptions;
            
            resolve(metaKeyOptions);
        } catch (error) {
            resolve([]);
        } finally {
            delete pendingRequests[postType];
        }
    });
    
    pendingRequests[postType] = requestPromise;
    
    return requestPromise;
}

export function useMetaKeys(postType) {
    const [metaKeys, setMetaKeys] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const prevPostTypeRef = useRef(null);

    useEffect(() => {

        if (!postType || postType === prevPostTypeRef.current) {
            return;
        }

       prevPostTypeRef.current = postType;
        
        setIsLoading(true);
        setError(null);
        
            fetchMetaKeys(postType)
                .then(keys => {
                    setMetaKeys(keys);
                    setIsLoading(false);
                })
                .catch(err => {
                    console.error(`Error fetching meta keys for ${postType}:`, err);
                    setError(err);
                    setIsLoading(false);
                });
        
        return () => {
            setMetaKeys([]);
            setIsLoading(false);
            setError(null);
        }
    }, [postType]);
    
    return { metaKeys, isLoading, error };
}
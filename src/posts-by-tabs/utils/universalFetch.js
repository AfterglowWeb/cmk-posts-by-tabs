export default async function universalFetch(props) {
    if (typeof wp !== 'undefined' && wp.apiFetch) {
        return await wp.apiFetch(props);
    }
    
    const { restUrl, nonce } = props.attributes || {};
    const { path } = props;
    if (!restUrl || !nonce || !path) {
        console.error('Missing required attributes for universalFetch');
        return null;
    }

    const url = `${restUrl}${path}`;
    
    const fetchOptions = {
        method: props.method || 'GET',
        headers: {
            'Content-Type': 'application/json',
            'X-WP-Nonce': nonce
        }
    };
    
    if ((props.method === 'POST') && props.data) {
        fetchOptions.body = JSON.stringify(props.data);
    }
    
    try {
        const response = await fetch(url, fetchOptions);
      
        if (props.parse === false) {
            return response;
        }
        
        const headers = {};
        response.headers.forEach((value, key) => { 
            headers[key.toLowerCase()] = value;
        });
        
        const data = await response.json();
        const posts = data?.posts || [];

        if (!posts || posts.length === 0) {
            console.error('No posts found');
            return { error: 'No posts found' };
        }
        
        if (props.returnHeaders) {
            return { 
                posts,
                headers 
            };
        }
        
        return posts;
    } catch (error) {
        console.error('Error in universalFetch:', error);
        throw error;
    }
}
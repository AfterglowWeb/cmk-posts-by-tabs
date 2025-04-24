
export async function fetchPosts(attributes, options = {}) {
    const { headers = false, append = false } = options;
    let response;
    
    try {
        if (hasMetaQuery(attributes)) {
            response = await fetchPostsWithMetaQuery(attributes, headers);
        } else {
            response = await fetchPostsWithStandardQuery(attributes, headers);
        }

        if (headers) {
            return {
                posts: Array.isArray(response) ? response : 
                       (response.posts || []),
                headers: response.headers || {}
            };
        } else {
            return Array.isArray(response) ? response : 
                   (response.posts || []);
        }
    } catch (error) {
        console.error('Error in fetchPosts:', error);
        return headers ? { posts: [], headers: {} } : [];
    }
}

export function hasMetaQuery(attributes) {
    return  attributes?.metaFields?.fields?.length > 0;
}

async function fetchPostsWithMetaQuery(attributes, getHeaders = false) {
    const endpoint = 'posts-by-tabs/v1/posts';
    
    const requestData = {
        post_type: attributes.postType || 'post',
        posts_per_page: attributes.numberOfItems || 5,
        order: attributes.order || 'desc',
        orderby: attributes.orderBy || 'date',
        meta_query: attributes.metaFields,
        search: attributes.search || '',
        offset: attributes.offset || 0,
        meta_key: attributes.metaKey || ''
    };
    
    if (attributes.taxonomy && attributes.terms && attributes.terms.length > 0) {
        requestData.terms = {};
        requestData.terms[attributes.taxonomy] = attributes.terms;
    }

    const response = await universalFetch({
        path: endpoint,
        method: 'POST',
        data: requestData,
        returnHeaders: getHeaders,
        attributes: attributes
    });
    
    if (getHeaders && response.total_posts !== undefined) {
        return {
            posts: response.posts || response,
            headers: {
                'x-wp-total': response.total_posts.toString(),
                'x-wp-totalpages': Math.ceil(response.total_posts / (attributes.numberOfItems || 10)).toString()
            }
        };
    }

    return getHeaders ? response.data.posts || response.data : response.posts || response;

}

async function fetchPostsWithStandardQuery(attributes, getHeaders = false) {
    let restEndpoint = `/wp/v2/${attributes.postType || 'posts'}`;
    if (attributes.postType === 'post') {
        restEndpoint = `/wp/v2/posts`;
    } else if (attributes.postType === 'page') {
        restEndpoint = `/wp/v2/pages`;
    }

    let queryPath = `${restEndpoint}?_embed&per_page=${attributes.numberOfItems || 5}`;
    
    if (attributes.order) {
        queryPath += `&order=${attributes.order}`;
    }
    
    if (attributes.orderBy) {
        queryPath += `&orderby=${attributes.orderBy}`;
    }
    
    if (attributes.taxonomy && attributes.terms && attributes.terms.length > 0) {
        if (attributes.taxonomy === 'category') {
            queryPath += `&categories=${attributes.terms.join(',')}`;
        } else if (attributes.taxonomy === 'tag') {
            queryPath += `&tags=${attributes.terms.join(',')}`;
        } else {
            queryPath += `&${attributes.taxonomy}=${attributes.terms.join(',')}`;
        }
    }
    
    if (attributes.search) {
        queryPath += `&s=${encodeURIComponent(attributes.search)}`;
    }
    
    if (attributes.offset) {
        queryPath += `&offset=${attributes.offset}`;
    }

    if (getHeaders) {
        const response = await wp.apiFetch({ 
            path: queryPath,
            parse: false
        });
        
        if (response instanceof Response) {
            const posts = await response.json();
            return {
                posts,
                headers: {
                    'x-wp-total': response.headers.get('X-WP-Total'),
                    'x-wp-totalpages': response.headers.get('X-WP-TotalPages')
                }
            };
        } 
        
        const posts = await response.json();
        return {
            posts,
            headers: {
                'x-wp-total': response.headers.get('X-WP-Total'),
                'x-wp-totalpages': response.headers.get('X-WP-TotalPages')
            }
        };
    } else {
        return await universalFetch({ path: queryPath, attributes: attributes });
    }

}

async function universalFetch(options) {
    if (typeof wp !== 'undefined' && wp.apiFetch) {
        return await wp.apiFetch(options);
    }
    
    const { restUrl, nonce } = options.attributes || {};
    const { path } = options;
    if (!restUrl || !nonce || !path) {
        console.error('Missing required attributes for universalFetch');
        return null;
    }

    const url = `${restUrl}${path}`;
    
    const fetchOptions = {
        method: options.method || 'GET',
        headers: {
            'Content-Type': 'application/json',
            'X-WP-Nonce': nonce
        }
    };
    
    if ((options.method === 'POST') && options.data) {
        fetchOptions.body = JSON.stringify(options.data);
    }
    
    try {
        const response = await fetch(url, fetchOptions);
        
        if (options.parse === false) {
            return response;
        }
        
        const headers = {};
        response.headers.forEach((value, key) => { 
            headers[key.toLowerCase()] = value;
        });
        
        const data = await response.json();
        
        if (options.returnHeaders) {
            return { 
                data,
                headers 
            };
        }
        
        return data;
    } catch (error) {
        console.error('Error in universalFetch:', error);
        throw error; // Re-throw to be consistent with wp.apiFetch behavior
    }
}
import { __ } from '@wordpress/i18n';
import { useEffect, useState } from '@wordpress/element';

const taxonomiesCache = {};

export async function fetchtaxonomies(useCache = true) {
    if (useCache && taxonomiesCache) {
        return taxonomiesCache;
    }
    
    try {
        const tax = await wp.apiFetch({ 
            path: `/wp/v2/taxonomies?type=${attributes.postType}` 
        });
        
        if (!tax || typeof tax !== 'object') {
            throw new Error(__('Invalid post tax response'));
        }
        
        const taxonomyOptions = [];


        const taxonomies = Object.keys(tax)
            .filter(tax => !tax.startsWith('wp_')
                && tax !== 'attachment' 
                && tax !== 'nav_menu_item' 
                && tax !== 'rm_content_editor')
            .map(tax => {

                
                Object.keys(fetchedTaxonomies).forEach((tax) => {
                    taxonomyOptions.push({
                        label: fetchedTaxonomies[tax].name,
                        value: tax,
                        restBase: fetchedTaxonomies[tax].rest_base
                    });
                });
                
                setTaxonomies(taxonomyOptions);
                setIsLoading(false);


                const taxLabel = tax.split('_').join(' ');
                return {
                    label: taxLabel.charAt(0).toUpperCase() + taxLabel.slice(1),
                    value: tax
                };
            });
            
        taxonomiesCache = taxonomies;
        
        return taxonomies;
    } catch (error) {
        console.error(`Error fetching post types:`, error);
        throw error;
    }
}

export function useTaxonomies(postType) {
    const [taxonomies, setTaxonomies] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
      
        setIsLoading(true);
        setError(null);
        
        fetchtaxonomies(attributes)
            .then(keys => {
                setTaxonomies(keys);
                setIsLoading(false);
            })
            .catch(err => {
                setError(err);
                setIsLoading(false);
            });
    }, [taxonomies]);
    
    return { taxonomies, isLoading, error };
}
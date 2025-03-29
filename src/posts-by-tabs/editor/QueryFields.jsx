import { __ } from '@wordpress/i18n';
import { 
    QueryControls,
    SelectControl,
    Spinner,
    FormTokenField,
    PanelBody
} from '@wordpress/components';
import { 
    useState, 
    useEffect
} from '@wordpress/element';
import MetaFields from './MetaFields';
import MultipleSelectChip from './MultipleSelectChip';

export default function QueryFields(props) {
    const { attributes, setAttributes } = props;
    const { numberOfItems, order, orderBy } = attributes;

    const [postTypes, setPostTypes] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    
    const [taxonomies, setTaxonomies] = useState([]);
    const [selectedTaxonomy, setSelectedTaxonomy] = useState(attributes.taxonomy || '');
    const [terms, setTerms] = useState([]);

    useEffect(() => {
        setIsLoading(true);
        wp.apiFetch({ path: '/wp/v2/types' }).then((types) => {
            const availableTypes = [];
            Object.keys(types).forEach((type) => {

                if (!type.startsWith('wp_') && 
                    type !== 'attachment' && 
                    type !== 'nav_menu_item' &&
                    type !== 'rm_content_editor') {
                    
                    availableTypes.push({
                        label: types[type].name,
                        value: type
                    });
                }
            });
    
            setPostTypes(availableTypes);
            setIsLoading(false);
            
            if (!attributes.postType) {
                setAttributes({ postType: 'post' });
            }
        });
    }, []);


    useEffect(() => {
        if (attributes.postType) {
            setIsLoading(true);
            wp.apiFetch({ path: `/wp/v2/taxonomies?type=${attributes.postType}` }).then((fetchedTaxonomies) => {
                const taxonomyOptions = [];
                
                Object.keys(fetchedTaxonomies).forEach((tax) => {
                    taxonomyOptions.push({
                        label: fetchedTaxonomies[tax].name,
                        value: tax,
                        restBase: fetchedTaxonomies[tax].rest_base
                    });
                });
                
                setTaxonomies(taxonomyOptions);
                setIsLoading(false);
                
                if (taxonomyOptions.length > 0) {
                    if (selectedTaxonomy && !taxonomyOptions.some(t => t.value === selectedTaxonomy)) {
                        setSelectedTaxonomy(taxonomyOptions[0].value);
                        setAttributes({ 
                            taxonomy: taxonomyOptions[0].value,
                            terms: null
                        });
                    }
                    else if (!selectedTaxonomy) {
                        setSelectedTaxonomy('');
                        setAttributes({ taxonomy: '', terms: null });
                    }
                } else {
                    setSelectedTaxonomy('');
                    setAttributes({ taxonomy: '', terms: null });
                }
            });
        }
    }, [attributes.postType]);


    useEffect(() => {
        if (selectedTaxonomy) {
            const taxonomy = taxonomies.find(t => t.value === selectedTaxonomy);
        
            if (taxonomy && taxonomy.restBase) {
                setIsLoading(true);
                wp.apiFetch({ path: `/wp/v2/${taxonomy.restBase}?per_page=100` })
                    .then((fetchedTerms) => {
                        const termOptions = fetchedTerms.map(term => ({
                            label: term.name,
                            value: term.id,
                        }));
                        
                        setTerms(termOptions);
                        setIsLoading(false);
                    })
                    .catch(() => {
                        setTerms([]);
                        setIsLoading(false);
                    });
            }
        } else {
            setTerms([]);
        }
    }, [selectedTaxonomy, taxonomies]);


    const updateQuery = (newAttributes) => {
        setAttributes({...attributes, ...newAttributes});
    };

    return (
        <>
            {isLoading ? (
                <Spinner />
            ) : (
                <>
                    <SelectControl
                        label={__('Post Type')}
                        value={attributes.postType || 'post'}
                        options={[
                            { label: __('Select post type'), value: '' },
                            ...postTypes
                        ]}
                        onChange={(newPostType) => {
                            updateQuery({ 
                                postType: newPostType,
                                taxonomy: '',
                                terms: null
                            });
                        }}
                    />
                    
                    {taxonomies.length > 0 && (
                        <SelectControl
                            label={__('Taxonomy')}
                            value={selectedTaxonomy}
                            options={[
                                { label: __('Select taxonomy'), value: '' },
                                ...taxonomies.map(tax => ({
                                    label: tax.label,
                                    value: tax.value
                                }))
                            ]}
                            onChange={(newTaxonomy) => {
                                setSelectedTaxonomy(newTaxonomy);
                                updateQuery({ 
                                    taxonomy: newTaxonomy,
                                    terms: null
                                });
                            }}
                        />
                    )}

                    {selectedTaxonomy && terms.length > 0 && (
                        <MultipleSelectChip
                        terms={terms}
                        selectedTerms={attributes.terms || []}
                        label={__('Select terms')}
                        onChange={(newTerms) => {
                            updateQuery({ terms: newTerms});
                        }}
                        />
                    )}

                    <QueryControls
                        numberOfItems={numberOfItems}
                        onNumberOfItemsChange={(value) => updateQuery({ numberOfItems: value })}
                    />

                    <div className="py-2" />

                    <PanelBody title={__('Meta settings')} initialOpen={false}>
                        <MetaFields attributes={attributes} setAttributes={setAttributes}  />
                    </PanelBody>

                    <div className="py-2 " />
                    
                    <QueryControls
                        orderBy={orderBy}
                        onOrderByChange={(value) => updateQuery({ orderBy: value })}
                        order={order}
                        onOrderChange={(value) => updateQuery({ order: value })}
                    />

                    
                </>
            )}
        </>
    );
}
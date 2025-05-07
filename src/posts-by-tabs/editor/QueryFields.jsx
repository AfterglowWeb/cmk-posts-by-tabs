import { __ } from '@wordpress/i18n';
import { 
    PanelBody,
} from '@wordpress/components';
import MetaFields from './MetaFields';
import MuiMultipleSelect from './MuiMultipleSelect';
import MuiSelect from './MuiSelect';
import MuiInputSlider from './MuiInputSlider';

export default function QueryFields(props) {

    const { 
        attributes, 
        postsByTabsSettings,
        selectedPostType,
        selectedOrderByMetaKey,
        taxonomyTerms,
        updateAttributes
    } = props;

    const { postsPerPage = 12, maxNumPages = 10, order = 'desc', orderBy = 'date', paginationType } = attributes;

    const handleTermsChange = (taxonomy, newTerms) => {
        const updatedTerms = {
            ...taxonomyTerms,
            [taxonomy.value]: {
                label: taxonomy.label,
                value: taxonomy.value,
                selectedTerms: newTerms
            }
        };
        
        updateAttributes({ taxonomyTerms: updatedTerms });
    };

    return (
        <>
        <PanelBody title={__('Query Settings')} initialOpen={false}>
        <div className="py-2">
            {postsByTabsSettings.postTypes && 
            postsByTabsSettings.postTypes.length > 0 &&
                <MuiSelect
                label={__('Post Type')}
                options={[
                { label: __('Select post type'), value: '' },
                ...postsByTabsSettings.postTypes
                ]}
                value={selectedPostType || 'post'}
                onChange={(newPostType) => {
                    updateAttributes({ 
                        postType: newPostType,
                        taxonomy: '',
                        terms: null
                    });
                }}
                />
            }

            {postsByTabsSettings.taxonomies && 
            postsByTabsSettings.taxonomies.length > 0 && 
            postsByTabsSettings.taxonomies.map(tax => {
                if(!tax.terms || tax.terms.length === 0) return null;
                const selectedPostHasTaxonomy = tax.postTypes?.some(t => t.value === selectedPostType);
                const currentSelectedTerms = taxonomyTerms[tax.value]?.selectedTerms || [];
                
                    return (
                        <MuiMultipleSelect
                        key={tax.value}
                        values={tax.terms}
                        selectedValues={currentSelectedTerms}
                        label={`Select ${tax.label} terms`}
                        onChange={(newTerms) => handleTermsChange(tax, newTerms)}
                        className={
                            `${selectedPostType && selectedPostHasTaxonomy ? "" : "hidden"}`
                        }
                        />
                    );
                }
            )}

            <MuiSelect
            label={__('Order by')}
            options={[
                { label: __('Date'), value: 'date' },
                { label: __('Title'), value: 'title' },
                { label: __('Meta value'), value: 'meta_value' },
                { label: __('Meta value number'), value: 'meta_value_num' }
            ]}
            value={orderBy}
            onChange={(value) => updateAttributes({ orderBy: value })}
            />

            {postsByTabsSettings.metasByPostType && postsByTabsSettings.postTypes && postsByTabsSettings.postTypes.map(postType => {
        
                const hasMetaFields = postsByTabsSettings.metasByPostType && 
                    postsByTabsSettings.metasByPostType[postType.value] &&
                    Object.keys(postsByTabsSettings.metasByPostType[postType.value]).length > 0;

                
                return ( 
                <>
                {hasMetaFields && 
                    <MuiSelect
                    key={postType.value + '-orderby-metafield'}
                    label={`Orderby ${postType.label} Meta`}
                    options={[
                        { label: __('Select meta field'), value: '' },
                        ...(hasMetaFields 
                            ? Object.values(postsByTabsSettings.metasByPostType[postType.value]).map(field => ({
                                label: field.label,
                                value: field.value
                            }))
                            : [])
                    ]}
                    value={selectedOrderByMetaKey || ''}
                    onChange={(value) => {
                        updateAttributes({ orderByMetaKey: value });
                    }}
                    className={`${selectedPostType &&
                            selectedPostType === postType.value &&
                            ( orderBy === 'meta_value' || orderBy === 'meta_value_num' )  ? "" : "hidden"}`
                    }
                    />}
                </>
                )
            })} 
            
            <MuiSelect
            label={__('Order')}
            options={[
                { label: __('Ascending'), value: 'asc' },
                { label: __('Descending'), value: 'desc' }
            ]}
            value={order}
            onChange={(value) => 
                updateAttributes({ order: value })
            }
            />

            <MuiInputSlider
            value={postsPerPage}
            onChange={(value) => 
                updateAttributes({ postsPerPage: value })
            }
            label={__('Posts per page')}
            min={1}
            max={100}
            step={1}
            />

            <MuiInputSlider
            value={maxNumPages}
            onChange={
                (value) => updateAttributes({ maxNumPages: value })
            }
            label={__('Number of pages')}
            min={1}
            max={100}
            step={1}
            />


        </div> 
        </PanelBody>
        <PanelBody title={__('Meta Query Settings')} initialOpen={false}>
            <div className="py-2">
            <MetaFields attributes={attributes} updateAttributes={updateAttributes} postsByTabsSettings={postsByTabsSettings} /> 
            </div>
        </PanelBody>
        </>
    );
}
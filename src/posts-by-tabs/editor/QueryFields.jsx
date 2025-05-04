import { __ } from '@wordpress/i18n';
import { 
    PanelBody,
} from '@wordpress/components';
import { 
    useState
} from '@wordpress/element';
import MetaFields from './MetaFields';
import MuiMultipleSelect from './MuiMultipleSelect';
import MuiSelect from './MuiSelect';
import MuiInputSlider from './MuiInputSlider';

export default function QueryFields(props) {

    const { 
        attributes, 
        setAttributes, 
        postsByTabsSettings,
        selectedPostType,
        selectedOrderByMetaKey,
        setSelectedOrderByMetaKey,
        taxonomyTerms,
        updateQueryAttributes
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
        
        updateQueryAttributes({ taxonomyTerms: updatedTerms });
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
                    updateQueryAttributes({ 
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
                        terms={tax.terms}
                        selectedTerms={currentSelectedTerms}
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
            onChange={(value) => updateQuery({ orderBy: value })}
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
                        setSelectedOrderByMetaKey(value);
                        updateQuery({ orderByMetaKey: value });
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
                updateQuery({ order: value })
            }
            />

            <MuiInputSlider
            value={postsPerPage}
            onChange={(value) => 
                updateQuery({ postsPerPage: value })
            }
            label={__('Posts per page')}
            min={1}
            max={100}
            step={1}
            />

            <MuiInputSlider
            value={maxNumPages}
            onChange={
                (value) => updateQuery({ maxNumPages: value })
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
            <MetaFields attributes={attributes} setAttributes={setAttributes} postsByTabsSettings={postsByTabsSettings} /> 
            </div>
        </PanelBody>
        </>
    );
}
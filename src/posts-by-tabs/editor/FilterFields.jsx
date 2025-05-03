import { __ } from '@wordpress/i18n';
import { 
    Spinner,
    PanelBody,
    Card,
    CardBody,
    CardHeader,
    CardFooter,
    TextControl,
    ToggleControl,
    Flex,
    FlexItem,
    FlexBlock,
    Icon,
} from '@wordpress/components';
import { 
    useState, 
    useEffect
} from '@wordpress/element';


import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import MuiMultipleSelect from './MuiMultipleSelect';
import MuiSelect from './MuiSelect';
import MuiInputSlider from './MuiInputSlider';


export default function EditorFilterFields(props) {

    const { attributes, setAttributes, postsByTabsSettings} = props;

    const handleTermsChange = (taxonomy, newTerms) => {
        setAttributes({
            taxonomyTerms: {
                ...attributes.taxonomyTerms,
                [taxonomy.value]: {
                    label: taxonomy.label,
                    value: taxonomy.value,
                    selectedTerms: newTerms
                }
            }
        });
    };

    const handleMetasChange = (meta, newMetas) => {
        setAttributes({
            metas: {
                ...attributes.metas,
                [meta.value]: {
                    label: meta.label,
                    value: meta.value,
                    selectedMetas: newMetas
                }
            }
        });
    };

    const filterTypes = [
        {
            label: __('Taxonomy'),
            value: 'taxonomy',
            multiple: true,
        },
        {
            label: __('Meta Key'),
            value: 'metaKey',
            multiple: true,
        },
        {
            label: __('Order'),
            value: 'order',
            multiple: false,
        },
        {
            label: __('Order By'),
            value: 'orderby',
            multiple: false,
        },
        {
            label: __('Search'),
            value: 'search',
            multiple: false,
        },
        {
            label: __('Calendar'),
            value: 'calendar',
            multiple: false,
        },
    ];

    const templateOptions = [
        { label: __('Select Dropdown'), value: 'select' },
        { label: __('Radio Buttons'), value: 'radio' },
        { label: __('Checkboxes'), value: 'checkbox' },
    ];
    
    useEffect(() => {
        const updates = {};
        
        if (!attributes.filterFields || !Array.isArray(attributes.filterFields)) {
            updates.filterFields = [];
        }
        
        if (!attributes.taxonomyTerms) {
            updates.taxonomyTerms = {};
        }
        
        if (!attributes.metas) {
            updates.metas = {};
        }
        
        if (Object.keys(updates).length > 0) {
            setAttributes({ ...attributes, ...updates });
        }
    }, []);
    
    const handleAddField = () => {
        const filterFields = [ ...attributes.filterFields || [] ];
        filterFields.push( {
            type: 'taxonomy',
            label: 'Label',
            placeholder: 'Placeholder',
            info: 'Info',
            template:'select',
            options : {
                taxonomy:{
                    value:'',
                    options:[],
                    allOptions:true,
                    defaultOption:null,
                },
                metaKey:{
                    value:'',
                    options:[],
                    allOptions:true,
                    defaultOption:null,
                },
                order:{
                    options:[
                        {
                            label: __('Descending'),
                            value: 'desc',
                        },
                        {
                            label: __('Ascending'),
                            value: 'asc',
                        }
                    ],
                    defaultOption:'desc',

                },
                orderBy:{
                    options:[
                        {
                            label: __('Date'),
                            value: 'date',
                        },
                        {
                            label: __('Title'),
                            value: 'title',
                        },
                        {
                            label: __('Meta value'),
                            value: 'metaValue',
                        },
                        {
                            label: __('Meta value num'),
                            value: 'metaValueNum',
                        },
                    ],
                    metaKey:null,
                    defaultOption:'date',
                },
                search:true,
                calendar:{
                    options:[
                        {
                            label: __('Range Pick'),
                            value:true,
                        }
                    ]
                }
            }
        } );
        setAttributes( { filterFields } );
    };

    const handleRemoveField = ( index ) => {
        const filterFields = [ ...attributes.filterFields ];
        filterFields.splice( index, 1 );
        setAttributes( { filterFields } );
    };

    const updateField = (index, field) => {
        const updatedFields = [...attributes.filterFields];
        updatedFields[index] = { ...updatedFields[index], ...field };
        setAttributes({ filterFields: updatedFields });
    };

    const isFilterTypeUsed = (type) => {
        if (!attributes.filterFields || attributes.filterFields.length === 0) {
            return false;
        }
        
        const filterType = filterTypes.find(t => t.value === type);
        if (filterType && !filterType.multiple) {
            return attributes.filterFields.some(field => field.type === type);
        }
        return false;
    };

    const getAvailableFilterTypes = () => {
        return filterTypes.filter(type => {
            if (type.multiple) return true;
            return !isFilterTypeUsed(type.value);
        });
    };

    const renderTaxonomyOptions = (index, field) => {
        const { options } = field;

 
        return (
            <>
                <MuiSelect
                label={__('Taxonomy')}
                value={options.taxonomy.value}
                options={[{ label: __('Select Taxonomy'), value: '' }, ...postsByTabsSettings.taxonomies]}
                onChange={(value) => {
                    const updatedField = { ...field };
                    updatedField.options.taxonomy.value = value;
                    updateField(index, updatedField);
                }}
                />

                {postsByTabsSettings.taxonomies && 
                 postsByTabsSettings.taxonomies.length > 0 && 
                 postsByTabsSettings.taxonomies.map(tax => {
                    
                    if(!tax.terms || tax.terms.length === 0) {
                        return null;
                    }
                    
                    const selectedPostHasTaxonomy = tax.postTypes?.some(t => t.value === attributes.postType);
                    const taxonomyTerms = attributes.taxonomyTerms || {};
                    const currentTaxTerms = taxonomyTerms[tax.value] || {
                        label: tax.label,
                        value: tax.value,
                        selectedTerms: []
                    };

                    console.log('taxPostTypes', tax);
                    console.log('selectedPostType', attributes.postType);
                    console.log('selectedPostHasTaxonomy', selectedPostHasTaxonomy);
                    console.log('currentTaxTerms', currentTaxTerms);
                                
                    return (
                        <>
                        {selectedPostHasTaxonomy && <MuiMultipleSelect
                        key={tax.value}
                        terms={tax.terms}
                        selectedTerms={currentTaxTerms.selectedTerms}
                        label={`Select ${tax.label} terms`}
                        onChange={(newTerms) => handleTermsChange(tax, newTerms)}
                        />}
                        </>
                    );

                })}
                
                
                <ToggleControl
                label={__('Show all options')}
                checked={options.taxonomy.allOptions}
                onChange={() => {
                    const updatedField = { ...field };
                    updatedField.options.taxonomy.allOptions = !updatedField.options.taxonomy.allOptions;
                    updateField(index, updatedField);
                }}
                />
            </>
        );
    };

   /* const renderMetaKeyOptions = (index, field) => {
        const { options } = field;

        return(
        <>
        {postsByTabsSettings.metasByPostType && postsByTabsSettings.postTypes && postsByTabsSettings.postTypes.map(postType => {
                
                const hasMetaFields = postsByTabsSettings.metasByPostType && 
                    postsByTabsSettings.metasByPostType[postType.value] &&
                    Object.keys(postsByTabsSettings.metasByPostType[postType.value]).length > 0;

                const selectedPostHasMeta = postType.postTypes?.some(t => t.value === attributes.postType);
                const selectedMetas = attributes.metas[postType.value]?.selectedMetas || [];



                
                return ( 
                <>
                {hasMetaFields && 
                    <>
                    <MuiSelect
                    key={postType.value + '-filter-orderby-metafield'}
                    label={`Orderby ${postType.label} Meta`}
                    options={[
                        { label: __('Select meta key'), value: '' },
                        ...(hasMetaFields 
                            ? Object.values(postsByTabsSettings.metasByPostType[postType.value]).map(field => ({
                                label: field.label,
                                value: field.value
                            }))
                            : [])
                    ]}
                    value={attributes.orderByMetaKey || ''}
                    onChange={(value) => {
                        updateQuery({ orderByMetaKey: value });
                    }}
                    className={`${attributes.postType &&
                            attributes.postType === postType.value &&
                            ( attributes.orderBy === 'meta_value' || attributes.orderBy === 'meta_value_num' )  ? "" : "hidden"}`
                    }
                    />

                    {attributes.orderByMetaKey && 
                        <MuiMultipleSelect
                        key={postType.value + '-filter-orderby-metafield'}
                        terms={postsByTabsSettings.metasByPostType[postType.value][attributes.orderByMetaKey].options}
                        selectedTerms={selectedMetas}
                        label={`Select ${postType.label} Meta`}
                        onChange={(newMeta) => handleMetasChange(newMeta, newTerms)}
                        className={
                        `${field.options.metaKey.value === postType.value &&
                            attributes.postType && 
                            selectedPostHasMeta ? "" : "hidden"}`
                        }
                        />}
                    </>
                       
                }
                </>)
        })} 
        {attributes.orderByMetaKey && <ToggleControl
            label={__('Show all options')}
            checked={options.metaKey.allOptions}
            onChange={() => {
                const updatedField = { ...field };
                updatedField.options.metaKey.allOptions = !updatedField.options.metaKey.allOptions;
                updateField(index, updatedField);
            }}
        />
        }

        </>
        );

};*/

const renderMetaKeyOptions = (index, field) => {
    const { options } = field;

    return (
        <>
            <MuiSelect
                label={__('Meta Key')}
                value={options.metaKey.value}
                options={
                    [{ label: __('Select Meta Key'), value: '' }].concat(
                        postsByTabsSettings.metasByPostType && 
                        attributes.postType && 
                        postsByTabsSettings.metasByPostType[attributes.postType] 
                            ? Object.keys(postsByTabsSettings.metasByPostType[attributes.postType]).map(key => ({
                                label: postsByTabsSettings.metasByPostType[attributes.postType][key].label || key,
                                value: key
                              }))
                            : []
                    )
                }
                onChange={(value) => {
                    const updatedField = { ...field };
                    updatedField.options.metaKey.value = value;
                    updateField(index, updatedField);
                }}
            />
            
            {options.metaKey.value && postsByTabsSettings.metasByPostType && 
             attributes.postType && 
             postsByTabsSettings?.metasByPostType?.[attributes.postType] && 
             postsByTabsSettings?.metasByPostType?.[attributes.postType]?.[options.metaKey.value] && (
                <MuiMultipleSelect
                    key={`meta-values-${options.metaKey.value}`}
                    terms={postsByTabsSettings.metasByPostType[attributes.postType][options.metaKey.value].options || []}
                    selectedTerms={
                        attributes.metas && 
                        attributes.metas[options.metaKey.value] && 
                        attributes.metas[options.metaKey.value].selectedMetas || []
                    }
                    label={`Select values for ${options.metaKey.value}`}
                    onChange={(newMetas) => {
                        const metaObj = {
                            label: postsByTabsSettings.metasByPostType[attributes.postType][options.metaKey.value].label || options.metaKey.value,
                            value: options.metaKey.value
                        };
                        handleMetasChange(metaObj, newMetas);
                    }}
                />
            )}
            
            <ToggleControl
                label={__('Show all options')}
                checked={options.metaKey.allOptions}
                onChange={() => {
                    const updatedField = { ...field };
                    updatedField.options.metaKey.allOptions = !updatedField.options.metaKey.allOptions;
                    updateField(index, updatedField);
                }}
            />
        </>
    );
};

    const renderOrderByOptions = (index, field) => {
        const { options } = field;
        return (
            <>
                <MuiSelect
                label={__('Default Option')}
                value={options.orderBy.defaultOption}
                options={options.orderBy.options}
                onChange={(value) => {
                    const updatedField = { ...field };
                    updatedField.options.orderBy.defaultOption = value;
                    updateField(index, updatedField);
                }}
                />
                
                {(options.orderBy.defaultOption === 'metaValue' || options.orderBy.defaultOption === 'metaValueNum') && (
                    <MuiSelect
                    label={__('Meta Key for Ordering')}
                    value={options.orderBy.metaKey}
                    options={[
                        { label: __('Select Meta Key'), value: '' },
                        ...(postsByTabsSettings?.meta_keys || []).map(key => ({
                            label: key,
                            value: key
                        }))
                    ]}
                    onChange={(value) => {
                        const updatedField = { ...field };
                        updatedField.options.orderBy.metaKey = value;
                        updateField(index, updatedField);
                    }}
                    />
                )}
            </>
        );
    };

    const renderOrderOptions = (index, field) => {
        const { options } = field;
        return (
            <MuiSelect
            label={__('Default Order')}
            value={options.order.defaultOption}
            options={options.order.options}
            onChange={(value) => {
                const updatedField = { ...field };
                updatedField.options.order.defaultOption = value;
                updateField(index, updatedField);
            }}
            />
        );
    };

    const renderCalendarOptions = (index, field) => {
        const { options } = field;
        return (
            <MuiSelect
            label={__('Enable Range Picking')}
            value={options.calendar.options[0].value}
            onChange={() => {
                const updatedField = { ...field };
                updatedField.options.calendar.options[0].value = !updatedField.options.calendar.options[0].value;
                updateField(index, updatedField);
            }}
            />
        );
    };

    const renderFieldOptions = (index, field) => {
        switch (field.type) {
            case 'taxonomy':
                return renderTaxonomyOptions(index, field);
            case 'metaKey':
                return renderMetaKeyOptions(index, field);
            case 'orderby':
                return renderOrderByOptions(index, field);
            case 'order':
                return renderOrderOptions(index, field);
            case 'calendar':
                return renderCalendarOptions(index, field);
            default:
                return null;
        }
    };

    const renderFieldCard = (field, index) => {
        const fieldType = filterTypes.find(type => type.value === field.type);
        
        return (
            <Card key={index} className="filter-field-card" style={{ marginBottom: '16px' }}>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <IconButton>
                            <DragIndicatorIcon />
                        </IconButton>
                        <h3 className="lowercase">{fieldType?.label || field.type}</h3>
                        <IconButton  
                        onClick={() => handleRemoveField(index)}
                        >
                            <DeleteIcon />
                        </IconButton>
                    </div>
                </CardHeader>
                <CardBody>
                    <MuiSelect
                        label={__('Field Type')}
                        value={field.type}
                        options={getAvailableFilterTypes().concat(
                            isFilterTypeUsed(field.type) && !fieldType?.multiple 
                                ? [filterTypes.find(type => type.value === field.type)] 
                                : []
                        )}
                        onChange={(value) => {
                            const updatedField = { ...field, type: value };
                            updateField(index, updatedField);
                        }}
                    />
                    
                    <TextControl
                        label={__('Label')}
                        value={field.label}
                        onChange={(value) => updateField(index, { ...field, label: value })}
                    />
                    
                    <TextControl
                        label={__('Placeholder')}
                        value={field.placeholder}
                        onChange={(value) => updateField(index, { ...field, placeholder: value })}
                    />
                    
                    <TextControl
                        label={__('Info Text')}
                        value={field.info}
                        onChange={(value) => updateField(index, { ...field, info: value })}
                    />
                    
                    {field.type !== 'search' && (
                        <MuiSelect
                            label={__('Template')}
                            value={field.template}
                            options={templateOptions}
                            onChange={(value) => updateField(index, { ...field, template: value })}
                        />
                    )}
                    
                    {renderFieldOptions(index, field)}
                </CardBody>
            </Card>
        );
    };

    return (
        <div className="filter-fields-container">
            {Array.isArray(attributes.filterFields) && attributes.filterFields.length > 0 ? (
                attributes.filterFields.map((field, index) => renderFieldCard(field, index))
            ) : (
                <p>{__('No filter fields added yet. Click the button below to add your first filter field.')}</p>
            )}
            
            <Button 
                color="secondary"
                sx={{textTransform:"none", marginTop: '16px'}}
                size="small"
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAddField}
            >
                {__('Add Filter Field')}
            </Button>
        </div>
    );
}
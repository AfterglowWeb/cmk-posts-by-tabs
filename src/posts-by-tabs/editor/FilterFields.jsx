import { __ } from '@wordpress/i18n';
import { TextControl, PanelBody } from '@wordpress/components';
import { useEffect } from '@wordpress/element';

import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Switch from '@mui/material/Switch';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import MuiMultipleSelect from './MuiMultipleSelect';
import MuiSelect from './MuiSelect';
import FormControlLabel from '@mui/material/FormControlLabel';

export default function EditorFilterFields(props) {
    const { 
        attributes, 
        setAttributes, 
        postsByTabsSettings,
        selectedPostType,
        taxonomyTerms,
        updateQueryAttributes
    } = props;

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
            updateQueryAttributes(updates);
        }
    }, []);

    const handleTermsChange = (taxonomy, newTerms) => {
        const updatedTaxTerms = {
            ...attributes.taxonomyTerms,
            [taxonomy.value]: {
                label: taxonomy.label,
                value: taxonomy.value,
                selectedTerms: newTerms
            }
        };
        
        updateQueryAttributes({ taxonomyTerms: updatedTaxTerms });
    };

    const handleMetasChange = (meta, newMetas) => {
        const updatedMetas = {
            ...attributes.metas,
            [meta.value]: {
                label: meta.label,
                value: meta.value,
                selectedMetas: newMetas
            }
        };
        
        updateQueryAttributes({ metas: updatedMetas });
    };
    
    const handleAddField = () => {
        const filterFields = [ ...attributes.filterFields || [] ];
        filterFields.push({
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
        });
        
        // Use updateQueryAttributes to ensure both components are updated
        updateQueryAttributes({ filterFields });
    };

    const handleRemoveField = (index) => {
        const filterFields = [...attributes.filterFields];
        filterFields.splice(index, 1);
        updateQueryAttributes({ filterFields });
    };

    const updateField = (index, field) => {
        const updatedFields = [...attributes.filterFields];
        updatedFields[index] = { ...updatedFields[index], ...field };
        updateQueryAttributes({ filterFields: updatedFields });

        if (field.type === 'orderby' && 
            (field.options?.orderBy?.defaultOption === 'metaValue' || 
             field.options?.orderBy?.defaultOption === 'metaValueNum')) {
            updateQueryAttributes({ 
                orderByMetaKey: field.options.orderBy.metaKey 
            });
        }

        if (field.type === 'order' && field.options?.order?.defaultOption) {
            updateQueryAttributes({ 
                order: field.options.order.defaultOption
            });
        }
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
        const availableTaxonomies = postsByTabsSettings?.taxonomies?.filter(tax => 
            tax.postTypes?.some(t => t.value === selectedPostType)
        ) || [];

        return (
            <>
                <MuiSelect
                    label={__('Taxonomy')}
                    value={options.taxonomy.value}
                    options={[
                        { label: __('Select Taxonomy'), value: '' }, 
                        ...availableTaxonomies
                    ]}
                    onChange={(value) => {
                        const updatedField = { ...field };
                        updatedField.options.taxonomy.value = value;
                        updateField(index, updatedField);
                    }}
                />

                {options.taxonomy.value && availableTaxonomies.map(tax => {
                    if (tax.value !== options.taxonomy.value || !tax.terms?.length) {
                        return null;
                    }
                    
                    const taxonomyTerms = attributes.taxonomyTerms || {};
                    const currentTaxTerms = taxonomyTerms[tax.value] || {
                        label: tax.label,
                        value: tax.value,
                        selectedTerms: []
                    };
           
                    return (
                        <MuiMultipleSelect
                            key={tax.value}
                            terms={tax.terms}
                            selectedTerms={currentTaxTerms.selectedTerms}
                            label={`Select ${tax.label} terms`}
                            onChange={(newTerms) => handleTermsChange(tax, newTerms)}
                        />
                    );
                })}
                <FormControlLabel
                control={
                    <Switch
                    checked={options.taxonomy.allOptions}
                    onChange={() => {
                            const updatedField = { ...field };
                            const willSelectAll = !updatedField.options.taxonomy.allOptions;
                            updatedField.options.taxonomy.allOptions = willSelectAll;
                            
                            const currentTaxonomy = options.taxonomy.value;
                            const availableTaxonomy = availableTaxonomies.find(tax => tax.value === currentTaxonomy);
                            
                            if (currentTaxonomy && availableTaxonomy && availableTaxonomy.terms) {
                                const tax = {
                                    label: availableTaxonomy.label,
                                    value: availableTaxonomy.value
                                };
                                
                                if (willSelectAll) {
                                    const allTerms = availableTaxonomy.terms.map(term => term.value);
                                    handleTermsChange(tax, allTerms);
                                } 
                                else {
                                    handleTermsChange(tax, []);
                                }
                            }

                            updateField(index, updatedField);
                        }}
                    />}
                    label={__('Select all values')}
                />
            </>
        );
    };

    const renderMetaKeyOptions = (index, field) => {
        const { options } = field;
        const metaKeysForPostType = 
            postsByTabsSettings?.metasByPostType?.[selectedPostType] || {};

        return (
            <>
                <MuiSelect
                    label={__('Meta Key')}
                    value={options.metaKey.value}
                    options={
                        [{ label: __('Select Meta Key'), value: '' }].concat(
                            Object.keys(metaKeysForPostType).map(key => ({
                                label: metaKeysForPostType[key].label || key,
                                value: key
                            }))
                        )
                    }
                    onChange={(value) => {
                        const updatedField = { ...field };
                        updatedField.options.metaKey.value = value;
                        updateField(index, updatedField);
                    }}
                />
                
                {options.metaKey.value && 
                 metaKeysForPostType[options.metaKey.value]?.options?.length > 0 && (
                    <MuiMultipleSelect
                        key={`meta-values-${options.metaKey.value}`}
                        terms={metaKeysForPostType[options.metaKey.value].options}
                        selectedTerms={
                            attributes.metas?.[options.metaKey.value]?.selectedMetas || []
                        }
                        label={`Select values for ${metaKeysForPostType[options.metaKey.value].label || options.metaKey.value}`}
                        onChange={(newMetas) => {
                            const metaObj = {
                                label: metaKeysForPostType[options.metaKey.value].label || options.metaKey.value,
                                value: options.metaKey.value
                            };
                            handleMetasChange(metaObj, newMetas);
                        }}
                    />
                )}
                
                <FormControlLabel
                control={
                <Switch
                    checked={options.metaKey.allOptions}
                    onChange={() => {
                        const updatedField = { ...field };
                        const willSelectAll = !updatedField.options.metaKey.allOptions;
                        updatedField.options.metaKey.allOptions = willSelectAll;
                
                        const currentMetaKey = options.metaKey.value;
                        const metaKeysForPostType = postsByTabsSettings?.metasByPostType?.[selectedPostType] || {};
                        
                        if (currentMetaKey && metaKeysForPostType[currentMetaKey]?.options) {
                            const metaObj = {
                                label: metaKeysForPostType[currentMetaKey].label || currentMetaKey,
                                value: currentMetaKey
                            };
                            
                            if (willSelectAll) {
                                const allMetaValues = metaKeysForPostType[currentMetaKey].options.map(option => option.value);
                                handleMetasChange(metaObj, allMetaValues);
                            } 
                            else {
                                handleMetasChange(metaObj, []);
                            }
                        }
                
                        updateField(index, updatedField);
                    }}
                />}
                label={__('Select all values')}
                />
            </>
        );
    };

    const renderOrderByOptions = (index, field) => {
        const { options } = field;
        const metaKeysForPostType = 
            postsByTabsSettings?.metasByPostType?.[selectedPostType] || {};
        
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
                
                {(options.orderBy.defaultOption === 'metaValue' || 
                  options.orderBy.defaultOption === 'metaValueNum') && (
                    <MuiSelect
                        label={__('Meta Key for Ordering')}
                        value={options.orderBy.metaKey}
                        options={[
                            { label: __('Select Meta Key'), value: '' },
                            ...Object.keys(metaKeysForPostType).map(key => ({
                                label: metaKeysForPostType[key].label || key,
                                value: key
                            }))
                        ]}
                        onChange={(value) => {
                            const updatedField = { ...field };
                            updatedField.options.orderBy.metaKey = value;
                            updateField(index, updatedField);
                            
                            updateQueryAttributes({ orderByMetaKey: value });
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
                    updateQueryAttributes({ order: value });
                }}
            />
        );
    };

    const renderCalendarOptions = (index, field) => {
        const { options } = field;
        return (
            <Switch 
            label={__('Enable Range Picking')} 
            defaultChecked 
            checked={options.calendar.options[0].value}
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
             <Paper key={ index } className="p-2 mb-4" elevation={3}>
                <label className="mb-6 flex justify-between w-full items-center">
                        <IconButton aria-label={__('Drag to reorder')}>
                            <DragIndicatorIcon />
                        </IconButton>
                        <span className="block lowercase mb-0">{fieldType?.label || field.type}</span>
                        <IconButton  
                            aria-label={__('Remove field')}
                            onClick={() => handleRemoveField(index)}
                        >
                            <DeleteOutlineIcon />
                        </IconButton>
                </label>
               
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

                {field.type !== 'search' && (
                    <MuiSelect
                        label={__('Template')}
                        value={field.template}
                        options={templateOptions}
                        onChange={(value) => updateField(index, { ...field, template: value })}
                    />
                )}
                
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
                
                {renderFieldOptions(index, field)}
            
            </Paper>
        );
    };

    return (
        <PanelBody title={__('Filter Fields')} initialOpen={false}>
            {!selectedPostType ? (
                <p>{__('Please select a Post Type in Query Settings first to configure filters.')}</p>
            ) : (
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
            )}
        </PanelBody>
    );
}
import { __ } from '@wordpress/i18n';
import { PanelBody, Draggable } from '@wordpress/components';
import { useEffect, useState } from '@wordpress/element';

import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Switch from '@mui/material/Switch';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import MuiMultipleSelect from './MuiMultipleSelect';
import MuiSelect from './MuiSelect';
import FormControlLabel from '@mui/material/FormControlLabel';

import textInputStyle from '../styles/textInputStyle';

export default function EditorFilterFields(props) {
    
    const { 
        attributes, 
        postsByTabsSettings,
        selectedPostType,
        updateAttributes
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
            updateAttributes(updates);
        }
    }, []);

    const [draggedItemIndex, setDraggedItemIndex] = useState(null);

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
        
        updateAttributes({ filterFields });
    };

    const handleRemoveField = (index) => {
        const filterFields = [...attributes.filterFields];
        filterFields.splice(index, 1);
        updateAttributes({ filterFields });
    };

    const updateField = (index, field) => {
        const updatedFields = [...attributes.filterFields];
        updatedFields[index] = { ...updatedFields[index], ...field };
        updateAttributes({ filterFields: updatedFields });
    };

    const handleReorderFields = (fromIndex, toIndex) => {
        if (fromIndex === toIndex) return;
        
        const filterFields = [...attributes.filterFields];
        const [movedItem] = filterFields.splice(fromIndex, 1);
        filterFields.splice(toIndex, 0, movedItem);
        
        updateAttributes({ filterFields });
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

        const handleTermsChange = (taxonomy, newTerms) => {
            const updatedField = { ...field };
            if (!updatedField.options.taxonomy.terms) {
                updatedField.options.taxonomy.terms = [];
            }
            updatedField.options.taxonomy.terms = newTerms;
            updateField(index, updatedField);
        };

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
                    
                    const currentTaxTerms = options.taxonomy.terms || [];
           
                    return (
                        <>
                        <MuiMultipleSelect
                            key={tax.value}
                            values={tax.terms}
                            selectedValues={
                                options.taxonomy.allOptions ?
                                tax.terms.map(term => term.value) : currentTaxTerms
                            }
                            label={`Select ${tax.label} terms`}
                            onChange={(newTerms) => {
                                handleTermsChange(tax, newTerms)
                            }}
                        />
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
                                if (willSelectAll) {
                                    const allTerms = availableTaxonomy.terms.map(term => term.value);
                                    handleTermsChange(availableTaxonomy, allTerms);
                                } 
                                else {
                                    handleTermsChange(availableTaxonomy, []);
                                }
                            }

                            updateField(index, updatedField);
                        }}
                        />}
                        label={__('Select all values')}
                        />
                        </>
                    );
                })}
                
            </>
        );
    };

    const renderMetaKeyOptions = (index, field) => {
        const { options } = field;
        const metaKeysForPostType = postsByTabsSettings?.metasByPostType?.[selectedPostType] || {};

        const getNormalizedMetaOptions = (metaKey) => {
            if (!metaKey || !metaKeysForPostType[metaKey]) return [];
            
            const metaData = metaKeysForPostType[metaKey];
            let allValues = [];
            
            if (Array.isArray(metaData.options)) {

                const flattenArray = (arr) => {
                    return arr.reduce((acc, val) => {
                        if (Array.isArray(val)) {
                            return [...acc, ...flattenArray(val)];
                        }
                        return [...acc, val];
                    }, []);
                };
                
                allValues = flattenArray(metaData.options);
            }

            
            
            allValues = allValues.filter(val => val !== null && val !== undefined && val !== '');
            allValues = [...new Set(allValues)];
            console.log('All Values:', allValues);
            
            return allValues.map(val => ({
                label: val.label || val,
                value: val.value || val
            }));
        };

        const handleMetasChange = (metaKey, newMetas) => {
            const updatedField = { ...field };
            
            if (!updatedField.options.metaKey.selectedMetas) {
                updatedField.options.metaKey.selectedMetas = [];
            }
            
            updatedField.options.metaKey.selectedMetas = newMetas;
            
            updateField(index, updatedField);
        };

        const getMetaLabel = (key) => {
            if (!metaKeysForPostType[key]) return key;
            return metaKeysForPostType[key].label || key;
        };

        
        return (
            <>
                <MuiSelect
                    label={__('Meta Key')}
                    value={options.metaKey.value}
                    options={
                        [{ label: __('Select Meta Key'), value: '' }].concat(
                            Object.keys(metaKeysForPostType).map(key => ({
                                label: getMetaLabel(key),
                                value: key
                            }))
                        )
                    }
                    onChange={(value) => {
                        const updatedField = { ...field };
                        updatedField.options.metaKey.value = value;
                        if (value) {
                            updatedField.options.metaKey.options = getNormalizedMetaOptions(value);
                        }
                        
                        updateField(index, updatedField);
                    }}
                />
                
                {options.metaKey?.value && options.metaKey?.options && (
                    <MuiMultipleSelect
                        key={`meta-values-${options.metaKey.value}`}
                        values={options.metaKey.options}
                        selectedValues={options.metaKey.selectedMetas || []}
                        label={`Select values for ${getMetaLabel(options.metaKey.value)}`}
                        onChange={(newMetas) => {
                            handleMetasChange(options.metaKey.value, newMetas);
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
                        
                        if (currentMetaKey) {
                            const normalizedOptions = getNormalizedMetaOptions(currentMetaKey);
                            
                            if (willSelectAll) {
                                const allMetaValues = normalizedOptions.map(opt => opt.value);
                                handleMetasChange(currentMetaKey, allMetaValues);
                            } else {
                                handleMetasChange(currentMetaKey, []);
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
            <FormControlLabel
            control={
                <Switch 
                    checked={options.calendar.options[0].value}
                    onChange={() => {
                        const updatedField = { ...field };
                        updatedField.options.calendar.options[0].value = !updatedField.options.calendar.options[0].value;
                        updateField(index, updatedField);
                    }}
                />
            }
            label={__('Enable Range Picking')}
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
        const draggableId = `filter-field-${index}`;
        
        return (
            <div 
                id={draggableId} 
                key={index}
                onDragOver={(e) => {
                    e.preventDefault();
                    e.currentTarget.classList.add('drag-over');
                }}
                onDragLeave={(e) => {
                    e.currentTarget.classList.remove('drag-over');
                }}
                onDrop={(e) => {
                    e.preventDefault();
                    e.currentTarget.classList.remove('drag-over');
                    
                    if (draggedItemIndex !== null && draggedItemIndex !== index) {
                        handleReorderFields(draggedItemIndex, index);
                    }
                    
                    setDraggedItemIndex(null);
                }}
                className="filter-field-container"
            >
                <Paper className="p-2 mb-4" elevation={3}>
                    <label className="mb-2 flex justify-between w-full items-center">
                        <Draggable 
                            elementId={draggableId} 
                            transferData={{ index, field }}
                        >
                            {({ onDraggableStart, onDraggableEnd }) => (
                                <div
                                    draggable="true"
                                    onDragStart={(e) => {
                                        setDraggedItemIndex(index);
                                        onDraggableStart(e);
                                    }}
                                    onDragEnd={(e) => {
                                        onDraggableEnd(e);
                                        setTimeout(() => {
                                            setDraggedItemIndex(null);
                                        }, 50);
                                    }}
                                    className="drag-handle"
                                >
                                    <IconButton aria-label={__('Drag to reorder')}>
                                        <DragIndicatorIcon />
                                    </IconButton>
                                </div>
                            )}
                        </Draggable>
                        <span className="block font-bold mb-0">{fieldType?.label || field.type}{field.label ? `: ${field.label}` : ''}</span>
                        <IconButton  
                            aria-label={__('Remove field')}
                            onClick={() => handleRemoveField(index)}
                        >
                            <DeleteOutlineIcon />
                        </IconButton>
                    </label>
                    <PanelBody title={__('Settings')} initialOpen={false}>
                        <div className="pt-4">
                            
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
                                    onChange={(value) => {
                                        const updatedField = { ...field, template: value };
                                        updateField(index, updatedField)
                                    }
                                    }
                                />
                            )}

                            <FormControl fullWidth>
                                <TextField
                                label={__('Label')}
                                value={field.label}
                                onChange={(event) => {
                                    updateField(index, { ...field, label: event.target.value })
                                }}
                                variant="standard"
                                sx={textInputStyle}
                                />

                                <TextField
                                label={__('Placeholder')}
                                value={field.placeholder}
                                onChange={(event) => updateField(index, { ...field, placeholder: event.target.value })}
                                variant="standard"
                                sx={textInputStyle}
                                />
                                
                                <TextField
                                label={__('Info Text')}
                                value={field.info}
                                onChange={(event) => updateField(index, { ...field, info: event.target.value })}
                                variant="standard"
                                sx={textInputStyle}
                                />
                            </FormControl>
                            
                            {renderFieldOptions(index, field)}

                        </div>
                    </PanelBody>
                </Paper>
            </div>
        );
    };

    return (
        <PanelBody title={__('Filter Fields')} initialOpen={false}>
            {!selectedPostType ? (
                <p>{__('Please select a Post Type in Query Settings first to configure filters.')}</p>
            ) : (
                <div 
                    className="filter-fields-container"
                    onDragOver={(e) => {
                        if (!e.target.closest('.filter-field-container')) {
                            e.preventDefault();
                            e.currentTarget.classList.add('drag-over-container');
                        }
                    }}
                    onDragLeave={(e) => {
                        if (!e.target.closest('.filter-field-container')) {
                            e.currentTarget.classList.remove('drag-over-container');
                        }
                    }}
                    onDrop={(e) => {
                        if (!e.target.closest('.filter-field-container')) {
                            e.preventDefault();
                            e.currentTarget.classList.remove('drag-over-container');
                            
                            if (draggedItemIndex !== null && attributes.filterFields) {
                                handleReorderFields(draggedItemIndex, attributes.filterFields.length - 1);
                            }
                            
                            setDraggedItemIndex(null);
                        }
                    }}
                >
                    {Array.isArray(attributes.filterFields) && attributes.filterFields.length > 0 && (
                        attributes.filterFields.map((field, index) => renderFieldCard(field, index))
                    )}

                    <div className="flex gap-4 py-2">
                        <Button 
                        variant="contained" 
                        size="small" 
                        color="secondary"
                        startIcon={<AddIcon />}
                        sx={{textTransform:"none"}}
                        onClick={handleAddField} >
                            { __( 'Add a filter field' ) }
                        </Button>
                    </div>
                    
                    <style jsx>{`
                        .filter-field-container.drag-over {
                            border-top: 2px solid #007cba;
                        }
                        .filter-fields-container.drag-over-container {
                            border-bottom: 2px solid #007cba;
                        }
                        .drag-handle {
                            cursor: grab;
                        }
                        .drag-handle:active {
                            cursor: grabbing;
                        }
                    `}</style>
                </div>
            )}
        </PanelBody>
    );
}
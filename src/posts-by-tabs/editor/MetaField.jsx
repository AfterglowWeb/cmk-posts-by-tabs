import { __ } from '@wordpress/i18n';
import { useEffect, useState } from '@wordpress/element';
import { SelectControl, DatePicker, TextControl, CheckboxControl } from '@wordpress/components';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';


const types = [
    {
        label: __('String'),
        value: 'CHAR',
    },
    {
        label: __('Number'),
        value: 'NUMERIC',
    },
    {
        label: __('Date'),
        value: 'DATE',
    },
    {
        label: __('Boolean'),
        value: 'BOOLEAN',
    },
];
const compares = [
    {
        label: __('='),
        value: '=',
    },
    {
        label: __('!='),
        value: '!=',
    },
    {
        label: __('>'),
        value: '>',
    },
    {
        label: __('>='),
        value: '>=',
    },
    {
        label: __('<'),
        value: '<',
    },
    {
        label: __('<='),
        value: '<=',
    },
    {
        label: __('LIKE'),
        value: 'LIKE',
    },
    {
        label: __('NOT LIKE'),
        value: 'NOT LIKE',
    },
    {
        label: __('IN'),
        value: 'IN',
    },
    {
        label: __('NOT IN'),
        value: 'NOT IN',
    },
    {
        label: __('BETWEEN'),
        value: 'BETWEEN',
    },
    {
        label: __('NOT BETWEEN'),
        value: 'NOT BETWEEN',
    },
    {
        label: __('EXISTS'),
        value: 'EXISTS',
    },
    {
        label: __('NOT EXISTS'),
        value: 'NOT EXISTS',
    },
];

const metaCache = {};

function useMetaFields(postType) {
    const [isLoading, setIsLoading] = useState(false);
    const [metaFields, setMetaFields] = useState([]);
    const [availableValues, setAvailableValues] = useState({});
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!postType) return;

        if (metaCache[postType]) {
            setMetaFields(metaCache[postType].metaFields);
            setAvailableValues(metaCache[postType].availableValues);
            return;
        }

        setIsLoading(true);
        setError(null);
        
        wp.apiFetch({ path: `/posts-by-tabs/v1/meta/${postType}` })
            .then((metas) => {
                const metaArray = [];
                const metaValues = {};

                Object.keys(metas).forEach((meta) => {
                    if (!meta.startsWith('_')) {
                        const metaLabel = meta.split('_').join(' ')
                        metaArray.push({
                            label: metaLabel.charAt(0).toUpperCase() + metaLabel.slice(1),
                            value: meta
                        });

                        metaValues[meta] = metas[meta].map(val => ({
                            label: String(val),
                            value: String(val)
                        }));
                    }
                });


                setMetaFields(metaArray);
                setAvailableValues(metaValues);
  
                metaCache[postType] = {
                    metaFields: metaArray,
                    availableValues: metaValues
                };
            })
            .catch(error => {
                console.error(`Error fetching meta fields for ${postType}:`, error);
                setError(error);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [postType]);

    return { isLoading, metaFields, availableValues, error };
}

export default function MetaField(props) {
    
    const { attributes, setAttributes, metaField, index } = props;

    const { 
        isLoading, 
        metaFields, 
        availableValues 
    } = useMetaFields(attributes.postType);

    const handleMetaFieldValueChange = (value, key, index) => {
        const updatedMetaFields = { 
            ...attributes.metaFields,
            fields: [...attributes.metaFields.fields]
        };
        updatedMetaFields.fields[index][key] = value;
        setAttributes({ metaFields: updatedMetaFields });
    };

    const handleRemoveMetaField = (index) => {
        const updatedMetaFields = {
            ...attributes.metaFields,
            fields: [...attributes.metaFields.fields]
        };
        updatedMetaFields.fields.splice(index, 1);
        setAttributes({ metaFields: updatedMetaFields });
    };

    if (isLoading) {
        return <div>Initializing meta fields...</div>
    }

    function freeFieldByType( type, value ) {
        switch ( type ) {
            case 'CHAR':
                return <TextControl 
                label={__('My string value')} 
                value={value || ''} 
                onChange={(newValue) => handleMetaFieldValueChange(newValue, 'value', index)} />
            case 'NUMERIC':
                return <TextControl 
                label={__('My number value')} 
                type="number" value={value || 0} 
                onChange={(newValue) => handleMetaFieldValueChange(newValue, 'value', index)} />
            case 'DATE':
                
                let dateValue;
                try {
                    if (!value) {
                        dateValue = wpDate();
                    } else if (typeof value === 'string') {
                        dateValue = wpDate(value);
                        if (isNaN(dateValue.getTime())) {
                            dateValue = wpDate();
                        }
                    } else {
                        dateValue = wpDate(value);
                    }
                } catch (e) {
                    console.error("Error parsing date:", e);
                    dateValue = wpDate();
                }

                console.log(dateValue);
    
                return <DatePicker 
                label={__('My date value')} 
                currentDate={dateValue} 
                onChange={(newValue) => handleMetaFieldValueChange(wpDate(newValue), 'value', index)} />

            case 'BOOLEAN':
                return <CheckboxControl 
                label={__('My boolean value')} 
                checked={!!value} 
                onChange={(newValue) => handleMetaFieldValueChange(newValue, 'value', index)} />
            
            default:
                return <TextControl 
                label={__('My string value')} 
                value={value || ''} 
                onChange={(newValue) => handleMetaFieldValueChange(newValue, 'value', index)} 
                />
        }
    }

    return (
        <Paper className="p-2 mb-4" elevation={2}>
            <div className="mb-2 flex justify-between">
                <h3 className="lowercase">{__('Meta query')} {index + 1}</h3>
                <Button 
                variant="outlined" 
                size="small" 
                color="secondary"
                sx={{textTransform:"none"}} 
                onClick={() => handleRemoveMetaField(index)} >
                    { __( 'Remove' ) }
                </Button>
            </div>
            <div className="mb-2">
                    <SelectControl
                        label="Key"
                        value={ metaField?.key || '' }
                        options={metaFields}
                        onChange={ ( value ) => {
                            handleMetaFieldValueChange(value, 'key', index);
                            handleMetaFieldValueChange('', 'value', index);
                        }}
                    />

                    <SelectControl
                        label="Type"
                        value={ metaField?.type || 'CHAR' }
                        options={types}
                        onChange={ ( value ) => {handleMetaFieldValueChange(value, 'type', index)} }
                    />


                    {metaField?.isUserValue ?
                        <div className="bg-gray-100 p-2 mb-2">
                            <span className="block font-bold my-2">{__('Choose a TYPE to change the input field')}</span>
                            {freeFieldByType(metaField?.type, metaField?.value)}
                        </div>
                    :
                        <SelectControl
                            label="Value"
                            value={metaField?.value || ''}
                            options={
                                metaField?.key && availableValues[metaField.key] && Array.isArray(availableValues[metaField.key])
                                    ? [{ label: __('Select a value'), value: '' }, ...availableValues[metaField.key]] 
                                    : [{ label: __('Select a value'), value: '' }]
                            }
                            onChange={(value) => handleMetaFieldValueChange(value, 'value', index)}
                        />
                    }


                    <div className="bg-gray-100 p-2 mb-2 rounded-[2px]">
                        <CheckboxControl 
                        label={__('No, enter my value')} 
                        checked={metaField?.isUserValue} 
                        onChange={(value) => handleMetaFieldValueChange(value, 'isUserValue', index)} />
                    </div>
  
                
                    {metaField?.type === 'DATE' &&
                    <div className="bg-gray-100 p-2 mb-2 rounded-[2px]">
                        <CheckboxControl 
                        label={__('Today')} 
                        checked={metaField?.isDateToday} 
                        onChange={(value) => {
                            handleMetaFieldValueChange(value, 'isDateToday', index);
                            if (value) {
                                handleMetaFieldValueChange(wpDate(value), 'value', index);
                            }
                        }} />
                    </div>
                    }

                   
                    <SelectControl
                        label="Compare"
                        value={ metaField?.compare || '' }
                        options={compares}
                        onChange={ ( value ) => {handleMetaFieldValueChange(value, 'compare', index)} }
                    />
            </div>
        </Paper>
    );
}

function wpDate(date = new Date()) {
    if (!(date instanceof Date)) {
        date = new Date();
    }
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
} 
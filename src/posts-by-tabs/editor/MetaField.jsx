import { __ } from '@wordpress/i18n';
import { useEffect, useState } from '@wordpress/element';
import { SelectControl, DatePicker, TextControl, PanelBody, CheckboxControl } from '@wordpress/components';
import { MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
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

export default function MetaField(props) {
    
    const { attributes, setAttributes, metaField, index } = props;
    const [isLoading, setIsLoading] = useState(false);
    const [metaFields, setMetaFields] = useState([]);
    const [availableValues, setAvailableValues] = useState([]);
    //const { metaFields, relation } = attributes;
    //const metaFields = attributes.metaFields || { relation: 'AND', fields: [] };

    useEffect(() => {
        setIsLoading(true);
        wp.apiFetch({ path: `/posts-by-tabs/v1/meta/${attributes.postType}` }).then((metas) => {
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
            setIsLoading(false);
            
            if (!attributes.postType) {
                setAttributes({ postType: 'post' });
            }
        }).catch(error => {
            console.error("Error fetching meta fields:", error);
            setIsLoading(false);
        });
    }, [attributes.postType]);
    
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
                return <TextControl label="My Value" value={value} onChange={(newValue) => handleMetaFieldValueChange(newValue, 'value', index)} />
            case 'NUMERIC':
                return <TextControl label="My Value" type="number" value={value} onChange={(newValue) => handleMetaFieldValueChange(newValue, 'value', index)} />
            case 'DATE':
                return <DatePicker label="My Value" currentDate={value || new Date()} onChange={(newValue) => handleMetaFieldValueChange(newValue, 'value', index)} />
            case 'BOOLEAN':
                return <CheckboxControl label="My Value" checked={value} onChange={(newValue) => handleMetaFieldValueChange(newValue, 'value', index)} />
            default:
                return null;
        }
    }

    return (
        <Paper className="p-2 mb-4" elevation={3}>
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
                        onChange={ ( value ) => {handleMetaFieldValueChange(value, 'key', index)} }
                    />
                    {metaField?.isUserValue ?
                        <div className="bg-gray-100 p-2 mb-2">
                            <p className="font-bold my-1">{__('Select TYPE to change the input field')}</p>
                            {freeFieldByType(metaField?.type, metaField?.value)}
                        </div>
                    :
                        <SelectControl
                            label="Value"
                            value={metaField?.value || ''}
                            options={
                                metaField?.key && availableValues[metaField.key] 
                                    ? [{ label: __('Select a value'), value: '' }, ...availableValues[metaField.key]]
                                    : [{ label: __('Select a value'), value: '' }]
                            }
                            onChange={(value) => handleMetaFieldValueChange(value, 'value', index)}
                        />
                    }
                    <CheckboxControl label={__('No, enter my value')} checked={metaField?.isUserValue} onChange={(value) => handleMetaFieldValueChange(value, 'isUserValue', index)} />
                    <SelectControl
                        label="Type"
                        value={ metaField?.type || 'CHAR' }
                        options={types}
                        onChange={ ( value ) => {handleMetaFieldValueChange(value, 'type', index)} }
                    />
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
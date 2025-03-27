import { __ } from '@wordpress/i18n';
import { useEffect, useState } from '@wordpress/element';
import { SelectControl, TextControl, PanelBody, CheckboxControl } from '@wordpress/components';
import { MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';

const relations = [
    {
        label: __('And'),
        value: 'AND',
    },
    {
        label: __('Or'),
        value: 'OR',
    },
];
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

const keys = [
    { label: __('Select a key'), value: '' },
    { label: __('Custom field placeholder'), value: 'custom_field' },
    // This will be replaced later
];

// Placeholder for the values - to be replaced later with actual data
const values = [
    { label: __('Select a value'), value: '' },
    { label: __('Value placeholder'), value: 'value' },
    // This will be replaced later
];

export default function MetaFields(props) {
    
    const { attributes, setAttributes } = props;
    const [isLoading, setIsLoading] = useState(false);
    const [metaFields, setMetaFields] = useState([]);
    const [availableTypes, setAvailableTypes] = useState([]);
    const [availableValues, setAvailableValues] = useState([]);
    const [availableKeys, setAvailableKeys] = useState([]);
    const [availableCompares, setAvailableCompares] = useState([]);
    const [availableRelations, setAvailableRelations] = useState([]);
    //const { metaFields, relation } = attributes;
    //const metaFields = attributes.metaFields || { relation: 'AND', fields: [] };

    useEffect(() => {
        setIsLoading(true);
        wp.apiFetch({ path: `/posts-by-tabs/v1/meta/${attributes.postType}` }).then((metas) => {
            const metaFields = [];
            Object.keys(metas).forEach((meta) => {

                if (!meta.startsWith('_')) {
                    const metaLabel = meta.split('_').join(' ')
                    metaFields.push({
                        label: metaLabel.charAt(0).toUpperCase() + metaLabel.slice(1),
                        value: meta
                    });
                }
            });
    
            setMetaFields(availableTypes);
            setIsLoading(false);
            
            if (!attributes.postType) {
                setAttributes({ postType: 'post' });
            }
        });
    }, []);

    useEffect(() => {
        if (attributes.metaFields === undefined ||
            typeof attributes.metaFields !== 'object' || 
            !attributes.metaFields.fields ||
            !Array.isArray(attributes.metaFields.fields)) {
            
            setAttributes({
                metaFields: {
                    'relation': 'AND',
                    'fields': []
                }
            });
        }
    }, []);

    
    const handleMetaFieldValueChange = (value, key, index) => {
        const updatedMetaFields = { 
            ...attributes.metaFields,
            fields: [...attributes.metaFields.fields]
        };
        updatedMetaFields.fields[index][key] = value;
        setAttributes({ metaFields: updatedMetaFields });
    };

    const handleRelationChange = (value) => {
        const updatedMetaFields = {
            ...attributes.metaFields,
            relation: value
        };
        setAttributes({ metaFields: updatedMetaFields });
    };
    
    const handleAddMetaField = () => {
        const updatedMetaFields = {
            ...attributes.metaFields,
            fields: [
                ...(attributes.metaFields?.fields || []),
                {
                    key: '',
                    value: '',
                    compare: '=',
                    type: 'CHAR',
                }
            ]
        };
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

    if (!attributes.metaFields || !Array.isArray(attributes.metaFields.fields)) {
        return <div>Initializing meta fields...</div>;
    }

    return (
    <>
    <div className="py-2">
    <SelectControl
        label="Relation"
        value={attributes.metaFields.relation || 'AND'}
        options={relations}
        onChange={(value) => handleRelationChange(value)}
    />
    </div>
    {Array.isArray(attributes.metaFields.fields) && attributes.metaFields.fields.map( ( metaField, index ) => {
        return (
        <Paper key={ index } className="p-2 mb-4" elevation={3}>
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
                <PanelBody title={__('Textes')} initialOpen={true}>
                    <SelectControl
                        label="Key"
                        value={ metaField?.key || '' }
                        options={keys}
                        onChange={ ( value ) => {handleMetaFieldValueChange(value, 'key', index)} }
                    />
                    <SelectControl
                        label="Value"
                        value={ metaField?.value || '' }
                        options={values}
                        onChange={ ( value ) => {handleMetaFieldValueChange(value, 'value', index)} }
                    />
                    <SelectControl
                        label="Compare"
                        value={ metaField?.compare || '' }
                        options={compares}
                        onChange={ ( value ) => {handleMetaFieldValueChange(value, 'compare', index)} }
                    />
                    <SelectControl
                        label="Type"
                        value={ metaField?.type || '' }
                        options={types}
                        onChange={ ( value ) => {handleMetaFieldValueChange(value, 'type', index)} }
                    />
                </PanelBody>
            </div>
        </Paper>
        )
    })}
    <Button 
    variant="contained" 
    size="small" 
    color="secondary"
    sx={{textTransform:"none"}}
    onClick={handleAddMetaField} >
        { __( 'Add a meta query' ) }
    </Button>
    </>
);
}
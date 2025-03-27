import { __ } from '@wordpress/i18n';
import { useEffect } from '@wordpress/element';
import { SelectControl, TextControl, PanelBody, CheckboxControl } from '@wordpress/components';
import { MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';

export default function MetaFields(props) {
    
    const { attributes, setAttributes } = props;
    const { metaFields, relation } = attributes;
    
    
    const handleMetaFieldValueChange = (value, key, index) => {
        const metaFields = [ ...attributes.metaFields ];
        metaFields[ index ][key] = value;
        setAttributes( { metaFields } );
    };

    
    
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

    useEffect(() => {
        if (!attributes.metaFields || !Array.isArray(attributes.metaFields)) {
            setAttributes({ metaFields: [] });
        }
    }, [attributes.tabs, setAttributes]);
    
    const handleAddMetaField = () => {
        const metaFields = [ ...attributes.metaFields || [] ];
        metaFields.push({
            key:'',
            value: '',
            compare: '=',
            type: 'CHAR',
        });
        setAttributes({metaFields});
    };

    const handleRemoveMetaField = ( index ) => {
        const metaFields = [ ...attributes.metaFields ];
        metaFields.splice( index, 1 );
        setAttributes( { metaFields } );
    };

    return (
    <>
    <SelectControl
        label="Relation"
        value={ relation || '' }
        options={relations}
        onChange={ ( value ) => {handleMetaFieldValueChange(value, 'relation', index)} }
    />
    {metaFields && metaFields.map( ( metaField, index ) => {
        return (
        <Paper key={ index } className="p-2 mb-4" elevation={3}>
            <div className="mb-2 flex justify-between">
                <h3 className="lowercase">{__('Onglet')} {index + 1}</h3>
                <Button 
                variant="outlined" 
                size="small" 
                color="secondary"
                sx={{textTransform:"none"}} 
                onClick={() => handleRemoveMetaField(index)} >
                    { __( 'Supprimer' ) }
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
        { __( 'Ajouter un onglet' ) }
    </Button>
    </>
);
}
import { __ } from '@wordpress/i18n';
import { useEffect, useReducer } from '@wordpress/element';
import { DatePicker, TextControl, CheckboxControl, PanelBody } from '@wordpress/components';
import IconButton from '@mui/material/IconButton';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import Paper from '@mui/material/Paper';
import MuiSelect from './MuiSelect';

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

function metaFieldReducer(state, action) {
    switch (action.type) {
        case 'SET_KEY':
            return {
                ...state,
                key: action.payload,
                value: '',
                compare: state.compare || '=',
                type: 'CHAR',
            };
        
        case 'SET_VALUE':
            return {
                ...state,
                value: action.payload
            };
      
        case 'SET_TYPE':
            let defaultValue = '';
            switch (action.payload) {
                case 'NUMERIC':
                    defaultValue = state.value && !isNaN(state.value) ? state.value : '0';
                    break;
                case 'DATE':
                    defaultValue = state.value && isValidDate(state.value) ? state.value : wpDate();
                    break;
                case 'BOOLEAN':
                    defaultValue = !!state.value;
                    break;
                default:
                    defaultValue = state.value || '';
            }
        
            return {
                ...state,
                type: action.payload,
                value: defaultValue
            };
      
        case 'TOGGLE_USER_VALUE':
            return {
                ...state,
                isUserValue: action.payload,
                value: action.payload ? '' : '',
                isDateToday: action.payload ? false : state.isDateToday
            };
      
        case 'SET_TODAY':
            return {
                ...state,
                isDateToday: action.payload,
                value: action.payload ? wpDate() : '',
                isUserValue: action.payload ? false : state.isUserValue
            };
      
        case 'SET_COMPARE':
            return {
                ...state,
                compare: action.payload
            };
        
        case 'SYNC_WITH_PROPS':
            return {
                ...action.payload
            };
            
        default:
            return state;
    }
}

export default function MetaField(props) {
    const { attributes, updateAttributes, metaField, index, postsByTabsSettings } = props;
    
    const initialState = {
      key: metaField?.key || '',
      value: metaField?.value || '',
      type: metaField?.type || 'CHAR',
      compare: metaField?.compare || '=',
      isUserValue: metaField?.isUserValue || false,
      isDateToday: metaField?.isDateToday || false
    };
    
    const [state, dispatch] = useReducer(metaFieldReducer, initialState);
    
    useEffect(() => {
      if (metaField && 
          (metaField.key !== state.key || 
           metaField.value !== state.value ||
           metaField.type !== state.type ||
           metaField.compare !== state.compare ||
           metaField.isUserValue !== state.isUserValue ||
           metaField.isDateToday !== state.isDateToday)) {
        dispatch({ 
          type: 'SYNC_WITH_PROPS', 
          payload: {
            key: metaField.key || '',
            value: metaField.value || '',
            type: metaField.type || 'CHAR',
            compare: metaField.compare || '=',
            isUserValue: !!metaField.isUserValue,
            isDateToday: !!metaField.isDateToday
          }
        });
      }
    }, [metaField]);

    const hasMetaFields = postsByTabsSettings?.metasByPostType && 
    postsByTabsSettings.metasByPostType[attributes.postType];

    const metaFields = hasMetaFields ? Object.entries(postsByTabsSettings.metasByPostType[attributes.postType])
    .map(([key, field]) => ({
    label: field.label,
    value: key
    })) : [];
    

    const updateMetaField = () => {
      const updatedMetaFields = { 
        ...attributes.metaFields,
        fields: [...attributes.metaFields.fields]
      };
      updatedMetaFields.fields[index] = {
        ...updatedMetaFields.fields[index],
        ...state
      };
      updateAttributes({ metaFields: updatedMetaFields });
    };
    
    useEffect(() => {
      updateMetaField();
    }, [state]);

    const handleRemoveMetaField = (index) => {
        const updatedMetaFields = {
            ...attributes.metaFields,
            fields: [...attributes.metaFields.fields]
        };
        updatedMetaFields.fields.splice(index, 1);
        updateAttributes({ metaFields: updatedMetaFields });
    };

    if (!hasMetaFields) {
        return <div className="bg-gray-100 p-2 mb-2 rounded-[2px]">No meta fields available for this post type</div>
    }


    function freeFieldByType(type, value) {
        switch (type) {
            case 'CHAR':
                return (
                  <TextControl 
                    label={__('Custom string value')} 
                    value={value || ''} 
                    onChange={(newValue) => dispatch({ type: 'SET_VALUE', payload: newValue })} 
                  />
                );
                
            case 'NUMERIC':
                return (
                  <TextControl 
                    label={__('Custom numeric value')} 
                    type="number" 
                    value={value === '' ? '' : (value || 0)} 
                    onChange={(newValue) => dispatch({ type: 'SET_VALUE', payload: newValue })} 
                  />
                );
                
            case 'DATE':
                let dateValue;
                try {
                    if (!value) {
                        dateValue = new Date();
                    } else if (typeof value === 'string') {
                        dateValue = new Date(value);
                        if (isNaN(dateValue.getTime())) {
                            dateValue = new Date();
                        }
                    } else {
                        dateValue = new Date(value);
                    }
                } catch (e) {
                    console.error("Error parsing date:", e);
                    dateValue = new Date();
                }
    
                return (
                  <DatePicker 
                    label={__('Custom date value')} 
                    currentDate={dateValue} 
                    onChange={(newDate) => {
                      const formattedDate = wpDate(newDate);
                      dispatch({ type: 'SET_VALUE', payload: formattedDate });
                    }} 
                  />
                );

            case 'BOOLEAN':
                return (
                  <CheckboxControl 
                    label={__('Custom boolean value')} 
                    checked={!!value} 
                    onChange={(newValue) => dispatch({ type: 'SET_VALUE', payload: newValue })} 
                  />
                );
            
            default:
                return (
                  <TextControl 
                    label={__('Custom value')} 
                    value={value || ''} 
                    onChange={(newValue) => dispatch({ type: 'SET_VALUE', payload: newValue })} 
                  />
                );
        }
    }

    const getValueOptions = () => {
        if (!state.key || !hasMetaFields || !postsByTabsSettings.metasByPostType[attributes.postType][state.key]?.options) {
          return [{ label: __('Select meta value'), value: '' }];
        }
        
        const options = postsByTabsSettings.metasByPostType[attributes.postType][state.key].options;
        
        return [
          { label: __('Select meta value'), value: '' }, 
          ...options.map(val => ({
              label: String(val),
              value: String(val)
          }))
        ];
      };

    return (
        <Paper className="p-2 mb-4" elevation={3}>
            <label className="mb-2 flex justify-between w-full items-center">
                <span className="block w-10" />
                <span className="block font-bold mb-0">{__('Meta query')} {index + 1} {`: ${state.key ? state.key : ''}`}</span>
                <IconButton  
                aria-label={__('Remove')}
                onClick={() => handleRemoveMetaField(index)} 
                >
                    <DeleteOutlineIcon />
                </IconButton>
            </label>

            <PanelBody title={__('Settings')} initialOpen={false}>
                    <MuiSelect
                        label={__('Meta key')}
                        options={[
                            { label: __('Select meta key'), value: '' },
                            ...metaFields
                        ]}
                        value={state.key || ''}
                        onChange={(value) => dispatch({ type: 'SET_KEY', payload: value })}
                    />

                    <MuiSelect
                        label={__('Meta value type')}
                        options={[
                            { label: __('Select meta value type'), value: '' },
                            ...types
                        ]}
                        value={state.type || 'CHAR'}
                        onChange={(value) => dispatch({ type: 'SET_TYPE', payload: value })}
                    />

                    {state.isUserValue || (state.type === 'DATE' && state.isDateToday) ? (
                        <div className="bg-gray-50 p-2 mb-2 rounded-[2px]">
                            <span className="block font-bold mb-2">
                                {state.isDateToday ? __('Using today\'s date:') : __('Custom value input:')}
                            </span>
                            {state.isDateToday ? (
                                <div className="px-2 py-1 bg-white border border-gray-300 rounded">
                                    {wpDate()}
                                </div>
                            ) : (
                                freeFieldByType(state.type, state.value)
                            )}
                        </div>
                    ) : (
                        <MuiSelect
                            label={__('Meta value')}
                            options={getValueOptions()}
                            value={state.value || ''}
                            onChange={(value) => dispatch({ type: 'SET_VALUE', payload: value })}
                        />
                    )}

                    <div className="p-2 mb-2 rounded-[2px]">
                        <CheckboxControl 
                        label={__('Enter custom value')} 
                        checked={!!state.isUserValue} 
                        onChange={(value) => dispatch({ type: 'TOGGLE_USER_VALUE', payload: value })} 
                        />
                    </div>
                
                    {state.type === 'DATE' && (
                        <div className="p-2 mb-2 rounded-[2px]">
                            <CheckboxControl 
                            label={__('Use today\'s date')} 
                            checked={!!state.isDateToday} 
                            onChange={(value) => dispatch({ type: 'SET_TODAY', payload: value })} 
                            />
                        </div>
                    )}

                    <div className="py-2" />
                    <MuiSelect
                        label={__('Compare')}
                        value={state.compare || '='}
                        options={[
                            { label: __('Select comparison'), value: '' },
                            ...compares
                        ]}
                        onChange={(value) => dispatch({ type: 'SET_COMPARE', payload: value })}
                    />
            </PanelBody>
        </Paper>
    );

}

function isValidDate(dateString) {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
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
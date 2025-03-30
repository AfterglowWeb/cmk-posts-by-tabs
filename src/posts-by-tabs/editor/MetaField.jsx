import { __ } from '@wordpress/i18n';
import { useEffect, useReducer } from '@wordpress/element';
import { DatePicker, TextControl, CheckboxControl } from '@wordpress/components';
import Button from '@mui/material/Button';
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

const metaCache = {};

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

function useMetaFields(postType) {
    const [state, dispatch] = useReducer(
        (state, action) => {
            switch (action.type) {
                case 'FETCH_START':
                    return { ...state, isLoading: true, error: null };
                case 'FETCH_SUCCESS':
                    return { 
                        isLoading: false, 
                        metaFields: action.metaFields,
                        availableValues: action.availableValues,
                        error: null
                    };
                case 'FETCH_ERROR':
                    return { ...state, isLoading: false, error: action.error };
                case 'USE_CACHE':
                    return {
                        isLoading: false,
                        metaFields: action.metaFields,
                        availableValues: action.availableValues,
                        error: null
                    };
                default:
                    return state;
            }
        },
        { isLoading: false, metaFields: [], availableValues: {}, error: null }
    );

    useEffect(() => {
        if (!postType) return;

        if (metaCache[postType]) {
            dispatch({
                type: 'USE_CACHE',
                metaFields: metaCache[postType].metaFields,
                availableValues: metaCache[postType].availableValues
            });
            return;
        }

        dispatch({ type: 'FETCH_START' });
        
        wp.apiFetch({ path: `/posts-by-tabs/v1/meta/${postType}` })
            .then((metas) => {
 
                if (!metas || typeof metas !== 'object') {
                    throw new Error('Invalid meta fields response');
                }
                
                const metaArray = [];
                const metaValues = {};

                Object.keys(metas).forEach((meta) => {

                    if (!meta.startsWith('_')) {
                        const metaLabel = meta.split('_').join(' ');
                        metaArray.push({
                            label: metaLabel.charAt(0).toUpperCase() + metaLabel.slice(1),
                            value: meta
                        });

                        metaValues[meta] = Array.isArray(metas[meta]) ? 
                            metas[meta].map(val => ({
                                label: String(val),
                                value: String(val)
                            })) : [];
                    }
                });

                metaCache[postType] = {
                    metaFields: metaArray,
                    availableValues: metaValues
                };

                dispatch({
                    type: 'FETCH_SUCCESS',
                    metaFields: metaArray,
                    availableValues: metaValues
                });
            })
            .catch(error => {
                console.error(`Error fetching meta fields for ${postType}:`, error);
                dispatch({ type: 'FETCH_ERROR', error });
            });
    }, [postType]);

    return state;
}

export default function MetaField(props) {
    const { attributes, setAttributes, metaField, index } = props;
    
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

    const { 
        isLoading, 
        metaFields, 
        availableValues 
    } = useMetaFields(attributes.postType);
    

    const updateMetaField = () => {
      const updatedMetaFields = { 
        ...attributes.metaFields,
        fields: [...attributes.metaFields.fields]
      };
      updatedMetaFields.fields[index] = {
        ...updatedMetaFields.fields[index],
        ...state
      };
      setAttributes({ metaFields: updatedMetaFields });
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
        setAttributes({ metaFields: updatedMetaFields });
    };

    if (isLoading) {
        return <div className="bg-gray-100 p-2 mb-2 rounded-[2px]">Initializing meta fields...</div>
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
      if (!state.key || !availableValues[state.key] || !Array.isArray(availableValues[state.key])) {
        return [{ label: __('Select meta value'), value: '' }];
      }
      
      return [
        { label: __('Select meta value'), value: '' }, 
        ...availableValues[state.key]
      ];
    };

    return (
        <Paper className="p-2 mb-4" elevation={2}>
            <div className="mb-2 flex justify-between">
                <h3 className="lowercase">{__('Meta query')} {index + 1}</h3>
                <Button 
                  variant="outlined" 
                  size="small" 
                  color="secondary"
                  sx={{textTransform:"none"}} 
                  onClick={() => handleRemoveMetaField(index)} 
                >
                  {__('Remove')}
                </Button>
            </div>
            <div className="mb-2">
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
            </div>
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
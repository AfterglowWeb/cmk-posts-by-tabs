import React, { useState, useEffect } from 'react';

import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import RestartAltIcon from '@mui/icons-material/RestartAlt';


export default function FrontFilterFields(props) {
    const { isLoading, error, onFilterChange } = props;
    const { filterFields, taxonomyTerms, metas} = props.attributes

    const [filterValues, setFilterValues] = useState({
        taxonomy: {},
        metaKey: {},
        order: 'desc',
        orderby: 'date',
        search: '',
        calendar: {
            start: null,
            end: null
        }
    });

    useEffect(() => {
        if (Array.isArray(filterFields) && filterFields.length > 0) {
            const initialValues = { ...filterValues };
            
            filterFields.forEach(field => {
                switch (field.type) {
                    case 'order':
                        initialValues.order = field.options.order.defaultOption || 'desc';
                        break;
                    case 'orderby':
                        initialValues.orderby = field.options.orderBy.defaultOption || 'date';
                        break;
                    case 'taxonomy':
                        const taxonomyKey = field.options.taxonomy.value;
                        if (taxonomyKey) {
                            initialValues.taxonomy[taxonomyKey] = [];
                        }
                        break;
                    case 'metaKey':
                        const metaKey = field.options.metaKey.value;
                        if (metaKey) {
                            initialValues.metaKey[metaKey] = [];
                        }
                        break;
                    case 'calendar':
                        initialValues.calendar.start = field.options.calendar.start || null;
                        initialValues.calendar.end = field.options.calendar.end || null;
                        break;
                    case 'search':
                        initialValues.search = field.options.search.value || '';
                        break;
                    default:
                        break;
                }
            });
            
            setFilterValues(initialValues);
        }
    }, [filterFields]);

    const handleFilterChange = (type, key, value) => {
        const newFilterValues = { ...filterValues };
        
        if (type === 'taxonomy') {
            if (!newFilterValues.taxonomy[key]) {
                newFilterValues.taxonomy[key] = [];
            }
            
            if (Array.isArray(newFilterValues.taxonomy[key])) {
                const index = newFilterValues.taxonomy[key].indexOf(value);
                if (index === -1) {
                    newFilterValues.taxonomy[key].push(value);
                } else {
                    newFilterValues.taxonomy[key].splice(index, 1);
                }
            } else {
                newFilterValues.taxonomy[key] = value;
            }
        } else if (type === 'metaKey') {
            if (!newFilterValues.metaKey[key]) {
                newFilterValues.metaKey[key] = [];
            }
            
            if (Array.isArray(newFilterValues.metaKey[key])) {
                const index = newFilterValues.metaKey[key].indexOf(value);
                if (index === -1) {
                    newFilterValues.metaKey[key].push(value);
                } else {
                    newFilterValues.metaKey[key].splice(index, 1);
                }
            } else {
                newFilterValues.metaKey[key] = value;
            }
        } else {
            newFilterValues[type] = value;
        }
        
        setFilterValues(newFilterValues);

        if (onFilterChange) {
            onFilterChange(newFilterValues);
        }
    };

    const resetFilters = () => {
        const defaultValues = {
            taxonomy: {},
            metaKey: {},
            order: 'desc',
            orderby: 'date',
            search: '',
            calendar: {
                start: null,
                end: null
            }
        };
        
        if (Array.isArray(filterFields)) {
            filterFields.forEach(field => {
                if (field.type === 'order' && field.options?.order?.defaultOption) {
                    defaultValues.order = field.options.order.defaultOption;
                }
                if (field.type === 'orderby' && field.options?.orderBy?.defaultOption) {
                    defaultValues.orderby = field.options.orderBy.defaultOption;
                }
            });
        }
        
        setFilterValues(defaultValues);
        
        if (handleFilterChange) {
            handleFilterChange(defaultValues);
        }
    };

    const renderTaxonomyField = (field, index) => {
        const { options, label, placeholder, info, template } = field;
        const taxonomyKey = options.taxonomy.value;
        
        if (!taxonomyKey || !taxonomyTerms || !taxonomyTerms[taxonomyKey]) {
            return null;
        }
        
        const terms = taxonomyTerms[taxonomyKey].selectedTerms || [];
        const selectedValues = filterValues.taxonomy[taxonomyKey] || [];
        
        switch (template) {
            case 'select':
                return (
                    <FormControl key={`tax-${index}`} fullWidth margin="normal">
                        <InputLabel>{label}</InputLabel>
                        <Select
                            value={Array.isArray(selectedValues) ? selectedValues[0] || '' : selectedValues || ''}
                            onChange={(e) => handleFilterChange('taxonomy', taxonomyKey, e.target.value)}
                            placeholder={placeholder}
                        >
                            <MenuItem value="">
                                <em>{placeholder || 'All'}</em>
                            </MenuItem>
                            {terms.map(term => (
                                <MenuItem key={term.value} value={term.value}>
                                    {term.label}
                                </MenuItem>
                            ))}
                        </Select>
                        {info && <Typography variant="caption" color="textSecondary">{info}</Typography>}
                    </FormControl>
                );
                
            case 'radio':
                return (
                    <FormControl key={`tax-${index}`} component="fieldset" margin="normal">
                        <Typography variant="subtitle1">{label}</Typography>
                        <RadioGroup
                            value={Array.isArray(selectedValues) ? selectedValues[0] || '' : selectedValues || ''}
                            onChange={(e) => handleFilterChange('taxonomy', taxonomyKey, e.target.value)}
                        >
                            <FormControlLabel 
                                value="" 
                                control={<Radio />} 
                                label={placeholder || 'All'} 
                            />
                            {terms.map(term => (
                                <FormControlLabel 
                                    key={term.value} 
                                    value={term.value} 
                                    control={<Radio />} 
                                    label={term.label} 
                                />
                            ))}
                        </RadioGroup>
                        {info && <Typography variant="caption" color="textSecondary">{info}</Typography>}
                    </FormControl>
                );
                
            case 'checkbox':
                return (
                    <FormControl key={`tax-${index}`} component="fieldset" margin="normal">
                        <Typography variant="subtitle1">{label}</Typography>
                        <FormGroup>
                            {terms.map(term => (
                                <FormControlLabel
                                    key={term.value}
                                    control={
                                        <Checkbox 
                                            checked={selectedValues.includes(term.value)}
                                            onChange={() => handleFilterChange('taxonomy', taxonomyKey, term.value)}
                                        />
                                    }
                                    label={term.label}
                                />
                            ))}
                        </FormGroup>
                        {info && <Typography variant="caption" color="textSecondary">{info}</Typography>}
                    </FormControl>
                );
        }
    };

    const renderMetaKeyField = (field, index) => {

       /* const json = {
            "type": "metaKey",
            "label": "Lieux",
            "placeholder": "Choisir un lieu",
            "info": "Filtrer par lieu",
            "template": "select",
            "options": {
                "taxonomy": {
                    "value": "",
                    "options": [],
                    "allOptions": true,
                    "defaultOption": null
                },
                "metaKey": {
                    "value": "lieu",
                    "options": [],
                    "allOptions": true,
                    "defaultOption": null
                },
                "order": {
                    "options": [
                        {
                            "label": "Descending",
                            "value": "desc"
                        },
                        {
                            "label": "Ascending",
                            "value": "asc"
                        }
                    ],
                    "defaultOption": "desc"
                },
                "orderBy": {
                    "options": [
                        {
                            "label": "Date",
                            "value": "date"
                        },
                        {
                            "label": "Title",
                            "value": "title"
                        },
                        {
                            "label": "Meta value",
                            "value": "metaValue"
                        },
                        {
                            "label": "Meta value num",
                            "value": "metaValueNum"
                        }
                    ],
                    "metaKey": null,
                    "defaultOption": "date"
                },
                "search": true,
                "calendar": {
                    "options": [
                        {
                            "label": "Range Pick",
                            "value": true
                        }
                    ]
                }
            }
        }*/


        const { options, label, placeholder, info, template } = field;
        const metaKey = options.metaKey.value;
        
        if (!metaKey || !metas || !metas[metaKey]) {
            return null;
        }
        
        const metaOptions = metas[metaKey].selectedMetas || [];
        const selectedValues = filterValues.metaKey[metaKey] || [];
        
        switch (template) {
            case 'select':
                return (
                    <FormControl key={`meta-${index}`} fullWidth margin="normal">
                        <InputLabel>{label}</InputLabel>
                        <Select
                        value={Array.isArray(selectedValues) ? selectedValues[0] || '' : selectedValues || ''}
                        onChange={(e) => handleFilterChange('metaKey', metaKey, e.target.value)}
                        placeholder={placeholder}
                        >
                            <MenuItem value="">
                                <em>{placeholder || 'All'}</em>
                            </MenuItem>
                            {metaOptions.map(option => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </Select>
                        {info && <Typography variant="caption" color="textSecondary">{info}</Typography>}
                    </FormControl>
                );
                
            case 'radio':
                return (
                    <FormControl key={`meta-${index}`} component="fieldset" margin="normal">
                        <Typography variant="subtitle1">{label}</Typography>
                        <RadioGroup
                            value={Array.isArray(selectedValues) ? selectedValues[0] || '' : selectedValues || ''}
                            onChange={(e) => handleFilterChange('metaKey', metaKey, e.target.value)}
                        >
                            <FormControlLabel 
                                value="" 
                                control={<Radio />} 
                                label={placeholder || 'All'} 
                            />
                            {metaOptions.map(option => (
                                <FormControlLabel 
                                    key={option.value} 
                                    value={option.value} 
                                    control={<Radio />} 
                                    label={option.label} 
                                />
                            ))}
                        </RadioGroup>
                        {info && <Typography variant="caption" color="textSecondary">{info}</Typography>}
                    </FormControl>
                );
                
            case 'checkbox':
                return (
                    <FormControl key={`meta-${index}`} component="fieldset" margin="normal">
                        <Typography variant="subtitle1">{label}</Typography>
                        <FormGroup>
                            {metaOptions.map(option => (
                                <FormControlLabel
                                    key={option.value}
                                    control={
                                        <Checkbox 
                                            checked={selectedValues.includes(option.value)}
                                            onChange={() => handleFilterChange('metaKey', metaKey, option.value)}
                                        />
                                    }
                                    label={option.label}
                                />
                            ))}
                        </FormGroup>
                        {info && <Typography variant="caption" color="textSecondary">{info}</Typography>}
                    </FormControl>
                );
        }
    };

    const renderOrderField = (field, index) => {
        const { options, label, placeholder, info, template } = field;
        const orderOptions = options.order.options || [];
        
        switch (template) {
            case 'select':
                return (
                    <FormControl key={`order-${index}`} fullWidth margin="normal">
                        <InputLabel>{label}</InputLabel>
                        <Select
                            value={filterValues.order}
                            onChange={(e) => handleFilterChange('order', null, e.target.value)}
                            placeholder={placeholder}
                        >
                            {orderOptions.map(option => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </Select>
                        {info && <Typography variant="caption" color="textSecondary">{info}</Typography>}
                    </FormControl>
                );
                
            case 'radio':
                return (
                    <FormControl key={`order-${index}`} component="fieldset" margin="normal">
                        <Typography variant="subtitle1">{label}</Typography>
                        <RadioGroup
                            value={filterValues.order}
                            onChange={(e) => handleFilterChange('order', null, e.target.value)}
                        >
                            {orderOptions.map(option => (
                                <FormControlLabel 
                                    key={option.value} 
                                    value={option.value} 
                                    control={<Radio />} 
                                    label={option.label} 
                                />
                            ))}
                        </RadioGroup>
                        {info && <Typography variant="caption" color="textSecondary">{info}</Typography>}
                    </FormControl>
                );
        }
    };

    const renderOrderByField = (field, index) => {
        const { options, label, placeholder, info, template } = field;
        const orderByOptions = options.orderBy.options || [];
        
        switch (template) {
            case 'select':
                return (
                    <FormControl key={`orderby-${index}`} fullWidth margin="normal">
                        <InputLabel>{label}</InputLabel>
                        <Select
                            value={filterValues.orderby}
                            onChange={(e) => handleFilterChange('orderby', null, e.target.value)}
                            placeholder={placeholder}
                        >
                            {orderByOptions.map(option => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </Select>
                        {info && <Typography variant="caption" color="textSecondary">{info}</Typography>}
                    </FormControl>
                );
                
            case 'radio':
                return (
                    <FormControl key={`orderby-${index}`} component="fieldset" margin="normal">
                        <Typography variant="subtitle1">{label}</Typography>
                        <RadioGroup
                            value={filterValues.orderby}
                            onChange={(e) => handleFilterChange('orderby', null, e.target.value)}
                        >
                            {orderByOptions.map(option => (
                                <FormControlLabel 
                                    key={option.value} 
                                    value={option.value} 
                                    control={<Radio />} 
                                    label={option.label} 
                                />
                            ))}
                        </RadioGroup>
                        {info && <Typography variant="caption" color="textSecondary">{info}</Typography>}
                    </FormControl>
                );
        }
    };

    const renderSearchField = (field, index) => {
        const { label, placeholder, info } = field;
        
        return (
            <FormControl key={`search-${index}`} fullWidth margin="normal">
                <TextField
                    label={label}
                    placeholder={placeholder}
                    value={filterValues.search}
                    onChange={(e) => handleFilterChange('search', null, e.target.value)}
                    variant="outlined"
                />
                {info && <Typography variant="caption" color="textSecondary">{info}</Typography>}
            </FormControl>
        );
    };

    const renderCalendarField = (field, index) => {
        const { options, label, info } = field;
        const enableRangePicker = options.calendar.options[0].value;
        
        return (
  
                <FormControl fullWidth margin="normal">
                    <Typography variant="subtitle1">{label}</Typography>
                    
                    
                    {info && <Typography variant="caption" color="textSecondary">{info}</Typography>}
                </FormControl>
    
        );
    };

    const renderFilterField = (field, index) => {
        switch (field.type) {
            case 'taxonomy':
                return renderTaxonomyField(field, index);
            case 'metaKey':
                return renderMetaKeyField(field, index);
            case 'order':
                return renderOrderField(field, index);
            case 'orderby':
                return renderOrderByField(field, index);
            case 'search':
                return renderSearchField(field, index);
            case 'calendar':
                return renderCalendarField(field, index);
            default:
                return null;
        }
    };

    if (!Array.isArray(filterFields) || filterFields.length === 0) {
        return null;
    }

    return (
        <div className="posts-by-tabs-filters">
            {error && (
                <Alert severity="error" className="mb-4">
                    {error}
                </Alert>
            )}
            
            {isLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <>
                    <div className="flex flex-wrap -mx-2">
                        {filterFields.map((field, index) => (
                            <div 
                                className={`px-2 mb-4 w-full ${
                                    field.type === 'search' ? 'w-full' : 'md:w-1/2 lg:w-1/3'
                                }`} 
                                key={`field-${index}`}
                            >
                                {renderFilterField(field, index)}
                            </div>
                        ))}
                    </div>
                    
                    <div className="mt-6 flex justify-end">
                        <Button 
                            variant="outlined" 
                            startIcon={<RestartAltIcon />}
                            onClick={resetFilters}
                        >
                            Reset Filters
                        </Button>
                    </div>
                </>
            )}
        </div>
    );
}


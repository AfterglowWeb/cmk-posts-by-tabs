import { useState } from '@wordpress/element';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';

import FrontTaxonomyField from './FrontTaxonomyField';
import FrontMetaField from './FrontMetaField';
import FrontOrderField from './FrontOrderField';
import FrontOrderByField from './FrontOrderByField';
import FrontSearchField from './FrontSearchField';
import FrontCalendarField from './FrontCalendarField';


export default function FrontFilterFields(props) {
    const { isLoading, error } = props;
    const { filterFields } = props.attributes
    const [filtersValues, setFiltersValues] = useState({
        taxonomies: [],
        metaKeys: [],
        order: 'desc',
        orderby: 'date',
        search: '',
        calendar: {
            start: null,
            end: null
        }
    });

    const handleFilterChange = (type, key, value) => {
        const newFiltersValues = { ...filtersValues };
        
        if (type === 'taxonomy') {
            if (!newFiltersValues.taxonomy[key]) {
                newFiltersValues.taxonomy[key] = [];
            }
            
            if (Array.isArray(newFiltersValues.taxonomy[key])) {
                const index = newFiltersValues.taxonomy[key].indexOf(value);
                if (index === -1) {
                    newFiltersValues.taxonomy[key].push(value);
                } else {
                    newFiltersValues.taxonomy[key].splice(index, 1);
                }
            } else {
                newFiltersValues.taxonomy[key] = value;
            }
        } else if (type === 'metaKey') {
            if (!newFiltersValues.metaKey[key]) {
                newFiltersValues.metaKey[key] = [];
            }
            
            if (Array.isArray(newFiltersValues.metaKey[key])) {
                const index = newFiltersValues.metaKey[key].indexOf(value);
                if (index === -1) {
                    newFiltersValues.metaKey[key].push(value);
                } else {
                    newFiltersValues.metaKey[key].splice(index, 1);
                }
            } else {
                newFiltersValues.metaKey[key] = value;
            }
        } else {
            newFiltersValues[type] = value;
        }
        
        setFiltersValues(newFiltersValues);

    };

    const resetFilters = () => {
        const defaultValues = {
            taxonomies: [],
            metaKeys: [],
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
        
        setFiltersValues(defaultValues);
        
        if (handleFilterChange) {
            handleFilterChange(defaultValues);
        }
    };

    const renderFilterField = (field, index) => {

        switch (field.type) {
            case 'taxonomy':
                return <FrontTaxonomyField field={field} index={index} />;
            case 'metaKey':
                return <FrontMetaField field={field} index={index} />;
            case 'order':
                return <FrontOrderField field={field} index={index} />;
            case 'orderby':
                return <FrontOrderByField field={field} index={index} />;
            case 'search':
                return <FrontSearchField field={field} index={index} />;
            case 'calendar':
                return <FrontCalendarField field={field} index={index} />;
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
                <div className="flex w-full gap-2 items-start">
                    <div className="flex flex-wrap w-full gap-2 -mx-2 items-start">
                        {filterFields.map((field, index) => (
                            <div 
                            className={`px-2 mb-4 flex-1`}
                            key={`field-${index}`}
                            >
                                {renderFilterField(field, index)}
                            </div>
                        ))}

                        <div className="w-[60px]">
                            <Tooltip title='Reset Filters' position='top' arrow>
                            <IconButton 
                                onClick={resetFilters}
                            >
                                <RestartAltIcon />
                            </IconButton>
                            </Tooltip>
                        </div>
                    </div>
                    
                </div>
            )}
        </div>
    );
}


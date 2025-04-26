import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Chip from '@mui/material/Chip';
import OutlinedInput from '@mui/material/OutlinedInput';
import Button from '@mui/material/Button';
import FilterListIcon from '@mui/icons-material/FilterList';
import { useTheme } from '@mui/material/styles';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export default function PostsFilter({ onFilterChange, taxonomyName = 'categories', defaultPostType = 'post' }) {
  const [taxonomyTerms, setTaxonomyTerms] = useState([]);
  const [selectedTerms, setSelectedTerms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const theme = useTheme();

  function getStyles(term, selectedTerms, theme) {
    return {
      fontWeight:
        selectedTerms.indexOf(term) === -1
          ? theme.typography.fontWeightRegular
          : theme.typography.fontWeightMedium,
    };
  }
  
  useEffect(() => {
    async function fetchTaxonomyTerms() {
      try {
        setIsLoading(true);
        const response = await fetch(`${afgTheme.baseUrl}/wp-json/wp/v2/${taxonomyName}?per_page=100`);
        if (!response.ok) {
          throw new Error(`Error fetching ${taxonomyName}`);
        }
        const terms = await response.json();
        setTaxonomyTerms(terms);
      } catch (error) {
        console.error('Error fetching taxonomy terms:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchTaxonomyTerms();
  }, [taxonomyName]);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    
    const termValues = typeof value === 'string' ? value.split(',') : value;
    setSelectedTerms(termValues);
    
    // Apply the filter
    applyFilter(termValues);
  };

  const applyFilter = (terms) => {
    const params = new URLSearchParams();
    
    params.append('post_type', defaultPostType);
    
    if (terms && terms.length > 0) {
      params.append(`${taxonomyName}`, terms.join(','));
    }
    
    params.append('per_page', '9');
    
    onFilterChange(params.toString());
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: { xs: 'column', sm: 'row' },
      alignItems: 'center',
      gap: 2,
      mb: 4, 
      maxWidth: '100%',
      overflowX: 'visible'
    }}>
      <FormControl sx={{ minWidth: 200, flex: 1, maxWidth: '100%' }}>
        <InputLabel id="multiple-taxonomy-label">
          {taxonomyName.charAt(0).toUpperCase() + taxonomyName.slice(1)}
        </InputLabel>
        <Select
          labelId="multiple-taxonomy-label"
          id="multiple-taxonomy"
          multiple
          value={selectedTerms}
          onChange={handleChange}
          input={<OutlinedInput id="select-multiple-chip" label={taxonomyName.charAt(0).toUpperCase() + taxonomyName.slice(1)} />}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((value) => {
                const term = taxonomyTerms.find(term => term.id === value);
                return (
                  <Chip key={value} label={term?.name || value} />
                );
              })}
            </Box>
          )}
          MenuProps={MenuProps}
          disabled={isLoading}
        >
          {taxonomyTerms.map((term) => (
            <MenuItem
              key={term.id}
              value={term.id}
              style={getStyles(term.id, selectedTerms, theme)}
            >
              {term.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Button 
        variant="contained" 
        color="secondary"
        startIcon={<FilterListIcon />}
        onClick={() => applyFilter(selectedTerms)}
        disabled={isLoading}
      >
        Filter
      </Button>
    </Box>
  );
}
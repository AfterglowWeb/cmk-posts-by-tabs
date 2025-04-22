import React from 'react';
import Box from '@mui/material/Box';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import PostTerms from './PostTerms';

export default function StyledPostTerms(props) {
  
  const {className} = props;

  return(
    <Box component="p" className={`flex gap-1 items-center  ${className}`}>
        <CategoryOutlinedIcon sx={{width:18 , height:18}} color="inherit" />
        <span className="block text-xs leading-none truncate ellipsis overflow-hidden">
            <PostTerms {...props} />
        </span>
    </Box>
  )

}
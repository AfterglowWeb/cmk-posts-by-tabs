import React, { Fragment } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import { Tooltip } from '@mui/material';

export default function PostCategories(props) {

    const {post, className} = props;
    if(!post) {
      return null;
    }

    if(!post.categories) {
      return null;
    }
  
    return(
   
      <Box component="p" className={`flex gap-1 items-center  ${className}`}>
          <CategoryOutlinedIcon sx={{width:18 , height:18}} color="inherit" />
          <span className="block text-xs leading-none truncate ellipsis overflow-hidden">
              {post.categories && post.categories.map((category, index) => {
                  return (
                    <Fragment key={index + category.name}>
                      <a href={category.url} title={category.name} className="no-underline">
                        <Tooltip title={`Catégorie ${category.name}`} placement="top-start">
                        {category.name}
                        </Tooltip>
                      </a>
                      {index < post.categories.length - 1 && <span>, </span>}
                    </Fragment> 
                  )
              }
              )}
          </span>
      </Box>
    )
  }
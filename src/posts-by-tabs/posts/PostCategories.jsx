import React, { Fragment } from 'react';
import Box from '@mui/material/Box';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import { Tooltip } from '@mui/material';

export default function PostCategories(props) {
  
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

export function PostTerms(props) {

  const {post, taxonomy = 'categories'} = props;
  if(!post) {
    return null;
  }

  const taxonomies =  post.terms;
  if(!taxonomies) {
    return null;
  }
  const terms = taxonomies[taxonomy] ? taxonomies[taxonomy] : null;
  if(!terms || terms.length === 0) {
    return null;
  }

  return (
    terms.map((term, index) => {
        return (
          <Fragment key={index + term.name}>
            <a href={term.url} title={term.name} className="no-underline">
              <Tooltip title={`Catégorie ${term.name}`} placement="top-start">
              {term.name}
              </Tooltip>
            </a>
            {index < terms.length - 1 && <span> • </span>}
          </Fragment> 
        )
    }
    )
  )
}
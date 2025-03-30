import React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import PostCategories from '../PostCategories';
import Tooltip from '@mui/material/Tooltip';

export default function XSmallCard({post, compact = false, hideImage = false}) {


if(!post) {
  return null;
}

  return (
    <Card sx={{ display: 'flex', justifyContent: 'space-between', position: 'relative', overflow: 'hidden', p: 0, borderRadius: '2px' }}>
      <CardMedia
            component="img"
            sx={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0, zIndex: 0 }}
            image={post.featured_image}
            alt={`Lire ${post.title}`}

      />
      <CardContent sx={{ flex: 1, height:'40px', color:'white', p:0, position: 'relative', zIndex: 1, backgroundColor: 'rgba(0,0,0,0.3)', maxWidth: '100%' }}>
        
        <Box  sx={{ p: 1, width: '100%' }}>
          {post.title && 
          <Tooltip title={post.title} placement="top">
              <h3 className={`text-[12px] font-semibold mb-0 leading-none font-sans overflow-hidden w-full max-w-full`}>
                <a href={post.url} title={`${post.title}`} className="block decoration-none truncate overflow-hidden">
                  {post.title}
                </a>
              </h3>
          </Tooltip>
          }
          <PostCategories post={post} className="flex gap-1 items-center w-full max-w-full" />
        </Box>
      </CardContent>
    </Card>
  );
}

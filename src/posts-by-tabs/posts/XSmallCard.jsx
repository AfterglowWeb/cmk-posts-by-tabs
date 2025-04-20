import React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Tooltip from '@mui/material/Tooltip';
import PostCategories from './PostCategories';

export default function XSmallCard({post, compact = false, hideImage = false}) {


if(!post) {
  return null;
}

  return (
    <Card sx={{ display: 'flex', justifyContent: 'space-between', position: 'relative', overflow: 'hidden', p: 0, borderRadius: '2px' }}>
      <CardMedia
            component="img"
            sx={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0, zIndex: 0 }}
            image={post._embedded['wp:featuredmedia'][0].source_url}
            alt={post._embedded['wp:featuredmedia'][0].alt_text}
      />
      <CardContent sx={{ flex: 1, height:'40px', color:'white', p:0, position: 'relative', zIndex: 1, backgroundColor: 'rgba(0,0,0,0.3)', maxWidth: '100%' }}>
        
        <Box  sx={{ p: 1, width: '100%' }}>
          {post.title?.rendered && 
          <Tooltip title={post.title.rendered} placement="top">
              <h3 className={`text-[12px] font-semibold mb-0 leading-none font-sans overflow-hidden w-full max-w-full`}>
                <a href={post.link} title={post.title.rendered} className="block decoration-none truncate overflow-hidden">
                  {post.title.rendered}
                </a>
              </h3>
          </Tooltip>
          }
          <PostCategories post={post} taxonomy={'event-type'} className="flex gap-1 items-center w-full max-w-full" />
        </Box>
      </CardContent>
    </Card>
  );
}

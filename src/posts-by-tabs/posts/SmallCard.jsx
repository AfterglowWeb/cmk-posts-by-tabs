import React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import Button from '@mui/material/Button';
import Fab from '@mui/material/Fab';
import PostCategories from './PostCategories';
import PostDate from './PostDate';
import EventDates from './EventDates';

export default function SmallCard({post, compact = false, hideImage = false}) {


if(!post) {
  return null;
}
console.log('post', post);
  return (
    <Card sx={{ display: 'flex', justifyContent: 'space-between', position: 'relative', overflow: 'hidden', p: 0, borderRadius: '2px' }}>
      {post.featured_media && <CardMedia
            component="img"
            sx={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0, zIndex: 0 }}
            image={post.featured_media}
            alt={post.title?.rendered || ''}
            loading="lazy"
      />}
      <CardContent sx={{ flex: 1, height:'100%', minHeight:'150px', color:'white', display:'flex', flexDirection:'column', justifyContent:'space-between', p:0, position: 'relative', zIndex: 1, backgroundColor: 'rgba(0,0,0,0.3)' }}>
        
        <Box  sx={{ p: 1 }}>
          {post.title?.rendered && 
              <h3 className={`font-semibold ${compact ? 'text-md' : 'text-xl'} mb-0 leading-none`}>
                <a href={post.link} title={post.title.rendered} className="no-decoration">
                  {post.title.rendered}
                </a>
              </h3>
          }
          {post.acf?.subtitle && 
              <p className={`${compact && 'hidden'} text-sm text-slate-500 mb-0 leading-none`}>
                  {post.acf.subtitle}
              </p>
          }
        </Box>

        <Box>
          <EventDates post={post} className="px-2"/>
          <Box sx={{ display: 'flex', alignItems: 'center', p: 1, gap: 1 }}> 
              <PostDate post={post} className="w-1/2" />
              <PostCategories post={post} taxonomy={'event-type'} className="w-1/2" />
          </Box>
        </Box>
      </CardContent>
      
      {compact ?
      <Fab
          href={post.link} 
          title={`Lire ${post.title?.rendered || ''}`}
          color="secondary" 
          size="small"
          sx={{position:'absolute',top:'50%', right:'4px', transform:'translateY(-50%)', zIndex:10, textTransform:'none'}}
          >
        <RemoveRedEyeOutlinedIcon />
      </Fab> :
      <Button 
          href={post.link} 
          title={`Lire ${post.title?.rendered || ''}`}
          variant="contained" 
          color="secondary" 
          size="small" 
          startIcon={<RemoveRedEyeOutlinedIcon sx={{ height: 25, width: 25 }} />}
          sx={{position:'absolute',top:'50%', right:'8px', transform:'translateY(-50%)', zIndex:10, textTransform:'none'}}
          >
          {__('Voir', 'posts-by-tabs')}
      </Button>}
    </Card>
  );
}

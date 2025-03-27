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

  return (
    <Card sx={{ display: 'flex', justifyContent: 'space-between', position: 'relative', overflow: 'hidden', p: 0, borderRadius: '2px' }}>
      <CardMedia
            component="img"
            sx={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0, zIndex: 0 }}
            image={post.featured_image}
            alt={`Lire ${post.title}`}

      />
      <CardContent sx={{ flex: 1, height:'100%', minHeight:'150px', color:'white', display:'flex', flexDirection:'column', justifyContent:'space-between', p:0, position: 'relative', zIndex: 1, backgroundColor: 'rgba(0,0,0,0.3)' }}>
        
        <Box  sx={{ p: 1 }}>
          {post.title && 
              <h3 className={`font-semibold ${compact ? 'text-md' : 'text-xl'} mb-0 leading-none`}>
                <a href={post.url} title={post.title} className="no-decoaration">
                  {post.title}
                </a>
              </h3>
          }
          {post.subtitle && 
              <p className={`${compact && 'hidden'} text-sm text-slate-500 mb-0 leading-none`}>
                  {post.subtitle}
              </p>
          }
        </Box>

        <Box>
          <EventDates post={post} className="px-2"/>
          <Box sx={{ display: 'flex', alignItems: 'center', p: 1, gap: 1 }}> 
              <PostDate post={post} className="w-1/2" />
              <PostCategories post={post} className="w-1/2" />
          </Box>
        </Box>
      </CardContent>
      
      {compact ?
      <Fab
          href={post.url} 
          title={`Lire ${post.title}`}
          color="secondary" 
          size="small"
          sx={{position:'absolute',top:'50%', right:'4px', transform:'translateY(-50%)', zIndex:10, textTransform:'none'}}
          >
        <RemoveRedEyeOutlinedIcon />
      </Fab> :
      <Button 
          href={post.url} 
          title={`Lire ${post.title}`}
          variant="contained" 
          color="secondary" 
          size="small" 
          startIcon={<RemoveRedEyeOutlinedIcon sx={{ height: 25, width: 25 }} />}
          sx={{position:'absolute',top:'50%', right:'8px', transform:'translateY(-50%)', zIndex:10, textTransform:'none'}}
          >
          Voir
      </Button>}
    </Card>
  );
}

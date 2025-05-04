import React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import PostTerms from './PostTerms';
import PostDate from './PostDate';
import EventDates from './EventDates';
import sanitizeHtml from '../utils/sanitizeHtml';
import SubEvent from './SubEvent';
import Tooltip from '@mui/material/Tooltip';

export default function SmallCard({post, compact = false, hideImage = false}) {


if(!post) {
  return null;
}

  return (
    <Card 
    onClick={() => {document.location.href = post.link;}}
    sx={{ display: 'flex', justifyContent: 'space-between', position: 'relative', overflow: 'hidden', p: 0, borderRadius: '2px' }}>
      {post.featured_media && <CardMedia
            component="img"
            sx={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0, zIndex: 0 }}
            image={post.featured_media}
            alt={post.title?.rendered || ''}
            loading="lazy"
      />}
      <CardContent sx={{ flex: 1, height:'100%', minHeight:'150px', color:'white', display:'flex', flexDirection:'column', justifyContent:'space-between', p:0, position: 'relative', zIndex: 1, backgroundColor: 'rgba(0,0,0,0.3)' }}>
        
        <Box
        sx={{ p: 1 }}>
          <Tooltip 
          title={
            <span dangerouslySetInnerHTML={{__html:sanitizeHtml(post.title?.rendered)}} />
          } 
          placement="top"
          >
            {post.title?.rendered && 
                <h3 className={`font-semibold ${compact ? 'text-md' : 'text-xl'} mb-0 leading-none`}>
                  <a 
                  href={post.link} 
                  title={post.title.rendered} 
                  className="no-decoration"
                  dangerouslySetInnerHTML={{__html: sanitizeHtml(post.title.rendered)}}
                  />
                </h3>
              
            }
            {post.acf?.subtitle && 
              <p className={`${compact && 'hidden'} font-regular text-sm text-white py-2 mb-0 leading-none`}
                dangerouslySetInnerHTML={{__html: sanitizeHtml(post.acf.subtitle)}} 
              />
            }
          </Tooltip>
        </Box>

        <Box>
          <EventDates post={post} className="px-2"/>
          <Box sx={{ display: 'flex', alignItems: 'center', p: 1, gap: 1 }}> 
              <PostDate post={post} className="w-1/2" />
              <PostTerms post={post} taxonomy={'event-type'} />
          </Box>
        </Box>
        <SubEvent post={post} />
      </CardContent>
      
    </Card>
  );
}

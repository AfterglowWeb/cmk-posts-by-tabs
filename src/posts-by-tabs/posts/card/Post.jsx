import React, {useState} from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import Tooltip from '@mui/material/Tooltip';

import sanitizeHTML from '../../utils/sanitizeHtml';
import PostCategories from '../PostCategories';
import PostDate from '../PostDate';
import EventDates from '../EventDates';

export default function Post({post}) {

    if(!post) {
        return null;
    }

    return (
        <Card sx={{ width: '100%', paddingTop: '100%', position: 'relative', overflow: 'hidden', borderRadius: '2px'}}>
            <CardMedia
            component="img"
            sx={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'cover',
                position:'absolute',
                top:0, 
                left:0,
                zIndex:1
            }}
            image={post.featured_media}
            alt={`Lire ${post.title?.rendered || ''}`}
            />
            <CardContent sx={{ 
            width: '100%', 
            height: '100%', 
            position:'absolute',
            top:0, 
            left:0, 
            zIndex:10, 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'space-between',
            flexGrow: 1,
            p: 0,
            color: 'white',
            backgroundColor: 'rgba(0,0,0,0.4)',
            }}>
                <Box>
                    {post.acf?.start && <Box 
                    sx={(theme) => ({ 
                        width: '100%',
                        px:2,
                        py:1,
                        display: 'flex',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                    })}
                    > 
                        <EventDates post={post}/>
                    </Box>}

                    <h3 className={`mb-0 leading-none drop-shadow-md p-4`}>
                        <a href={post.link} 
                        title={post.title?.rendered || ''} 
                        className="font-bold leading-none no-underline text-2xl md:text-3xl lg:text-2xl xl:text-3xl text-white">
                        {post.title?.rendered && 
                        <span dangerouslySetInnerHTML={{__html: sanitizeHTML(post.title?.rendered)}}/>
                        }
                        {post.acf?.subtitle && 
                            <span 
                            className="text-lg leading-none"
                            dangerouslySetInnerHTML={{__html: sanitizeHTML(post.acf.subtitle)}}
                            />
                        }
                        <ArrowForwardIcon fontSize="large" color="inherit" />
                        </a>
                    </h3>
                </Box>

                
                
                    
                <Box sx={{ 
                display: 'flex', 
                gap: 2,
                justifyContent: 'flex-start', 
                alignItems: 'center',
                position: 'relative',
                px: 2,
                color: 'white',
                width: '100%',
                }}> 
                    <PostDate post={post} className="flex gap-1 items-center w-1/3 text-white" />
                    <PostCategories post={post} className="flex gap-1 items-center w-1/3 text-white" />
                    <Box className="w-1/3 flex items-center justify-end">
                    <Tooltip title={`Ouvrir ${post.title?.rendered}`} placement="top-end">
                        <Fab
                        //sx={{color:'white',p:0, ['&, & *']: {backgroundColor: 'transparent',backgroundImage:'none'} }}
                        size="small"
                        color="secondary"
                        href={post.link}
                        >
                            <AddIcon color="inherit" />
                        </Fab>
                    </Tooltip>
                        
                    </Box>
                </Box>
            </CardContent>
            
        </Card>
    );
}

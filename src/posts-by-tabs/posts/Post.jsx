import React, {useEffect, useRef, useState} from 'react';
import Box from '@mui/material/Box';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import PostTerms from './PostTerms';
import PostTop from './PostTop';
import PostBottom from './PostBottom';
import { eventDatesString } from './EventDates';
import sanitizeHtml from '../utils/sanitizeHtml';
import SubEvent from './SubEvent';

export default function Post({post}) {
    const [anchorEl, setAnchorEl] = useState(null);
    const figureRef = useRef(null);
    
    if(!post) {
        return null;
    }

    const topTextString = eventDatesString(post);
    const bottomTextString = bottomText(post);
    
    const handlePopoverOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);

    return (
        <article 
        onClick={() => {document.location.href = post.link;}}
        className="basis-[320px] w-320px h-[320px] min-h-[320px] p-[30px] relative flex items-center justify-center overflow-hidden"
        >
            {post.featured_media &&
            <img
                src={post.featured_media}
                alt={post.title?.rendered || ''}
                loading="lazy"
                style={{height: '100%', width: '100%', objectFit: 'cover'}}
                className="absolute inset-0 block"
            />}
               
            <Box 
                ref={figureRef}
                component={'figcaption'}
                aria-owns={open ? 'post-popover' : undefined}
                aria-haspopup="true"
                onMouseEnter={handlePopoverOpen}
                onMouseLeave={handlePopoverClose}
                sx={{
                    '&, *': {
                        transition: 'all 0.5s ease-in-out',
                    },
                    'span, a': {
                        opacity: 1,
                        pointerEvents: 'all',
                    },
                    'span.post-cross': {
                        opacity: 0,
                        pointerEvents: 'nonz',
                    },
                    '&:hover': {
                        'span, a': {
                            opacity: 0,
                            pointerEvents: 'none',
                        },
                        'span.post-cross': {
                            opacity: 1,
                            pointerEvents: 'all',
                        }
                    }
                }}
                className="h-[260px] w-[260px] border border-white cursor-pointer relative flex justify-center items-center z-10 font-title transition duration-500 bg-white/90 hover:bg-white/0 rounded-full shadow-lg"
            >
                <PostTop text={topTextString?.toUpperCase()} />
                <div className="max-w-[180px] mx-auto z-50">
                    
                    <div className="text-center *:text-[12px] *:leading-none">
                        <PostTerms post={post} taxonomy={'event-type'} />
                    </div>

                    <a 
                    href={post.link} 
                    title={post.title?.rendered} 
                    className="block text-center no-underline w-full"
                    >
                        <h3 className="inline text-text font-title text-lg" dangerouslySetInnerHTML={{ __html: post.title?.rendered }} />
                    </a>
                </div>
                <PostBottom text={bottomTextString?.toUpperCase()} />

                <span className="post-cross block absolute top-[calc(50% - 20px)] left-[calc(50% - 20px)] w-[40px] h-[40px]"
                dangerouslySetInnerHTML={{__html: `<svg version='1.1' xmlns='http://www.w3.org/2000/svg' x='0px' y='0px' viewBox='0 0 31 31' xml:space='preserve'><line x1='0' y1='15.5' x2='31' y2='15.5' stroke='white'/><line x1='15.5' y1='31' x2='15.5' y2='0' stroke='white'/></svg>`}}
                />
            </Box>
            
            <Popover
                id="post-popover"
                sx={{
                    pointerEvents: 'none',
                }}
                open={open}
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
                onClose={handlePopoverClose}
                disableRestoreFocus
                slotProps={{
                    paper: {
                        sx: {
                            padding: '16px',
                            maxWidth: '320px',
                            backgroundColor: '#fff',
                            borderRadius: 0,
                            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
                            pointerEvents: 'auto',
                        }
                    }
                }}
            >
      
                <div className="post-popover-content">
          
                    <Typography variant="h5" className="font-bold mb-1" dangerouslySetInnerHTML={{ __html: sanitizeHtml(post.title?.rendered || '') }} />
        
                    {post.acf?.subtitle && (
                        <Typography variant="subtitle1" className="mb-2 text-gray-700">
                            {post.acf.subtitle}
                        </Typography>
                    )}
                    
      
                    <div className="flex items-center mb-2">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <Typography variant="body2" className="text-gray-600">
                            {topTextString || 'Date non précisée'}
                        </Typography>
                    </div>
                    
  
                    {bottomTextString && (
                        <div className="flex items-center mb-2">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <Typography variant="body2" className="text-gray-600">
                                {bottomTextString}
                            </Typography>
                        </div>
                    )}
                    
        
                    {post.excerpt?.rendered && (
                        <div className="mt-3 border-t pt-2">
                            <Typography 
                                variant="body2"
                                className="text-gray-800 line-clamp-3" 
                                dangerouslySetInnerHTML={{ 
                                    __html: sanitizeHtml(post.excerpt.rendered) 
                                }}
                            />
                        </div>
                    )}
                    
    
                    <div className="mt-3 text-right">
                        <Typography variant="button" className="text-blue-600 hover:text-blue-800">
                            Lire plus →
                        </Typography>
                    </div>
                </div>
            </Popover>
            
            <SubEvent post={post} />
        </article>
    );
}

function bottomText(post) {
       
    const acf = post?.acf;
    if(!acf) {
        return '';
    }
    
    if(post.type === 'evenement') {
        const subPosts = acf['bidirection-places-events'] ?? [];
        var metaInfo = '';
        if(subPosts && subPosts.length > 0) {
            metaInfo = subPosts.map((subPost) => {
                if(subPost.type === 'lieu') {
                    return subPost.title?.rendered;
                }
            }
            );
            metaInfo = metaInfo.filter((item) => item !== undefined);
            metaInfo = metaInfo.join(', ');
        }

        return metaInfo;
    }

    if(post.type === 'lieu') {
        return acf?.town;
    }

}

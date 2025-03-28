import React, {useEffect, useRef, useState} from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import PostCategories from './PostCategories';
import PostDate from './PostDate';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Fab from '@mui/material/Fab';
import EventDates from './EventDates';
import AddIcon from '@mui/icons-material/Add';
import Tooltip from '@mui/material/Tooltip';
import PostTop from './PostTop';
import PostBottom from './PostBottom';

export default function Post({post}) {

    const [isHovered, setIsHovered] = useState(false);
    const cardRef = useRef(null);

    useEffect(() => {
        if(cardRef.current) {
            cardRef.current.addEventListener('mouseenter', () => {
                setIsHovered(true);
            });

            cardRef.current.addEventListener('mouseleave', () => {
                setIsHovered(false);
            });
        }

        return () => {
            if(cardRef.current) {
                cardRef.current.removeEventListener('mouseenter', () => {
                    setIsHovered(true);
                });

                cardRef.current.removeEventListener('mouseleave', () => {
                    setIsHovered(false);
                });
            }
        }
    }, []);


    if(!post) {
        return null;
    }

 
    return (
        <article 
        ref={cardRef} 
        className="basis-[320px] w-320px h-[320px] min-h-[320px] p-[30px] relative flex items-center justify-center overflow-hidden"
        >
            {post._embedded && post._embedded['wp:featuredmedia'] &&
            <img
                src={post._embedded['wp:featuredmedia'][0].source_url}
                alt={post._embedded['wp:featuredmedia'][0].alt_text}
                style={{height: '100%', width: '100%', objectFit: 'cover'}}
                className="absolute inset-0 block"
            />}
            <Tooltip title={ post.title.rendered } placement="bottom-start">
            <Box 
            component={'figcaption'}
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
                <PostTop text="blabla l jdlkj bal" />
                <div className="max-w-[180px] mx-auto">
                    <PostCategories post={post} />
                    <a href={post.link} 
                    title={post.title.rendered} 
                    className="block text-center no-underline w-full">
                        <h3 className="inline text-text font-title text-lg" dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
                    </a>
                </div>
                <PostBottom text="zjkszoiqjseflkj sdlkj" />
                <span className="post-cross block absolute top-[calc(50% - 20px)] left-[calc(50% - 20px)] w-[40px] h-[40px]"
                dangerouslySetInnerHTML={{__html: `<svg version='1.1' xmlns='http://www.w3.org/2000/svg' x='0px' y='0px' viewBox='0 0 31 31' xml:space='preserve'><line x1='0' y1='15.5' x2='31' y2='15.5' stroke='white'/><line x1='15.5' y1='31' x2='15.5' y2='0' stroke='white'/></svg>`}}
                />
            </Box>
            </Tooltip>
            
            {post.acf?.sub_event && 
                <div 
                className="absolute top-[80px] right-0 bg-primary font-narrow-700 text-xs max-w-[220px]">
                    {post.acf.sub_event}
                </div>
            } 
        </article>
    );
}
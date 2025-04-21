import React, {useEffect, useRef, useState} from 'react';
import Box from '@mui/material/Box';
import {PostTerms} from './PostCategories';
import Tooltip from '@mui/material/Tooltip';
import PostTop from './PostTop';
import PostBottom from './PostBottom';
import { eventDatesString } from './EventDates';
import sanitizeHtml from '../utils/sanitizeHtml';
import SubEvent from './SubEvent';

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

    const topTextString = eventDatesString(post);
    const bottomTextString = bottomText(post);

    return (
        <article 
        ref={cardRef} 
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
            <Tooltip title={ <span dangerouslySetInnerHTML={{__html:sanitizeHtml(post.title?.rendered)}} />} placement="bottom-center">
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
                <PostTop text={topTextString} />
                <div className="max-w-[180px] mx-auto">
                    <PostTerms post={post} taxonomy={'event-type'} />
                    <a href={post.link} 
                    title={post.title.rendered} 
                    className="block text-center no-underline w-full">
                        <h3 className="inline text-text font-title text-lg" dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
                    </a>
                </div>
                <PostBottom text={bottomTextString} />
                <span className="post-cross block absolute top-[calc(50% - 20px)] left-[calc(50% - 20px)] w-[40px] h-[40px]"
                dangerouslySetInnerHTML={{__html: `<svg version='1.1' xmlns='http://www.w3.org/2000/svg' x='0px' y='0px' viewBox='0 0 31 31' xml:space='preserve'><line x1='0' y1='15.5' x2='31' y2='15.5' stroke='white'/><line x1='15.5' y1='31' x2='15.5' y2='0' stroke='white'/></svg>`}}
                />
            </Box>
            </Tooltip>
            
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


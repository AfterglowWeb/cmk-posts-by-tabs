import React from 'react';
import Box from '@mui/material/Box';
import { useParallax, useParallaxController } from 'react-scroll-parallax';


export default function ParallaxVideo(props) {

    const {src} = props;
    const { ref } = useParallax({ speed: 10 });
    const parallaxController = useParallaxController();
        
    if (!src) {
        return null;
    }

    return(
        <Box className="absolute inset-0 w-[150%] h-[150%] -left-1/3 -top-1/3" ref={ref}>
            <video 
            onLoad={() => parallaxController.update()} 
            autoPlay
            loop
            muted
            className="w-full h-full object-cover">
                <source src={src} type="video/mp4" />
            </video>
        </Box>  
    )

}
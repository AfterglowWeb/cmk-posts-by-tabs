import React from 'react';
import Box from '@mui/material/Box';
import { useParallax, useParallaxController } from 'react-scroll-parallax';


export default function ParallaxImage(props) {

    const {src} = props;
    const { ref } = useParallax({ speed: 10, scale: [.9, 1.2] });
    const parallaxController = useParallaxController();
        
    if (!src) {
        return null;
    }

    return(
        <Box className="absolute inset-0 w-[150%] h-[150%] -left-1/3 -top-1/3" ref={ref}>
            <img 
            onLoad={() => parallaxController.update()} 
            src={src} 
            className="w-full h-full object-cover" />
        </Box>  
    )

}
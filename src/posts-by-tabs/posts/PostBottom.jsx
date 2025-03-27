import React from 'react';
import { v4 as uuidv4 } from 'uuid';

const PostBottom = ({ text, fill = '#091219' }) => {

    return(
    <span
        className="block absolute bottom-[6px] left-0 w-full h-[124px]"
        dangerouslySetInnerHTML={{__html: createSvg(id, text, fill)}}
    />
    )
}

function createSvg(text, fill) {
    const id = uuidv4();

    return(
    `<svg style="width:100%;height:100%;" version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 260 130" xmlSpace="preserve">
    <defs>
        <path 
        fill="${fill}" 
        id=${id} 
        d="M128.5,128.7C66.4,128.7,16,78.3,16,16.2c0,0,0,0,0-0.1c0.4,0,0.7,0,1-0.1c0,0.1,0,0.1,0,0.2C17,46,28.6,74,49.7,95
        c21.1,21,49,32.7,78.8,32.7s57.8-11.6,78.8-32.7c21-21.1,32.7-49.1,32.7-78.8c0-0.1,0-0.1,0-0.2c0.3,0.1,0.6,0.1,1,0.1
        c0,0,0,0,0,0.1C241,78.3,190.6,128.7,128.5,128.7z"/>
    </defs>
    <text><textPath xlink:href="#${id}" text-anchor="middle" startOffset="50%">${text}</textPath></text>
</svg>`
    )
}

export default PostBottom;
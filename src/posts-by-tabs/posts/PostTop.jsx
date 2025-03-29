import React from 'react';
import { v4 as uuidv4 } from 'uuid';

const PostTop = ({ text, fill = '#091219'}) => {

    return(
    <span
        className="block absolute left-0 top-[6px] w-full h-[124px]"
        dangerouslySetInnerHTML={{__html: createSvg(text, fill)}}
    />
    )
}

function createSvg(text, fill) {
    const id = uuidv4();
    return (
        `<svg style="width:100%;height:100%;" version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 260 130" xml:space="preserve">
        <defs>
        <path 
        fill="${fill}" 
        id=${id}
        d="M128.5,16C66.4,16,16,66.4,16,128.5c0,0,0,0,0,0.1c0.4,0,0.7,0,1,0.1c0-0.1,0-0.1,0-0.2c0-29.8,11.6-57.8,32.7-78.8 c21.1-21,49-32.7,78.8-32.7s57.8,11.6,78.8,32.7c21,21.1,32.7,49.1,32.7,78.8c0,0.1,0,0.1,0,0.2c0.3-0.1,0.6-0.1,1-0.1 c0,0,0,0,0-0.1C241,66.4,190.6,16,128.5,16z"/>
        </defs>
        <text><textPath xlink:href="#${id}" text-anchor="middle" startOffset="50%">${text}</textPath></text>
        </svg>`
    )
}

export default PostTop;
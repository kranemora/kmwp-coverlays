import { registerBlockType } from '@wordpress/blocks';
import metadata from './block.json';
import edit from './edit.js';
import save from './save.js';

const coverlaysIcon = (<svg 
  viewBox="0 0 24 24"
  xmlns="http://www.w3.org/2000/svg"
  aria-hidden="true"
  focusable="false"
>
    <g fill="currentColor">
        <path d="M19.24,7.25h-1.24v-2.33c0-1.08-.83-1.92-1.92-1.92H4.92c-1.08,0-1.92.83-1.92,1.92v11.17c0,1.08.83,1.92,1.92,1.92h2.33v1.24c0,.99.76,1.76,1.76,1.76h10.24c.99,0,1.76-.76,1.76-1.76v-10.24c0-.99-.76-1.76-1.76-1.76ZM19.85,9.45v3.93l-6.47,6.47h-3.93l10.41-10.41ZM18.8,8.4l-10.41,10.41v-4.11l6.3-6.3h4.11ZM8.4,12.6v-3.59c0-.31.31-.61.61-.61h3.59l-4.2,4.2ZM14.25,4.25h1.83c.33,0,.67.33.67.67v2.33h-2.5v-3ZM7.25,16.75h-2.33c-.33,0-.67-.33-.67-.67V4.92c0-.33.33-.67.67-.67h5.17v3h-1.08c-.99,0-1.76.76-1.76,1.76v7.74ZM19.24,19.85h-3.76l4.37-4.37v3.76c0,.31-.31.61-.61.61Z"/>
    </g>

</svg>)

registerBlockType(metadata.name, {
    icon: coverlaysIcon,
    edit,
    save
});
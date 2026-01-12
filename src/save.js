import {
    InnerBlocks,
    useBlockProps
} from '@wordpress/block-editor';

const save = ({ attributes }) => {

    const { blockId } = attributes;
    
    return (
        <div {...useBlockProps.save({ className: `coverlays-block-${blockId}` })}>
            <InnerBlocks.Content />
        </div>
    );
};

export default save;

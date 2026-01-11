import {
    InnerBlocks,
    useBlockProps
} from '@wordpress/block-editor';
import buildBackgroundStyle from './utils/buildBackgroundStyle';

const save = ({ attributes }) => {

    const blockStyle = buildBackgroundStyle(attributes);
    
    return (
        <div {...useBlockProps.save({ style: blockStyle })}>
            <InnerBlocks.Content />
        </div>
    );
};

export default save;

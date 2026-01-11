import {
    InspectorControls,
    __experimentalPanelColorGradientSettings as PanelColorGradientSettings,
    InnerBlocks,
    useBlockProps,
    useSettings,
    MediaUpload,
    MediaUploadCheck
} from '@wordpress/block-editor';
import {
    Button,
    PanelBody,
    SelectControl,
    ToggleControl,
    FocalPointPicker
} from '@wordpress/components';
import buildBackgroundStyle from './utils/buildBackgroundStyle';

const edit = ({ attributes, setAttributes }) => {
    const { layers = [], backgroundImage } = attributes;
    const [colors = []] = useSettings('color.palette');
    const [gradients = []] = useSettings('color.gradients');

    const updateColor = (index, value) => {
        const nextLayers = [...layers];
        nextLayers[index].color = value;
        setAttributes({ layers: nextLayers });
    };

    const updateGradient = (index, value) => {
        const nextLayers = [...layers];
        nextLayers[index].gradient = value;
        setAttributes({ layers: nextLayers });
    };

    const addLayer = () => {
        setAttributes({
            layers: [...layers, { 'color': undefined, 'gradient': undefined }]
        });
    };

    const removeEmptyLayers = () => {
        const nextLayers = layers.filter(
            (layer) => layer.color || layer.gradient
        );

        setAttributes({ layers: nextLayers });
    };

    const hasEmptyLayers = layers.some(
        (layer) => !layer.color && !layer.gradient
    );

    const hasLayers = layers.length > 0;

    const settings = layers.map((layer, index) => ({
        label: `Overlay ${index + 1}`,
        colorValue: layer.color,
        gradientValue: layer.gradient,
        colors,
        gradients,
        clearable: true,
        onColorChange: (value) => updateColor(index, value),
        onGradientChange: (value) => updateGradient(index, value)
    }));

    const onSelectImage = (media) => {
        if (!media || !media.url) {
            return;
        }

        setAttributes({
            backgroundImage: {
                id: media.id,
                url: media.url,
                title: media.title?.rendered || media.title || '',
                focalPoint: { x: 0.5, y: 0.5 },
                repeat: 'no-repeat',
                size: 'cover',
                attachment: 'scroll',
            }
        });
    };

    const removeImage = () => {
        setAttributes({
            backgroundImage: null
        });
    };

    const blockStyle = buildBackgroundStyle(attributes);
    
    return (
        <>
            <InspectorControls>
                <PanelBody title="Background image" initialOpen={true}>
                    {backgroundImage?.url ? (
                        <>
                            <div style={{ 
                                display: 'flex', 
                                justifyContent: 'space-between',
                                alignItems: 'center', 
                                marginBottom: '12px',
                                border: '1px solid #ddd',
                                borderRadius: '2px',
                                padding: '6px 0 6px 12px'
                            }}>
                                <span style={{
                                    display: 'flex',
                                    alignItems: 'center'
                                }}>
                                    <img
                                        src={backgroundImage.url}
                                        alt=""
                                        style={{ width: '20px', height: '20px', borderRadius: '50%', objectFit: 'cover', marginRight: '8px' }}
                                    />
                                    <span>{backgroundImage.title || 'Sin título'}</span>
                                </span>
                                <Button onClick={removeImage}>
                                    <svg 
                                        xmlns="http://www.w3.org/2000/svg" 
                                        viewBox="0 0 24 24" 
                                        width="24" 
                                        height="24" 
                                        aria-hidden="true" 
                                        focusable="false"
                                    >
                                        <path d="M7 11.5h10V13H7z"></path>
                                    </svg>                                
                                </Button>
                            </div>

                            <FocalPointPicker
                                label="Focal Point"
                                url={backgroundImage.url}
                                value={backgroundImage.focalPoint}
                                onChange={(focalPoint) =>
                                    setAttributes({ backgroundImage: { ...backgroundImage, focalPoint } })
                                }
                                __nextHasNoMarginBottom
                            />

                            <ToggleControl
                                label="Fixed background"
                                checked={backgroundImage.attachment === 'fixed'}
                                onChange={(value) =>
                                    setAttributes({
                                        backgroundImage: { ...backgroundImage, attachment: value ? 'fixed' : 'scroll' }
                                    })
                                }
                                __nextHasNoMarginBottom
                            />

                            <SelectControl
                                label="Size"
                                value={backgroundImage.size}
                                options={[
                                    { label: 'Cover', value: 'cover' },
                                    { label: 'Contain', value: 'contain' },
                                    { label: 'Auto', value: 'auto' },
                                ]}
                                onChange={(size) =>
                                    setAttributes({ backgroundImage: { ...backgroundImage, size } })
                                }
                                __next40pxDefaultSize
                                __nextHasNoMarginBottom
                            />

                            <SelectControl
                                label="Repeat"
                                value={backgroundImage.repeat}
                                options={[
                                    { label: 'No repeat', value: 'no-repeat' },
                                    { label: 'Repeat', value: 'repeat' },
                                    { label: 'Horizontal repeat', value: 'repeat-x' },
                                    { label: 'Vertical repeat', value: 'repeat-y' },
                                ]}
                                onChange={(repeat) =>
                                    setAttributes({ backgroundImage: { ...backgroundImage, repeat } })
                                }
                                __next40pxDefaultSize
                                __nextHasNoMarginBottom
                            />
                        </>
                    ) : (
                        <MediaUploadCheck>
                            <MediaUpload
                                onSelect={onSelectImage}
                                allowedTypes={['image']}
                                value={backgroundImage?.id}
                                render={({ open }) => (
                                    <Button
                                        onClick={open}
                                        style={{ textAlign: "center", width: "100%", display: "block", border: "1px #ddd solid" }}
                                    >
                                        Add background image
                                    </Button>
                                )}
                            />
                        </MediaUploadCheck>
                    )}
                </PanelBody>
                <PanelColorGradientSettings
                    title="Overlays"
                    settings={settings}
                />
                <div style={{ padding: '0 16px 16px' }}>
                    <Button
                        onClick={addLayer}
                        variant={hasLayers ? 'primary' : ''}
                        style={{
                            textAlign: "center",
                            width: (hasLayers ? "auto" : "100%"),
                            display: (hasLayers ? "inline-flex" : "block"),
                            border: (hasLayers ? "inherit" : "1px #ddd solid")
                        }}
                    >
                        Add overlay
                    </Button>
                    {hasLayers && (<Button
                        variant="link"
                        isDestructive
                        onClick={removeEmptyLayers}
                        disabled={!hasEmptyLayers}
                        style={{ marginLeft: '8px' }}
                    >
                        Clear
                    </Button>)}
                </div>
            </InspectorControls>
            <div {...useBlockProps({ style: blockStyle })}><InnerBlocks /></div>
        </>
    )
}

export default edit;
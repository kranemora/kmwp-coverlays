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
    FocalPointPicker,
    Dropdown,
    MenuGroup,
    MenuItem
} from '@wordpress/components';
import { __, sprintf } from '@wordpress/i18n';
import buildBackgroundStyle from './utils/buildBackgroundStyle';
import { useState, useRef } from '@wordpress/element';
import { useSelect } from '@wordpress/data';


const edit = ({ attributes, setAttributes, clientId }) => {
    const { layers = [], backgroundImage, blockId } = attributes;
    const [colors = []] = useSettings('color.palette');
    const [gradients = []] = useSettings('color.gradients');
    const [isMediaOpen, setIsMediaOpen] = useState(false);
    const toggleRef = useRef(null);
    const [menuWidth, setMenuWidth] = useState(null);

    if (!blockId) {
        setAttributes({ blockId: clientId.slice(0, 8) });
    }

    const featuredImage = useSelect((select) => {
        const featuredId = select('core/editor').getEditedPostAttribute('featured_media');
        if (!featuredId) return null;
        return select('core').getEntityRecord('postType', 'attachment', featuredId);
    }, []); // [] asegura que solo se recalcula cuando se monta

    const hasFeaturedImage = useSelect(
        (select) => {
            const featuredId = select('core/editor')
                .getEditedPostAttribute('featured_media');

            return !!featuredId;
        },
        []
    );

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
        label: sprintf(
            __("Overlay %d", "kmwp-coverlays"),
            index + 1
        ),
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

    const openFeaturedImage = () => {
        if (featuredImage && featuredImage.source_url) {
            setAttributes({
                backgroundImage: {
                    id: featuredImage.id,
                    url: featuredImage.source_url,
                    title: featuredImage.title?.rendered || featuredImage.title || '',
                    focalPoint: { x: 0.5, y: 0.5 },
                    repeat: 'no-repeat',
                    size: 'cover',
                    attachment: 'scroll',
                }
            });
        }
    };

    const blockStyle = buildBackgroundStyle(attributes);

    return (
        <>
            <InspectorControls>
                <PanelBody title={__("Background image", "kmwp-coverlays")} initialOpen={true}>
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
                                        alt={backgroundImage.title || __("Background image", "kmwp-coverlays")}
                                        style={{ width: '20px', height: '20px', borderRadius: '50%', objectFit: 'cover', marginRight: '8px' }}
                                    />
                                    <span>{backgroundImage.title || __("Untitled", "kmwp-coverlays")}</span>
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
                                label={__("Focal Point", "kmwp-coverlays")}
                                url={backgroundImage.url}
                                value={backgroundImage.focalPoint}
                                onChange={(focalPoint) =>
                                    setAttributes({ backgroundImage: { ...backgroundImage, focalPoint } })
                                }
                                __nextHasNoMarginBottom
                            />

                            <ToggleControl
                                label={__("Fixed background", "kmwp-coverlays")}
                                checked={backgroundImage.attachment === 'fixed'}
                                onChange={(value) =>
                                    setAttributes({
                                        backgroundImage: { ...backgroundImage, attachment: value ? 'fixed' : 'scroll' }
                                    })
                                }
                                __nextHasNoMarginBottom
                            />

                            <SelectControl
                                label={__("Size", "kmwp-coverlays")}
                                value={backgroundImage.size}
                                options={[
                                    { label: __("Cover", "kmwp-coverlays"), value: 'cover' },
                                    { label: __("Contain", "kmwp-coverlays"), value: 'contain' },
                                    { label: __("Auto", "kmwp-coverlays"), value: 'auto' },
                                ]}
                                onChange={(size) =>
                                    setAttributes({ backgroundImage: { ...backgroundImage, size } })
                                }
                                __next40pxDefaultSize
                                __nextHasNoMarginBottom
                            />

                            <SelectControl
                                label={__("Repeat", "kmwp-coverlays")}
                                value={backgroundImage.repeat}
                                options={[
                                    { label: __("No repeat", "kmwp-coverlays"), value: 'no-repeat' },
                                    { label: __("Repeat", "kmwp-coverlays"), value: 'repeat' },
                                    { label: __("Horizontal repeat", "kmwp-coverlays"), value: 'repeat-x' },
                                    { label: __("Vertical repeat", "kmwp-coverlays"), value: 'repeat-y' },
                                ]}
                                onChange={(repeat) =>
                                    setAttributes({ backgroundImage: { ...backgroundImage, repeat } })
                                }
                                __next40pxDefaultSize
                                __nextHasNoMarginBottom
                            />
                        </>
                    ) : (
                        <>
                            {hasFeaturedImage ? (
                                <>
                                    {/* BOTÓN CON DROPDOWN */}
                                    <Dropdown
                                        style={{ display: "block" }}
                                        renderToggle={({ isOpen, onToggle }) => (
                                            <div ref={toggleRef} style={{ width: '100%' }}>
                                                <Button
                                                    onClick={() => {
                                                        if (toggleRef.current) {
                                                            setMenuWidth(toggleRef.current.offsetWidth);
                                                        }
                                                        onToggle();
                                                    }}
                                                    aria-expanded={isOpen}
                                                    style={{
                                                        width: "100%",
                                                        display: "block",
                                                        textAlign: "center",
                                                        border: "1px solid #ddd",
                                                    }}
                                                >
                                                    {__("Add background image", "kmwp-coverlays")}
                                                </Button>
                                            </div>
                                        )}
                                        renderContent={({ onClose }) => (
                                            <div style={{ minWidth: menuWidth }}>
                                                <MenuGroup
                                                    style={{
                                                        minWidth: menuWidth || undefined,
                                                    }}
                                                >
                                                    <MenuItem
                                                        icon={
                                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" class="components-menu-items__item-icon has-icon-right" aria-hidden="true" focusable="false"><path d="m7 6.5 4 2.5-4 2.5z"></path><path fill-rule="evenodd" clip-rule="evenodd" d="m5 3c-1.10457 0-2 .89543-2 2v14c0 1.1046.89543 2 2 2h14c1.1046 0 2-.8954 2-2v-14c0-1.10457-.8954-2-2-2zm14 1.5h-14c-.27614 0-.5.22386-.5.5v10.7072l3.62953-2.6465c.25108-.1831.58905-.1924.84981-.0234l2.92666 1.8969 3.5712-3.4719c.2911-.2831.7545-.2831 1.0456 0l2.9772 2.8945v-9.3568c0-.27614-.2239-.5-.5-.5zm-14.5 14.5v-1.4364l4.09643-2.987 2.99567 1.9417c.2936.1903.6798.1523.9307-.0917l3.4772-3.3806 3.4772 3.3806.0228-.0234v2.5968c0 .2761-.2239.5-.5.5h-14c-.27614 0-.5-.2239-.5-.5z"></path></svg>
                                                        }
                                                        isFullWidth
                                                        onClick={() => {
                                                            setIsMediaOpen(true);
                                                            onClose();
                                                        }}
                                                    >
                                                        {__("Open Media Library", "kmwp-coverlays")}
                                                    </MenuItem>

                                                    <MenuItem
                                                        icon={
                                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" focusable="false"><path d="M19 3H5c-.6 0-1 .4-1 1v7c0 .5.4 1 1 1h14c.5 0 1-.4 1-1V4c0-.6-.4-1-1-1zM5.5 10.5v-.4l1.8-1.3 1.3.8c.3.2.7.2.9-.1L11 8.1l2.4 2.4H5.5zm13 0h-2.9l-4-4c-.3-.3-.8-.3-1.1 0L8.9 8l-1.2-.8c-.3-.2-.6-.2-.9 0l-1.3 1V4.5h13v6zM4 20h9v-1.5H4V20zm0-4h16v-1.5H4V16z"></path></svg>                                                        }
                                                        isFullWidth
                                                        onClick={() => {
                                                            openFeaturedImage();
                                                            onClose();
                                                        }}
                                                    >
                                                        {__("Use Featured Image", "kmwp-coverlays")}
                                                    </MenuItem>
                                                </MenuGroup>

                                            </div>
                                        )}
                                    />

                                    {isMediaOpen && (
                                        <MediaUploadCheck>
                                            <MediaUpload
                                                onSelect={(media) => {
                                                    onSelectImage(media);
                                                    setIsMediaOpen(false);
                                                }}
                                                allowedTypes={["image"]}
                                                render={({ open }) => {
                                                    open();
                                                    return null;
                                                }}
                                            />
                                        </MediaUploadCheck>
                                    )}
                                </>
                            ) : (
                                <>
                                    {/* BOTÓN SIMPLE (NO hay featured image) */}
                                    <MediaUploadCheck>
                                        <MediaUpload
                                            onSelect={onSelectImage}
                                            allowedTypes={["image"]}
                                            render={({ open }) => (
                                                <Button
                                                    onClick={open}
                                                    style={{
                                                        textAlign: "center",
                                                        width: "100%",
                                                        display: "block",
                                                        border: "1px solid #ddd",
                                                    }}
                                                >
                                                    {__("Add background image", "kmwp-coverlays")}
                                                </Button>
                                            )}
                                        />
                                    </MediaUploadCheck>
                                </>
                            )}
                        </>
                    )}
                </PanelBody>
                <PanelColorGradientSettings
                    title={__("Overlays", "kmwp-coverlays")}
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
                        {__("Add overlay", "kmwp-coverlays")}
                    </Button>
                    {hasLayers && (<Button
                        variant="link"
                        isDestructive
                        onClick={removeEmptyLayers}
                        disabled={!hasEmptyLayers}
                        style={{ marginLeft: '8px' }}
                    >
                        {__("Clear", "kmwp-coverlays")}
                    </Button>)}
                </div>
            </InspectorControls>
            <div {...useBlockProps({ style: blockStyle })}><InnerBlocks /></div>
        </>
    )
}

export default edit;
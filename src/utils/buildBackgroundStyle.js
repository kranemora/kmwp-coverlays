const buildBackgroundStyle = ({ layers = [], backgroundImage }) => {
    const backgroundLayers = [];

    layers.forEach((layer) => {
        if (layer.gradient) {
            backgroundLayers.push(layer.gradient);
        } else if (layer.color) {
            backgroundLayers.push(`linear-gradient(${layer.color}, ${layer.color})`);
        }
    });

    if (backgroundImage?.url) {
        backgroundLayers.push(`url(${backgroundImage.url})`);
    }

    if (!backgroundLayers.length) {
        return undefined;
    }

    return {
        backgroundImage: backgroundLayers.join(', '),
        backgroundSize: backgroundImage?.size || 'cover',
        backgroundRepeat: backgroundImage?.repeat || 'no-repeat',
        backgroundPosition: backgroundImage?.focalPoint
            ? `${backgroundImage.focalPoint.x * 100}% ${backgroundImage.focalPoint.y * 100}%`
            : '50% 50%',
        backgroundAttachment: backgroundImage?.attachment || 'scroll',
    };
};

export default buildBackgroundStyle;

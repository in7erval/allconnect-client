import React, {FC, useState} from 'react';

interface LoadingImageProperties {
    showWhenLoading: React.ReactNode;
    src: string;
    alt: string;
    className?: string;
    onClick?: () => void;
}

const LoadingImage: FC<LoadingImageProperties> =
    ({
         showWhenLoading,
        src,
        alt,
        className,
        onClick
     }) => {
        const [isLoading, setIsLoading] = useState(true);
        return <>
            <img
                src={src}
                alt={alt}
                className={className}
                onClick={onClick}
                style={{display: `${isLoading ? "none" : "unset"}`}}
                onLoad={() => setIsLoading(false)}
            />
            {isLoading && showWhenLoading}
        </>
    };

export default LoadingImage;
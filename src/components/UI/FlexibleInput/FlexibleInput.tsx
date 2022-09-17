import React, {FC, useEffect, useRef, useState} from 'react';

interface FlexibleInputProperties {
    content: string;
    onChange: (_event: React.ChangeEvent<HTMLInputElement>) => void;
}

const FlexibleInput: FC<FlexibleInputProperties> = ({content, onChange}) => {
    const [width, setWidth] = useState(0);
    const span = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        if (span.current) {
            setWidth(span.current.offsetWidth);
        }
    }, [content]);
    return (
        <div>
            <span id="hide" ref={span}>{content}</span>
            <input
                type="text"
                style={{width}}
                value={content}
                onChange={onChange}
            />
        </div>
    );
};

export default FlexibleInput;
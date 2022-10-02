import React, {useEffect, useRef} from "react";

export const useObserver = (
    reference: React.MutableRefObject<HTMLElement>,
    canLoad: boolean,
    isLoading: boolean,
    callback: () => void
) => {
    const observer = useRef<any>(null);

    useEffect(() => {
        if (isLoading) return;
        if (observer.current) observer.current.disconnect();

        const callback_ = function (entries: IntersectionObserverEntry[], _observer: IntersectionObserver) {
            if (entries[0].isIntersecting && canLoad) {
                callback();
            }
        };
        observer.current = new IntersectionObserver(callback_);
        observer.current.observe(reference?.current);
    }, [isLoading])
};
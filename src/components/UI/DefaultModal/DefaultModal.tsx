import cl from './DefaultModal.module.css';
import React, {FC} from "react";

interface DefaultModalProperties {
    children?: React.ReactNode;
    visible: boolean;
    setVisible: (_value: boolean) => void;
}

const DefaultModal: FC<DefaultModalProperties> =
    ({
         children,
         visible,
         setVisible
     }) => {

        const rootClasses = [cl.myModal];

        if (visible) {
            rootClasses.push(cl.active);
        }

        return (
            <div className={rootClasses.join(' ')} onClick={() => setVisible(false)}>
                <div
                    className={cl.myModalContent}
                    onClick={(event_) => event_.stopPropagation()}
                >
                    {children}
                </div>
            </div>
        );
    };

export default DefaultModal;
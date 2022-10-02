import React, {FC, useEffect, useRef, useState} from 'react';
import cl from "./Input.module.css";

interface InputProperties {
    id: string;
    type: string;
    autoFocus: boolean;
    required: boolean;
    autoComplete: string;
    placeholder: string;
    value: string;
    onChange: (_value: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input: FC<InputProperties> =
    ({
         id,
         type,
         autoComplete,
         autoFocus,
         required,
         placeholder,
         value,
         onChange
     }) => {

        const inputReference = useRef<HTMLInputElement>(null);
        const [labelClass, setLabelClass] = useState<string>('');

        const onClickLabel = () => {
            if (inputReference.current) {
                inputReference.current.focus();
                setLabelClass(determineClassNameLabel());
            }
        }

        const determineClassNameLabel = () => {
            if (inputReference.current) {
                return inputReference.current === document.activeElement || value.length > 0 ? cl['small_text'] : '';
            } else {
                return "";
            }
        };

        useEffect(() => {
            setLabelClass(determineClassNameLabel());
        });

        return (
            <div className={cl.input}>
                <label
                    className={labelClass}
                    onClick={onClickLabel}
                >
                    {placeholder}
                </label>
                {<input
                    ref={inputReference}
                    id={id}
                    type={type}
                    required={required}
                    autoFocus={autoFocus}
                    autoComplete={autoComplete}
                    value={value}
                    onChange={onChange}
                    style={{height: value ? '20px' : '' }}
                />
                }
            </div>
        );
    };

export default Input;
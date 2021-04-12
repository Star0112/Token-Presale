/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useState, useEffect } from 'react';
import './input.css';


function Input({ name, value, onChangeHandler }) {
    const [inputValue, setInputValue] = useState('0');

    const onChange = (e) => {
        if (e.target.value.match(/^[0-9,.]*$/g)) {
            setInputValue(e.target.value);
        }
    }

    const emitChange = useCallback(
        async () => {
            let event = {
                target : {
                    name: name,
                    value: inputValue
                }
            };
            onChangeHandler(event);
        },
        [inputValue],
    )

    useEffect(() => {
        emitChange();
    }, [inputValue, emitChange]);

    return (
        <input type="text" name={name} className="myinput" value={value} onChange={(e) => onChange(e)} />
    );
}

export default Input;
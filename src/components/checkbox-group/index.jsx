import React from 'react';

let index = 0;

export default function (props) {
    const { options, value, onChangeValue } = props;
    const name = `checkbox_group_${index++}`;

    return (
        <>
            {options.map(item => (
                <>
                    <input type="checkbox" name={name}
                           value={item.value} checked={value.includes(item.value)}
                           onChange={e => onChangeValue(e.target.checked ? value.concat(item.value) : value.filter(val => val !== item.value))}/>
                    <span>{item.label}</span>
                </>
            ))}
        </>
    );
}

module.exports = function (source) {
    console.log(source);
    return 'import React from "react"; export default function () { return <div>123</div> }';
};

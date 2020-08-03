import React from "react";
import numeral from "numeral";
import "./table.styles.css";



// Table component
// Object destructing
function Table({ countries }) {
    return (
        <div className="table">
            {countries.map(({ country, cases }) => (
                <tr>
                    <td>{country}</td>
                    <td>
                        <strong>{numeral(cases).format("0,0")}</strong>
                    </td>
                </tr>
            ))}
        </div>
    );
}



export default Table;
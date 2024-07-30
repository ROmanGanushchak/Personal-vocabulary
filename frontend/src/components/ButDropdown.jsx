import React from "react";
import { Dropdown } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';

const CustomDropdownToggle = React.forwardRef(({ children, onClick, className }, ref) => (
    <button
      ref={ref}
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
      className={className}
    >
      {children}
    </button>
));

function BtnDropdown( {text, children, className="", menuClassName=""} ) {
    return <>
        <style>
            {`.no-arrow::after {
                display: none;
            }`}
        </style>

        <Dropdown>
            <Dropdown.Toggle as={CustomDropdownToggle} className={className + " no-arrow"}>
                {text}
            </Dropdown.Toggle>

            <Dropdown.Menu className={menuClassName}>
                {children}
            </Dropdown.Menu>
        </Dropdown>
    </>
};

export default BtnDropdown;
import { Form, Dropdown } from "react-bootstrap";
const DropdownSelector = (props) => {
  const { variant, className, label, labelRequired, chosen, options, onSelect, dropdownOff } = props;
  return (
    <>
     {labelRequired && <Form.Label><h6>{label}</h6></Form.Label>}
      <Dropdown className={className}>
        <Dropdown.Toggle variant={variant} className="btn-outline-dark">
          {chosen}
        </Dropdown.Toggle>

        <Dropdown.Menu>
          {options.map((item) => (
            <Dropdown.Item
              key={dropdownOff === "category" ? item._id : item}
              onClick={() => onSelect(item)}
            >
              {dropdownOff === "category" ? item.categoryName : item}{" "}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    </>
  );
};

export default DropdownSelector;

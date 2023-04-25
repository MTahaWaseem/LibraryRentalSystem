import { Form } from "react-bootstrap";

const Input = props => {
  const {label, type, placeholder, val, updateState} = props
    return (
    <Form.Group className="row mb-3 mt-3">
      <div className="col-md-9 offset-md-2">
        <Form.Label>
          <h6>{label}</h6>
        </Form.Label>
        <Form.Control
          type={type}
          placeholder={placeholder}
          value={val}
          onChange={updateState}
        />
      </div>
    </Form.Group>
  );
};

export default Input
const Spinner = props => {
  return (
    <div className="container">
      <div className="row">
        <div className=" d-flex align-items-center justify-content-center" style={{ height: '100px' }}>
          <div>{props.text}</div>
          <div className="spinner-border ms-1" role="status"></div>
        </div>
      </div>
    </div>
  );
};

export default Spinner;

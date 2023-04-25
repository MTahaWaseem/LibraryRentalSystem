import { Button } from "react-bootstrap";

const HomeCard = (props) => {
  const {image, name, description, onButtonPress} = props;
  return (
    <div className="col-12 col-md-4 col-lg-3 mb-4">
      <div className="card">
        <img
          src={`${image}`}
          className="card-img-top "
          alt="..."
          onClick={onButtonPress}
          style={{cursor:'pointer'}}
        />
        <div className="card-body">
          <h5 className="card-title">
            <strong>{name.charAt(0).toUpperCase() + name.slice(1)}</strong>
          </h5>
          <p className="card-text">{description}</p>
          <Button
            className="btn btn-primary "
            onClick={onButtonPress}
          >
            Explore
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HomeCard;

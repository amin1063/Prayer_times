import img from "../assets/4.jpg";

const ImageCard = (props) => {
  return (
    <div className="image-card">
      <img src={img} alt="img" />
      <div className="next-prayer">
        <p>Time remaining for {props.name} prayer</p>
        <h1>{props.time}</h1>
      </div>
    </div>
  );
};

export default ImageCard;

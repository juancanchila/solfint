// src/shared/components/Spinner/Spinner.jsx
import './Spinner.css';
import ReactLogo from '../../../assets/react.svg'; // Usa tu logo o el de React

const Spinner = ({ size = 100 }) => {
  return (
    <div className="spinner-container">
      <img
        src={ReactLogo}
        alt="Loading..."
        className="spinner"
        style={{ width: size, height: size }}
      />
    </div>
  );
};

export default Spinner;

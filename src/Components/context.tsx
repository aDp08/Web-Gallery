import { FC, useContext } from 'react'; // Keep React if needed elsewhere
import { AppContext } from '../Context/AppContext';

const ImageGallery: FC = () => {
  const context = useContext(AppContext);

  if (!context) {
    return <div>Error: AppContext is not available</div>;
  }

  const { AllImages } = context;

  return (
    <div>
      <div>
        {AllImages?.map(image => (
          <div key={image._id}>
            <h3>{image.title}</h3>
            <img src={image.imageurl} alt={image.title} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageGallery;

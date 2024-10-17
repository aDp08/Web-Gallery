import { useContext, useEffect } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { SlOptionsVertical } from 'react-icons/sl';
import { AppContext } from '../Context/AppContext';
import Model from './Model';

const ImageCart = () => {
  const context = useContext(AppContext);

  if (!context) {
    return <div>Error: Context not available.</div>;
  }

  const { AllImages, getimages, setselectedImageId, selectedImageId, setselectedImageTitle } = context;

  useEffect(() => {
    const fetchImages = async () => {
      await getimages();
    };
    fetchImages();
  }, [getimages]);

  const handleImageClick = (_id: string) => {
    setselectedImageId(_id);
  };

  return (
    <div className='h-[90vh] flex flex-wrap content-start overflow-y-scroll gap-8 p-4 sm:gap-x-6'>
      {AllImages.length > 0 ? (
        AllImages.map((item) => (
          <div 
            className='w-full sm:w-[20rem] relative hover:cursor-pointer' 
            key={item._id}
          >
            <div className='group relative overflow-hidden rounded-lg shadow-lg'>
              <LazyLoadImage 
                className='aspect-video w-full object-cover transform transition-transform duration-300 ease-in-out hover:scale-105 hover:rotate-1' 
                src={item.imageurl} 
                alt={item.title || "No Title Available"}
                onClick={() => handleImageClick(item._id)}
              />
              <div className='absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                <div className='absolute bottom-0 left-0 w-full p-4 text-white bg-black bg-opacity-70'>
                  <div className='text-sm truncate'>{item.title || "No Title Available"}</div>
                  <button 
                    onClick={() => { 
                      setselectedImageId(item._id);
                      setselectedImageTitle(item.title);
                    }}
                    className='text-2xl font-bold mt-2 float-right'
                  >
                    <SlOptionsVertical />
                  </button>
                </div>
              </div>
            </div>
            {selectedImageId === item._id && <Model />}
          </div>
        ))
      ) : (
        <div>No images available</div>
      )}
    </div>
  );
};

export default ImageCart;

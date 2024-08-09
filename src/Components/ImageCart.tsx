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
    <div className='h-[90vh] flex flex-wrap content-start overflow-y-scroll gap-20 p-4 sm:gap-x-6'>
      {AllImages.length > 0 ? (
        AllImages.map((item) => (
          <div 
            className='w-full h-fit sm:w-[28rem] relative hover:cursor-pointer' 
            key={item._id}
          >
            <LazyLoadImage 
              className='aspect-video w-full hover:scale-110 hover:rotate-2 transition-transform duration-200' 
              src={item.imageurl} 
              alt={item.title || "No Title Available"}
              onClick={() => handleImageClick(item._id)}
            />
            <div className='flex justify-between items-start absolute w-full'>
              <div className='bg-white shadow-lg py-3 flex items-center justify-between w-full transition-colors px-2 hover:bg-slate-400'>
                <div className='text-sm max-w-[20rem] overflow-hidden whitespace-nowrap text-ellipsis'>
                  {item.title || "No Title Available"}
                </div>
                <button 
                  onClick={() => { 
                    setselectedImageId(item._id);
                    setselectedImageTitle(item.title);
                  }}
                  className='text-2xl font-bold'
                >
                  <SlOptionsVertical />
                </button>
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

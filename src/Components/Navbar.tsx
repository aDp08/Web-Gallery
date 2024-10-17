import { useContext, useEffect, useState } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { SlOptionsVertical } from 'react-icons/sl';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import { AppContext } from '../Context/AppContext';
import Model from './Model';

const ImageCart = () => {
  const context = useContext(AppContext);
  const [likedImages, setLikedImages] = useState([]);

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

  const toggleLike = (_id: string) => {
    setLikedImages((prevLikes) =>
      prevLikes.includes(_id) ? prevLikes.filter((id) => id !== _id) : [...prevLikes, _id]
    );
  };

  return (
    <div className='h-[90vh] flex flex-wrap content-start overflow-y-scroll gap-10 p-4'>
      {AllImages.length > 0 ? (
        AllImages.map((item) => (
          <div
            className='w-full sm:w-[20rem] relative hover:cursor-pointer transition-transform duration-500 hover:scale-105'
            key={item._id}
          >
            {/* 3D Tilt + Zoom on Hover */}
            <div className='group relative overflow-hidden rounded-xl shadow-lg transform perspective-500 hover:scale-105 transition-transform duration-500'>
              <LazyLoadImage
                className='aspect-video w-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110'
                src={item.imageurl}
                alt={item.title || "No Title Available"}
                onClick={() => handleImageClick(item._id)}
              />

              {/* Gradient Overlay on Hover */}
              <div className='absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500'>
                <div className='absolute bottom-0 left-0 w-full p-4 text-white'>
                  <div className='text-md truncate font-bold'>{item.title || "No Title Available"}</div>
                  <button
                    onClick={() => {
                      setselectedImageId(item._id);
                      setselectedImageTitle(item.title);
                    }}
                    className='text-2xl mt-2 float-right'
                  >
                    <SlOptionsVertical />
                  </button>
                </div>
              </div>

              {/* Like Button */}
              <div className='absolute top-2 right-2'>
                <button onClick={() => toggleLike(item._id)}>
                  {likedImages.includes(item._id) ? (
                    <AiFillHeart className='text-red-500 text-3xl animate-pulse' />
                  ) : (
                    <AiOutlineHeart className='text-white text-3xl' />
                  )}
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

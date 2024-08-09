import { useState, useContext, ChangeEvent, useEffect } from 'react';
import { AppContext } from '../Context/AppContext';
import axios from 'axios';

const Model = () => {
  const context = useContext(AppContext);
  const [title, setTitle] = useState<string>("");

  if (!context) {
    return <div>Error: Context not available.</div>;
  }

  const { selectedImageId, setselectedImageId, AllImages, getimages } = context;

  // Find the selected image based on the selectedImageId
  const selectedImage = AllImages.find(image => image._id === selectedImageId);

  useEffect(() => {
    if (selectedImage) {
      setTitle(selectedImage.title);
    }
  }, [selectedImage]);

  const handleClose = () => setselectedImageId(null);

  const handleUpdateTitle = async () => {
    if (selectedImage && title.trim() !== '') {
      try {
        await axios.put(`https://server-psi-orcin.vercel.app/api/image/${selectedImage._id}`, { title });
        // setSelectedImageTitle(title); // Update the context with the new title
        getimages();
        handleClose();
      } catch (error) {
        console.error("Error updating image title:", error);
      }
    }
  };

  const handleDelete = async () => {
    if (selectedImage) {
      if (window.confirm("Are you sure you want to delete this image?")) {
        try {
          await axios.delete(`https://server-psi-orcin.vercel.app/api/image/${selectedImage._id}`);
          getimages();
          handleClose();
        } catch (error) {
          console.error("Error deleting image:", error);
        }
      }
    }
  };

  if (!selectedImage) {
    return null;
  }

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center transition-all duration-150 bg-black bg-opacity-75'>
      <div className='bg-white w-11/12 sm:w-[500px] h-80 rounded-lg p-4 sm:p-8 flex flex-col items-center relative'>
        <div 
          className='absolute top-2 right-2 sm:top-4 sm:right-4 h-8 w-8 flex justify-center items-center rounded-full cursor-pointer bg-black text-white' 
          onClick={handleClose}
        >
          X
        </div>
        <div className='flex w-full flex-col gap-4'>
          <input 
            type="text" 
            autoFocus 
            value={title}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
            className='w-full h-12 rounded-lg bg-slate-300 text-black px-5 text-sm sm:text-base' 
            placeholder="Enter new title"
          />
          <div className='flex justify-between gap-2'>
            <button 
              className='bg-gray-700 p-4 w-full hover:bg-gray-900 text-white rounded-md'
              onClick={handleClose}
            >
              Discard
            </button>
            <button 
              className='bg-blue-400 p-4 w-full hover:bg-blue-700 text-white rounded-md'
              onClick={handleUpdateTitle}
            >
              Save
            </button>
          </div>
        </div>
        <img 
          src={selectedImage.imageurl} 
          alt={selectedImage.title || "No Title Available"} 
          className='w-full h-3/5 object-cover rounded-lg mb-4' 
        />
        <h2 className='text-lg font-bold mb-4'>{selectedImage.title || "No Title Available"}</h2>
        <div className='flex justify-between w-full'>
          <button 
            className='bg-blue-500 font-extrabold h-16 w-48 py-4 px-2 rounded-xl text-sm text-white' 
            onClick={handleUpdateTitle}
          >
            Update Image Title
          </button>
          <button 
            className='bg-red-500 font-extrabold h-16 w-48 py-4 px-2 rounded-xl text-sm text-white' 
            onClick={handleDelete}
          >
            Delete Image
          </button>
        </div>
      </div>
    </div>
  );
};

export default Model;

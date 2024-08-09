import axios from 'axios';
import { ChangeEvent, FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Ensure this import is added
import Loader from './Loader';
// import { AppContext } from '../Context/AppContext';

const convertToBase64 = (file: File): Promise<string | ArrayBuffer | null> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
};

const ImageUploader = () => {
  // const {setrefresh}=useContext(AppContext)
  const [file, setFile] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [key, setKey] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false); // Add loading state
  const navigate = useNavigate();

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>): Promise<void> {
    if (event.target.files && event.target.files[0]) {
      const base64 = await convertToBase64(event.target.files[0]);
      console.log(base64);
      setFile(base64 as string);
    }
  }

  function handleTitleChange(event: ChangeEvent<HTMLInputElement>): void {
    setTitle(event.target.value);
  }

  function handleDiscard(e: React.MouseEvent<HTMLButtonElement>): void {
    e.preventDefault();
    setFile("");
    setTitle("");
    setKey(prevKey => prevKey + 1);
  }

  async function handleUploadImage(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    try {
      if (!file) return;
      setLoading(true); // Set loading state to true
      const payload = {
        title: title,
        image: file
      };
      const response = await axios.post("https://server-psi-orcin.vercel.app/api/upload", payload, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log('Server response:', response);
      setFile("");
      setTitle("");
      setKey(prevKey => prevKey + 1);
      setLoading(false)
      navigate("/");
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setLoading(false); // Set loading state to false
    }
  }

  return (
    <div className='flex items-center justify-center h-full absolute w-full p-4 sm:p-8'>
      <div className='bg-white p-6 w-full sm:w-[600px] rounded-lg shadow-lg'>
        <h2 className='text-xl font-bold mb-4'>
          Upload Image
        </h2>
        {loading ? (
          <Loader />
        ) : (
          <form onSubmit={handleUploadImage} className='space-y-4 flex flex-col'>
            <input key={key} onChange={handleFileChange} type="file" className='border-gray-300 border p-2 rounded-md' />
            <input 
              type="text" 
              placeholder='Image Title' 
              className='border-gray-300 border p-2 rounded-md' 
              value={title}
              onChange={handleTitleChange}
            />
            <button type="submit" className='mt-4 bg-blue-500 text-white p-2 rounded-md'>Upload</button>
            <button onClick={handleDiscard} className='mt-4 bg-red-500 text-white p-2 rounded-md'>Discard</button>
          </form>
        )}
      </div>
    </div>
  );
}

export default ImageUploader;

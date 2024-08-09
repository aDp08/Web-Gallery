import axios from 'axios';
import { createContext, useState, ReactNode, FC, useEffect } from 'react';

// Define the structure of image data
interface ImageData {
  _id: string;
  title: string;
  imageurl: string;
  public_id: string;
}

// Define the structure of the context value
interface AppContextValue {
  AllImages: ImageData[];
  getimages: () => void;
  selectedImageId: string | null;
  setselectedImageId: (_id: string | null) => void;
  selectedImageTitle: string | null;
  setselectedImageTitle: (title: string | null) => void;
}

// Create context with an initial undefined value
const AppContext = createContext<AppContextValue | undefined>(undefined);

interface AppContextProps {
  children: ReactNode;
}

// Create a functional component for the context provider
export const AppContextProvider: FC<AppContextProps> = ({ children }) => {
  const [selectedImageId, setselectedImageId] = useState<string | null>(null);
  const [selectedImageTitle, setselectedImageTitle] = useState<string | null>(null);
  const [AllImages, setAllImages] = useState<ImageData[]>([]);

  // Function to fetch images from the API
  const getimages = async () => {
    try {
      const res = await axios.get("https://server-psi-orcin.vercel.app/api/allImages");
      if (Array.isArray(res.data)) {
        setAllImages(res.data);
      } else {
        console.error("Unexpected data format received from API", res.data);
        setAllImages([]);
      }
    } catch (error) {
      console.error("Error fetching images from API:", error);
      setAllImages([]);
    }
  };

  // Fetch images when the component mounts
  useEffect(() => {
    getimages();
  }, []);

  // Provide context values to children components
  return (
    <AppContext.Provider value={{ AllImages, getimages, setselectedImageId, selectedImageId, setselectedImageTitle, selectedImageTitle }}>
      {children}
    </AppContext.Provider>
  );
};

export { AppContext };

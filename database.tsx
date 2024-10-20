import React, { useState, useRef, useEffect } from 'react';
import Webcam from 'react-webcam';
import Tesseract from 'tesseract.js';

const DatabasePage = () => {
    const [data, setData] = useState([
        { id: 1, name: "Product A", mfgDate: "2023-01-15", mrp: 100, description: "Sample product A" },
        { id: 2, name: "Product B", mfgDate: "2023-05-20", mrp: 150, description: "Sample product B" },
        { id: 3, name: "Product C", mfgDate: "2023-03-10", mrp: 200, description: "Sample product C" },
    ]);

    const [newEntry, setNewEntry] = useState({ name: '', mfgDate: '', mrp: '', description: '' });
    const [editingId, setEditingId] = useState<number | null>(null);
    const [isCameraOpen, setCameraOpen] = useState(false);
    const [imageData, setImageData] = useState<string | null>(null);
    const webcamRef = useRef<Webcam>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewEntry(prevEntry => ({ ...prevEntry, [name]: value }));
    };

    const handleAddOrEditEntry = (e?: React.FormEvent) => {
        e?.preventDefault();
        const entryToAdd = { id: data.length + 1, ...newEntry };
        if (editingId !== null) {
            setData(data.map(item => item.id === editingId ? entryToAdd : item));
        } else {
            setData([...data, entryToAdd]);
        }
        setNewEntry({ name: '', mfgDate: '', mrp: '', description: '' });
        setEditingId(null);
    };

    const handleEdit = (id: number) => {
        const entryToEdit = data.find(item => item.id === id);
        if (entryToEdit) {
            setNewEntry({ ...entryToEdit });
            setEditingId(id);
        }
    };

    const handleDelete = (id: number) => {
        if (window.confirm("Are you sure you want to delete this entry?")) {
            setData(data.filter(item => item.id !== id));
        }
    };

    const handleCapture = async () => {
        const imageSrc = webcamRef.current?.getScreenshot();
        if (imageSrc) {
            setImageData(imageSrc);
            await performOCR(imageSrc);
        } else {
            alert("No image captured. Please try again.");
        }
    };

    const performOCR = async (imageSrc: string) => {
        try {
            const result = await Tesseract.recognize(imageSrc, 'eng', {
                logger: info => console.log(info)
            });
            const text = result.data.text;
            console.log('OCR Result:', text);
            if (text) {
                parseOCRText(text);
            } else {
                alert("No text detected. Please ensure the image has readable content.");
            }
        } catch (error) {
            console.error('OCR error: ', error);
            alert("OCR failed to detect text. Please try again with a clearer image.");
        }
    };

    const parseOCRText = (text: string) => {
        console.log('Parsed OCR Text:', text);
        
        // Generic regex patterns to match various formats
        const namePattern = /(?:name|product)\s*:\s*([^\n]*)/i; // Matches "name: Product X"
        const mfgPattern = /(?:mfg|manufacturing|date)\s*:\s*([^\n]*)/i; // Matches "mfg: 23/05/24"
        const datePattern = /(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{1,2,4})/; // Matches dates like "23/05/24" or "23-05-2024"
        const mrpPattern = /(?:mrp|price)\s*:\s*([\d.,]+)/i; // Matches "mrp: 150"
        
        const nameMatch = text.match(namePattern);
        const mfgMatch = text.match(mfgPattern) || text.match(datePattern);
        const mrpMatch = text.match(mrpPattern);
        
        const name = nameMatch ? nameMatch[1].trim() : ''; // Optional field
        const mfgDate = mfgMatch ? mfgMatch[1].trim() : ''; // Optional field
        const mrp = mrpMatch ? mrpMatch[1].trim() : ''; // Optional field
        
        setNewEntry({
            name: name,
            mfgDate: mfgDate,
            mrp: mrp,
            description: '' // Optional field
        });

        // Automatically save the entry to the database
        handleAddOrEditEntry();
    };

    useEffect(() => {
        if (isCameraOpen) {
            const intervalId = setInterval(() => {
                // Simulate video processing every 5 seconds to capture the best image
                handleCapture();
            }, 5000);
            return () => clearInterval(intervalId);
        }
    }, [isCameraOpen]);

    return (
        <div className="p-4">
            <h1 className="text-center text-2xl font-bold mb-4">Database Table</h1>

            {isCameraOpen ? (
                <div className="mb-4">
                    <Webcam
                        audio={false}
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        width={320}
                    />
                    <button
                        onClick={handleCapture}
                        className="bg-green-500 text-white px-4 py-2 mt-2"
                    >
                        Capture Image
                    </button>
                    <button
                        onClick={() => setCameraOpen(false)}
                        className="bg-red-500 text-white px-4 py-2 mt-2 ml-2"
                    >
                        Close Camera
                    </button>
                </div>
            ) : (
                <button
                    onClick={() => setCameraOpen(true)}
                    className="bg-blue-500 text-white px-4 py-2"
                >
                    Open Camera
                </button>
            )}

            {imageData && (
                <div className="relative">
                    <img src={imageData} alt="Captured" className="border" />
                </div>
            )}

            <div className="mb-4">
                <h2 className="text-xl font-semibold mb-2">{editingId ? 'Edit Entry' : 'Add New Entry'}</h2>
                <form onSubmit={handleAddOrEditEntry} className="mb-4">
                    <input
                        type="text"
                        name="name"
                        placeholder="Name (Optional)"
                        value={newEntry.name}
                        onChange={handleInputChange}
                        className="border border-gray-300 px-4 py-2 mr-2"
                    />
                    <input
                        type="text"
                        name="mfgDate"
                        placeholder="MFG Date (Optional)"
                        value={newEntry.mfgDate}
                        onChange={handleInputChange}
                        className="border border-gray-300 px-4 py-2 mr-2"
                    />
                    <input
                        type="text"
                        name="mrp"
                        placeholder="MRP (Optional)"
                        value={newEntry.mrp}
                        onChange={handleInputChange}
                        className="border border-gray-300 px-4 py-2 mr-2"
                    />
                    <input
                        type="text"
                        name="description"
                        placeholder="Description (Optional)"
                        value={newEntry.description}
                        onChange={handleInputChange}
                        className="border border-gray-300 px-4 py-2 mr-2"
                    />
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2"
                    >
                        {editingId ? 'Save Changes' : 'Add Entry'}
                    </button>
                </form>
            </div>

            <table className="min-w-full border border-gray-300">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border border-gray-300 px-4 py-2">ID</th>
                        <th className="border border-gray-300 px-4 py-2">Name</th>
                        <th className="border border-gray-300 px-4 py-2">MFG Date</th>
                        <th className="border border-gray-300 px-4 py-2">MRP</th>
                        <th className="border border-gray-300 px-4 py-2">Description</th>
                        <th className="border border-gray-300 px-4 py-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item) => (
                        <tr key={item.id} className="border-b">
                            <td className="border border-gray-300 px-4 py-2">{item.id}</td>
                            <td className="border border-gray-300 px-4 py-2">{item.name}</td>
                            <td className="border border-gray-300 px-4 py-2">{item.mfgDate}</td>
                            <td className="border border-gray-300 px-4 py-2">{item.mrp}</td>
                            <td className="border border-gray-300 px-4 py-2">{item.description}</td>
                            <td className="border border-gray-300 px-4 py-2">
                                <button
                                    onClick={() => handleEdit(item.id)}
                                    className="bg-yellow-500 text-white px-2 py-1 mr-1"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(item.id)}
                                    className="bg-red-500 text-white px-2 py-1"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DatabasePage;

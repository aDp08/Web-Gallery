
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import { AppContextProvider } from "./Context/AppContext";
import ImageCart from "./Components/ImageCart";
import ImageUploader from "./Components/ImageUploader";

const App = () => {
    return (
        <AppContextProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route index element={<ImageCart />} />
                    <Route path="/upload" element={<div><ImageUploader /></div>} />
                    </Route>
                </Routes>
            </Router>
        </AppContextProvider>
    );
};

export default App;

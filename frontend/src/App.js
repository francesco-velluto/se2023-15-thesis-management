import 'bootstrap/dist/css/bootstrap.min.css';

import {Route, Routes} from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import ProposalsPage from "./pages/ProposalsPage";

function App() {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/proposals" element={<ProposalsPage />} />
        </Routes>
    );
}

export default App;

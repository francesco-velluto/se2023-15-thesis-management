import {Route, Routes} from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import NewProposalPage from "./pages/NewProposalPage";

function App() {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/newProposalPage" element = {<NewProposalPage />} />
        </Routes>
    );
}

export default App;

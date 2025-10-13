import { Routes, Route } from "react-router-dom";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";
import InscriptionPage from "./pages/InscriptionPage.jsx";

export default function App() {
  return (
    <div id='app' className='app'>
      <Header />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/inscription' element={<InscriptionPage />} />
      </Routes>
      <Footer />
    </div>
  );
}

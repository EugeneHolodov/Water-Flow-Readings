import { BrowserRouter, Route, Routes } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';
import Home from './pages/Home/Home'
import FormPage from './pages/FormPage/FormPage';
import EndPageSuccessed from './pages/EndPage/EndPageSuccessed';
import EndPageFailed from './pages/EndPage/EndPageFailed';
import CarouselPage from './pages/CarouselPage/CarouselPage';
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Home />} />
        <Route
          path='about'
          element={<CarouselPage />} />
        <Route
          path='form'
          element={<FormPage />} />
        <Route
          path='finish_successed'
          element={<EndPageSuccessed />} />
          <Route
          path='finish_failed'
          element={<EndPageFailed />} />
        <Route
          path="*"
          element={<NotFoundPage />} />
      </Routes>
      
    </BrowserRouter>
  );
}

export default App;

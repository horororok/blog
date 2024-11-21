import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import AboutPage from "./pages/AboutPage";
import LandingPage from "./pages/LandingPage";
import Main from "./pages/Main";
import DevlifePage from "./pages/DevlifePage";
import StudyPage from "./pages/StudyPage";
import ProjecgtPage from "./pages/ProjectPage";
import EtcPage from "./pages/EtcPage";
import ScrollToTop from "./hooks/scrollToTop";
import Posts from "./components/common/Posts";

const Router = () => {
  return (
    <BrowserRouter basename="/blog">
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Main />}>
          <Route index element={<LandingPage />} />
          <Route path="devlife" element={<Outlet />}>
            <Route index element={<DevlifePage />} />
            <Route path=":id" element={<Posts section="devlife" />} />
          </Route>
          <Route path="project" element={<Outlet />}>
            <Route index element={<ProjecgtPage />} />
            <Route path=":id" element={<Posts section="project" />} />
          </Route>
          <Route path="study" element={<Outlet />}>
            <Route index element={<StudyPage />} />
            <Route path=":id" element={<Posts section="study" />} />
          </Route>
          <Route path="about" element={<AboutPage />} />
          <Route path="etc" element={<EtcPage />} />
        </Route>
        <Route path="*" element={<h1>Not Found</h1>} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;

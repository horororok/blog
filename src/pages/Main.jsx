import { Outlet } from "react-router-dom";
import Nav from "../components/Nav";
import styled from "styled-components";
import Footer from "../components/Footer";

const OuterContainer = styled.div`
  padding-top: 50px;
`;

const MainContainer = styled.div`
  width: 100%;
`;

const Main = () => {
  return (
    <MainContainer>
      <Nav />
      <OuterContainer>
        <Outlet />
      </OuterContainer>
      <Footer />
    </MainContainer>
  );
};

export default Main;

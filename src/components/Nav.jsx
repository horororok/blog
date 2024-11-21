import { Link } from "react-router-dom";
import { useTheme } from "../hooks/useTheme";
import styled from "styled-components";
import { useState } from "react";

import dark_mode from "../assets/dark_mode.svg";
import light_mode from "../assets/light_mode.svg";

// 네비게이션 컨테이너
const Navigation = styled.nav`
  background-color: ${(props) =>
    props.theme === "light" ? "#ffffff" : "#1a1a1a"};
  padding: 1rem 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;

  background-color: ${(props) =>
    props.theme === "light"
      ? "rgba(255, 255, 255, 0.9)"
      : "rgba(26, 26, 26, 0.9)"};
  backdrop-filter: blur(5px);

  transition: box-shadow 0.3s ease;
  box-shadow: ${(props) =>
    props.isScrolled ? "0 2px 4px rgba(0, 0, 0, 0.1)" : "none"};
`;

// NavList 수정
const NavList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  align-items: center;
  gap: 2rem;
  width: 100%;

  @media (max-width: 768px) {
    display: none; // 모바일에서는 기본적으로 숨김
  }
`;

// 사이드바 컨테이너
const SidebarContainer = styled.div`
  position: fixed;
  top: 0;
  right: ${(props) => (props.isOpen ? "0" : "-200px")};
  width: 200px;
  height: 100vh;
  background-color: ${(props) =>
    props.theme === "light" ? "#ffffff" : "#1a1a1a"};
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
  transition: right 0.3s ease-in-out;
  z-index: 1001;
  padding-top: 60px;

  @media (min-width: 769px) {
    display: none;
  }
`;

// 모바일 네비게이션 리스트
const MobileNavList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

// 모바일 네비게이션 아이템
const MobileNavItem = styled.li`
  padding: 1rem 2rem;
  border-bottom: 1px solid
    ${(props) => (props.theme === "light" ? "#eee" : "#333")};
`;

// 햄버거 버튼
const HamburgerButton = styled.button`
  display: none;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  z-index: 1002;

  @media (max-width: 768px) {
    display: block;
  }
`;

// 오버레이
const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: ${(props) => (props.isOpen ? "block" : "none")};
  z-index: 1000;
`;

const NavItem = styled.li`
  margin: 0;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: ${(props) =>
    props.theme === "light" ? "#213547" : "rgba(255, 255, 255, 0.87)"};
  font-weight: 500;
  transition: color 0.3s ease;

  &:hover {
    color: #646cff;
  }
`;

const ThemeToggleButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease;
  position: relative;
  top: 0rem;
  right: 0rem;

  .img {
    width: 2rem;
    height: 2rem;
  }

  &:hover {
    transform: scale(1.1);
  }

  &:focus {
    outline: none;
  }
`;

const NavContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: flex-start;
  align-items: center;

  @media (max-width: 768px) {
    padding: 0 0rem;
  }
`;

// 햄버거 아이콘 컴포넌트
const HamburgerIcon = styled.div`
  width: 24px;
  height: 20px;
  position: relative;
  transform: rotate(0deg);
  transition: 0.5s ease-in-out;
  cursor: pointer;

  span {
    display: block;
    position: absolute;
    height: 3px;
    width: 100%;
    background: ${(props) => (props.theme === "light" ? "#213547" : "#fff")};
    border-radius: 3px;
    opacity: 1;
    left: 0;
    transform: rotate(0deg);
    transition: 0.25s ease-in-out;

    &:nth-child(1) {
      top: ${(props) => (props.isOpen ? "9px" : "0px")};
      transform: ${(props) => (props.isOpen ? "rotate(135deg)" : "rotate(0)")};
    }

    &:nth-child(2) {
      top: 9px;
      opacity: ${(props) => (props.isOpen ? "0" : "1")};
    }

    &:nth-child(3) {
      top: ${(props) => (props.isOpen ? "9px" : "18px")};
      transform: ${(props) => (props.isOpen ? "rotate(-135deg)" : "rotate(0)")};
    }
  }
`;

const Nav = () => {
  const { theme, toggleTheme } = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const menuItems = [
    { path: "/", label: "Home" },
    { path: "/devlife", label: "DevLife" },
    { path: "/project", label: "Project" },
    { path: "/study", label: "Study" },
    { path: "/about", label: "About" },
    { path: "/etc", label: "Etc" },
  ];

  return (
    <>
      <Navigation theme={theme}>
        <NavContainer>
          <NavList>
            {menuItems.map((item) => (
              <NavItem key={item.path}>
                <StyledLink to={item.path} theme={theme}>
                  {item.label}
                </StyledLink>
              </NavItem>
            ))}
          </NavList>

          <HamburgerButton onClick={toggleSidebar}>
            <HamburgerIcon theme={theme} isOpen={isSidebarOpen}>
              <span></span>
              <span></span>
              <span></span>
            </HamburgerIcon>
          </HamburgerButton>
          <ThemeToggleButton onClick={toggleTheme}>
            <img
              src={theme === "light" ? dark_mode : light_mode}
              alt="theme"
              style={{ width: "2rem", height: "2rem" }}
            />
          </ThemeToggleButton>
        </NavContainer>
      </Navigation>

      <Overlay isOpen={isSidebarOpen} onClick={closeSidebar} />

      <SidebarContainer theme={theme} isOpen={isSidebarOpen}>
        <MobileNavList>
          {menuItems.map((item) => (
            <MobileNavItem key={item.path} theme={theme}>
              <StyledLink to={item.path} theme={theme} onClick={closeSidebar}>
                {item.label}
              </StyledLink>
            </MobileNavItem>
          ))}
        </MobileNavList>
      </SidebarContainer>
    </>
  );
};

export default Nav;

import styled from "styled-components";

const FooterContainer = styled.footer`
  text-align: center;
  padding: 1rem;

  span {
    display: block;
    width: 100%;
    height: 1px;
    background-color: #e0e0e0;
    margin: 0.5rem 0;
  }
`;

const Footer = () => {
  return (
    <FooterContainer>
      <span />
      <p>© 2024</p>
      <p>By Kim Taehun</p>
    </FooterContainer>
  );
};

export default Footer;

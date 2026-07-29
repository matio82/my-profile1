// components/Layout.jsx
import HexagonalBackground from './HexagonalBackground';
import Navbar from './Navbar';

const Layout = ({ children }) => {
  return (
    <>
      <HexagonalBackground />
      <Navbar />
      <main>{children}</main>
    </>
  );
};

export default Layout;

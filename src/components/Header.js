import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Container, Dropdown } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../utils/firebaseConfig';
import { AccountCircle, Login } from '@mui/icons-material';
import './styles/Header.css'; 
import corhuilalogoheader from '../images/corhuilalogoheader.png';

const Header = () => {
  const { currentUser, userRole } = useContext(AuthContext);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <Navbar bg="dark" expand="lg" className="header-navbar">
      <Container>
        <Navbar.Brand as={Link} to="/">
          <img src={corhuilalogoheader} alt='logo' className='logo'/>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {userRole === 'estudiante' && <Nav.Link as={Link} to="/estudiante">Portal</Nav.Link>}
            {userRole === 'estudiante' && <Nav.Link as={Link} to="/reportes-notas">Reportes de Notas</Nav.Link>}
            {userRole === 'estudiante' && <Nav.Link as={Link} to="/ver-notas">Ver Notas</Nav.Link>}
            {userRole === 'docente' && <Nav.Link as={Link} to="/docente">Portal</Nav.Link>}
            {userRole === 'docente' && <Nav.Link as={Link} to="/subir-notas">Subir Notas</Nav.Link>}
          </Nav>
          <Nav>
            {currentUser ? (
              <Dropdown alignRight>
                <Dropdown.Toggle variant="success" id="dropdown-basic">
                  <AccountCircle /> {currentUser.email}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item onClick={handleLogout}>Cerrar Sesión</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <Nav.Link as={Link} to="/login" className="login-icon">
                <Login /> Iniciar Sesión
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;

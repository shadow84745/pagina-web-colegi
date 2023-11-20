import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../utils/firebaseConfig';
import './styles/LoginScreen.css'
import { AuthContext } from '../../context/AuthContext';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { setCurrentUser, setUserRole } = useContext(AuthContext); // Asegúrate de incluir estas funciones en tu AuthContext

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      setCurrentUser(user); // Actualiza el estado del usuario en el contexto

      // Obtener el rol del usuario de Firestore
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const { rol } = userSnap.data();
        setUserRole(rol); // Actualiza el rol en el contexto

        // Redirigir según el rol
        if (rol === 'estudiante') {
          navigate('/estudiante'); 
        } else if (rol === 'docente') {
          navigate('/docente');
        }
      }
    } catch (error) {
      console.error("Error en el inicio de sesión:", error.message);
      // Manejar errores de inicio de sesión aquí (mostrar mensaje al usuario, etc.)
    }
  };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleLogin}>
                <h2>Iniciar Sesión</h2>
                <div className="input-group">
                    <label htmlFor="email">Correo Electrónico</label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="password">Contraseña</label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="login-button">Entrar</button>
            </form>
        </div>
    );
};

export default LoginScreen;

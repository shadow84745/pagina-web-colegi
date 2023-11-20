import { Route, Routes } from 'react-router-dom';
import './App.css';
import HomeScreen from './screens/home/HomeScreen';
import RegisterScreen from './screens/auth/RegisterScreen';
import LoginScreen from './screens/auth/LoginScreen';
import PortalEstudiante from './screens/students/PortalEstudiante';
import PortalProfesores from './screens/teachers/PortalProfesores';
import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/Header';
import DocenteScreen from './screens/teachers/DocenteScreen';
import StudentsDetailScreen from './screens/teachers/StudentsDetailsScreen';
import StudentGradesScreen from './screens/students/StudentGradesScreen';
import ReportesScreen from './screens/students/ReportesScreen';

function App() {
  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path='/' element={<HomeScreen />}/>
        <Route path='/login' element={<LoginScreen />}/>
        <Route path='/register' element={<RegisterScreen />}/>
        <Route 
          path='/estudiante' 
          element={
            <ProtectedRoute roles={['estudiante']}>
              <PortalEstudiante />
            </ProtectedRoute>
          }
        />
        <Route 
          path='/ver-notas' 
          element={
            <ProtectedRoute roles={['estudiante']}>
              <StudentGradesScreen />
            </ProtectedRoute>
          }
        />
        <Route 
          path='/reportes-notas' 
          element={
            <ProtectedRoute roles={['estudiante']}>
              <ReportesScreen />
            </ProtectedRoute>
          }
        />
        <Route 
          path='/docente' 
          element={
            <ProtectedRoute roles={['docente']}>
              <PortalProfesores />
            </ProtectedRoute>
          }
        />
        <Route 
          path='/subir-notas' 
          element={
            <ProtectedRoute roles={['docente']}>
              <DocenteScreen />
            </ProtectedRoute>
          }
        />
        <Route 
          path='/student-profile/:estudianteId' // Aquí defines la ruta con un parámetro dinámico
          element={
            <ProtectedRoute roles={['docente']}>
              <StudentsDetailScreen /> 
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;

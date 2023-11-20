// screens/estudiante/StudentsDetailScreen.js
import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { db } from '../../utils/firebaseConfig';
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
  getDoc
} from 'firebase/firestore';

import './styles/StudentsDetailScreen.css';
import { Button, Modal } from 'react-bootstrap';
import Swal from 'sweetalert2';


const StudentsDetailScreen = () => {
  const { estudianteId } = useParams();
  const location = useLocation(); // Usar useLocation para obtener el estado de navegación
  const cursoId = location.state?.cursoId; // Acceder al cursoId a través del estado, si existe

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notaEditando, setNotaEditando] = useState(null);
  const [notas, setNotas] = useState([]);
  const [estudiante, setEstudiante] = useState({});


  // Abrir modal con los datos de la nota seleccionada
  const abrirModalEditar = (nota) => {
    console.log("Abriendo modal con nota:", nota); // Verificar los datos de la nota
    setNotaEditando(nota);
    setIsModalOpen(true);
  };

  useEffect(() => {
    console.log("Estado del modal:", isModalOpen); // Verificar si el estado del modal cambia
  }, [isModalOpen]);


  const cerrarModal = () => {
    setNotaEditando(null);
    setIsModalOpen(false);
  };

  // Asegúrate de que cursoId esté definido antes de intentar cargar las notas
  useEffect(() => {
    if (cursoId && estudianteId) {
      cargarNotas();
      cargarEstudiante();
    }
  }, [cursoId, estudianteId]);

  const cargarNotas = async () => {
    // Asegúrate de que cursoId esté definido antes de intentar cargar las notas
    if (cursoId) {
      const notasRef = collection(db, "courses", cursoId, "notas"); // Usar el cursoId real
      const q = query(notasRef, where("student", "==", estudianteId));
      const querySnapshot = await getDocs(q);
      setNotas(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }
  };

  const cargarEstudiante = async () => {
    const docRef = doc(db, "users", estudianteId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setEstudiante({ id: docSnap.id, ...docSnap.data() });
    }
  };

  // Función para eliminar nota
  const eliminarNota = async (notaId) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "¡No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar!',
      cancelButtonText: 'No, cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        // Proceder con la eliminación
        deleteDoc(doc(db, "courses", cursoId, "notas", notaId))
          .then(() => {
            setNotas(notas.filter(nota => nota.id !== notaId));
            Swal.fire(
              '¡Eliminado!',
              'La nota ha sido eliminada.',
              'success'
            );
          })
          .catch((error) => {
            console.error("Error al eliminar la nota: ", error);
            Swal.fire(
              'Error',
              'Hubo un problema al eliminar la nota.',
              'error'
            );
          });
      }
    });
  };

  // Función para editar nota
  const actualizarNota = async () => {
    if (notaEditando) {
      // Calcular la suma de los porcentajes de todas las notas, excluyendo la nota actual
      const sumaPorcentajes = notas.reduce((total, nota) => {
        return nota.id !== notaEditando.id ? total + Number(nota.percentage) : total;
      }, 0);
  
      // Sumar el nuevo porcentaje de la nota que se está editando
      const sumaTotalConEdicion = sumaPorcentajes + Number(notaEditando.percentage);
  
      // Verificar si la suma total de los porcentajes excede el 100%
      if (sumaTotalConEdicion > 1) {
        Swal.fire({
          title: 'Error',
          text: 'La suma total de los porcentajes no puede exceder el 100%.',
          icon: 'error',
          confirmButtonText: 'Ok'
        });
        return;
      }
  
      // Proceder con la actualización de la nota
      const notaRef = doc(db, "courses", cursoId, "notas", notaEditando.id);
  
      await updateDoc(notaRef, {
        description: notaEditando.description,
        value: Number(notaEditando.value),
        percentage: Number(notaEditando.percentage)
      })
      .then(() => {
        cargarNotas();
        cerrarModal();
        Swal.fire(
          'Actualizado',
          'La nota ha sido actualizada correctamente.',
          'success'
        );
      })
      .catch((error) => {
        console.error("Error al actualizar la nota: ", error);
        Swal.fire(
          'Error',
          'Hubo un problema al actualizar la nota.',
          'error'
        );
      });
    }
  };

  const capitalize = (str) => {
    return str.replace(/(?:^|\s)\S/g, a => a.toUpperCase());
  };

  return (
    <div className="container">
    <h2>Notas del Estudiante: <span className="student-name">{capitalize(estudiante.name + ' ' + estudiante.surname)}</span></h2>
    <table className="table table-hover">
        <thead>
          <tr>
            <th>Descripción</th>
            <th>Valor</th>
            <th>Porcentaje</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {notas.map(nota => (
            <tr key={nota.id}>
              <td>{capitalize(nota.description)}</td>
              <td>{nota.value.toString()}</td>
              <td>{(nota.percentage * 100).toFixed(2)}%</td>
              <td>
                <button className="btn btn-warning" onClick={() => abrirModalEditar(nota)}>Editar</button> {/* Modificación aquí */}
                <button className="btn btn-danger" onClick={() => eliminarNota(nota.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Modal show={isModalOpen} onHide={cerrarModal}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Nota</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <label>Descripción de la Nota</label>
          <input
            type="text"
            className="form-control mb-2"
            value={notaEditando?.description}
            onChange={(e) => setNotaEditando({ ...notaEditando, description: e.target.value })}
          />
          <label>Valor de la Nota</label>
          <input
            type="number"
            className="form-control mb-2"
            value={notaEditando?.value}
            onChange={(e) => setNotaEditando({ ...notaEditando, value: parseFloat(e.target.value) })}
          />
          <label>Porcentaje de la Nota</label>
          <input
            type="number"
            className="form-control mb-2"
            value={notaEditando?.percentage}
            onChange={(e) => setNotaEditando({ ...notaEditando, percentage: parseFloat(e.target.value) })}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cerrarModal}>
            Cerrar
          </Button>
          <Button variant="primary" onClick={actualizarNota}>
            Guardar Cambios
          </Button>
        </Modal.Footer>
      </Modal>

    </div>
  );
};

export default StudentsDetailScreen;

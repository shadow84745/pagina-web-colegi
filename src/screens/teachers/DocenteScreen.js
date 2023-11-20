// screens/docente/DocenteScreen.js
import React, { useState, useEffect } from 'react';
import { db } from '../../utils/firebaseConfig';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import './styles/DocenteScreen.css'
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';


const DocenteScreen = () => {
    const grados = ['Seleccione un grado', 'primero', 'segundo', 'tercero', 'cuarto', 'quinto', 'sexto']; // Asegúrate de que coincidan con la base de datos
    const [materias, setMaterias] = useState([]); // Materias del docente
    const [estudiantes, setEstudiantes] = useState([]); // Estudiantes en el curso seleccionado
    const [gradoSeleccionado, setGradoSeleccionado] = useState('');
    const [materiaSeleccionada, setMateriaSeleccionada] = useState(null);
    const [nombreDeLaNota, setNombreDeLaNota] = useState('');
    const [valorDeLaNota, setValorDeLaNota] = useState('');
    const [porcentajeDeLaNota, setPorcentajeDeLaNota] = useState('');

    const navigate = useNavigate();


    // Cargar materias del docente
    useEffect(() => {
        const cargarMaterias = async () => {
            const user = getAuth().currentUser;
            if (user) {
                const docenteId = user.uid;
                const q = query(collection(db, "courses"), where("teacher", "==", docenteId));
                const querySnapshot = await getDocs(q);
                setMaterias(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            }
        };

        cargarMaterias();
    }, []);

    const handleMateriaChange = (e) => {
        const materiaId = e.target.value;
        const materia = materias.find(m => m.id === materiaId);
        setMateriaSeleccionada(materia);
    };

    // Cargar estudiantes cuando se selecciona un grado y una materia
    useEffect(() => {
        const cargarEstudiantes = async () => {
            if (gradoSeleccionado && materiaSeleccionada && materiaSeleccionada.name) {
                const q = query(
                    collection(db, "users"),
                    where("grade", "==", gradoSeleccionado.toLowerCase()), // Usa toLowerCase() para asegurar la coincidencia
                    where("courses", "array-contains", materiaSeleccionada.name) // Usa el nombre de la materia
                );
                const querySnapshot = await getDocs(q);
                setEstudiantes(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            }
        };

        if (gradoSeleccionado && materiaSeleccionada) {
            cargarEstudiantes();
        }
    }, [gradoSeleccionado, materiaSeleccionada]);


    const handleAgregarNota = async (estudianteId, nombreNota, valorNota, porcentajeNota) => {
        try {
            if (materiaSeleccionada && estudianteId && nombreNota !== undefined && valorNota !== undefined && porcentajeNota !== undefined) {
                const porcentajeNuevo = parseFloat(porcentajeDeLaNota);

                // Calcular la suma total de los porcentajes
                const notasRef = collection(db, "courses", materiaSeleccionada.id, "notas");
                const querySnapshot = await getDocs(notasRef);
                const sumaPorcentajes = querySnapshot.docs.reduce((total, doc) => {
                    console.log("Porcentaje existente:", parseFloat(doc.data().percentage)); // Debugging
                    return total + parseFloat(doc.data().percentage);
                }, 0);

                console.log("Suma total de porcentajes:", sumaPorcentajes); // Debugging
                console.log("Porcentaje nuevo:", porcentajeNuevo); // Debugging

                // Verificar si se excede el 100%
                if (sumaPorcentajes + porcentajeNuevo > 1) {
                    Swal.fire({
                        title: 'Error',
                        text: 'La suma total de los porcentajes no puede exceder el 100%.',
                        icon: 'error',
                        confirmButtonText: 'Ok'
                    });
                    return;
                }

                // Agregar la nota
                await addDoc(notasRef, {
                    student: estudianteId,
                    description: nombreNota,
                    value: valorNota,
                    percentage: porcentajeNuevo
                });

                // Mostrar mensaje de éxito
                Swal.fire({
                    title: '¡Éxito!',
                    text: 'La nota se ha subido correctamente.',
                    icon: 'success',
                    confirmButtonText: 'Ok'
                });

                // Limpiar campos
                setNombreDeLaNota('');
                setValorDeLaNota('');
                setPorcentajeDeLaNota('');
            } else {
                // Manejar el caso en que alguna de las variables es undefined
                Swal.fire({
                    title: 'Error',
                    text: 'Por favor, completa todos los campos.',
                    icon: 'error',
                    confirmButtonText: 'Ok'
                });
            }
        } catch (error) {
            console.error("Error al agregar la nota:", error);
            Swal.fire({
                title: 'Error',
                text: 'Hubo un problema al subir la nota.',
                icon: 'error',
                confirmButtonText: 'Ok'
            });
        }
    };

    const capitalize = (str) => {
        return str.replace(/(?:^|\s)\S/g, a => a.toUpperCase());
      };

    return (
        <div className="container mt-4">
            <h2 className="text-center mb-4">Subir Notas</h2>
            <div className="row">
                <div className="col-md-6">
                    <select className="form-select select-dropdown" value={gradoSeleccionado} onChange={(e) => setGradoSeleccionado(e.target.value)}>
                        {grados.map(grado => (
                            <option key={grado} value={grado}>{grado}</option>
                        ))}
                    </select>
                </div>
                <div className="col-md-6">
                    <select className="form-select select-dropdown" value={materiaSeleccionada?.id || ''} onChange={handleMateriaChange}>
                        <option value="">Seleccione una materia</option>
                        {materias.map(materia => (
                            <option key={materia.id} value={materia.id}>{materia.name}</option>
                        ))}
                    </select>
                </div>
            </div>
            <table className="table table-hover table-custom">
                <thead>
                    <tr>
                        <th>Estudiantes</th>
                        <th>Descripcion Nota</th>
                        <th>Calificacion</th>
                        <th>Porcentaje</th>
                        <th>Acción</th>
                    </tr>
                </thead>
                <tbody>
                    {estudiantes.map(estudiante => (
                        <tr key={estudiante.id}>
                            <td>{capitalize(estudiante.surname) + " " + capitalize(estudiante.name)}</td>
                            <td>
                                <input type="text" value={nombreDeLaNota} onChange={(e) => setNombreDeLaNota(e.target.value)} placeholder="Nombre de la nota" />
                            </td>
                            <td>
                                <input type="number" value={valorDeLaNota} onChange={(e) => setValorDeLaNota(e.target.value)} placeholder="Calificacion(Entre 0 a 5)" />
                            </td>
                            <td>
                                <input type="number" value={porcentajeDeLaNota} onChange={(e) => setPorcentajeDeLaNota(e.target.value)} placeholder="Porcentaje" />
                            </td>
                            <td>
                                <button onClick={() => handleAgregarNota(
                                    estudiante.id,
                                    nombreDeLaNota,
                                    parseFloat(valorDeLaNota), // Convierte a número si es necesario
                                    parseFloat(porcentajeDeLaNota) // Convierte a número si es necesario
                                )}>
                                    Agregar Nota
                                </button>
                                <button onClick={() => navigate(`/student-profile/${estudiante.id}`, { state: { cursoId: materiaSeleccionada.id } })}>
                                    Ver Notas
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DocenteScreen;

// screens/docente/DocenteScreen.js
import React, { useState, useEffect } from 'react';
import { db } from '../../utils/firebaseConfig';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import './styles/DocenteScreen.css'
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

import { TextField, Button, Select, MenuItem } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEye } from '@fortawesome/free-solid-svg-icons';


const DocenteScreen = () => {
    const grados = ['primero', 'segundo', 'tercero', 'cuarto', 'quinto', 'sexto']; // Asegúrate de que coincidan con la base de datos
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
            // Validación de campos vacíos
            if (!nombreNota || !valorNota || !porcentajeNota) {
                Swal.fire({
                    title: 'Error',
                    text: 'Todos los campos deben estar llenos.',
                    icon: 'error',
                    confirmButtonText: 'Ok'
                });
                return;
            }

            // Convertir a número y validar calificación y porcentaje
            const valorNotaNum = parseFloat(valorNota);
            const porcentajeNotaNum = parseFloat(porcentajeNota);

            if (valorNotaNum < 0 || valorNotaNum > 5) {
                Swal.fire({
                    title: 'Error',
                    text: 'La calificación debe estar entre 0 y 5.',
                    icon: 'error',
                    confirmButtonText: 'Ok'
                });
                return;
            }

            if (porcentajeNotaNum < 0.01 || porcentajeNotaNum > 1) {
                Swal.fire({
                    title: 'Error',
                    text: 'El porcentaje debe estar entre 0.01 y 1.',
                    icon: 'error',
                    confirmButtonText: 'Ok'
                });
                return;
            }


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
                    <Select
                        value={gradoSeleccionado}
                        onChange={(e) => setGradoSeleccionado(e.target.value)}
                        displayEmpty
                        className="select-dropdown"
                    >
                        <MenuItem value="">Seleccione un grado</MenuItem>
                        {grados.map(grado => (
                            <MenuItem key={grado} value={grado}>{grado}</MenuItem>
                        ))}
                    </Select>
                </div>

                <div className="col-md-6">
                    <Select
                        value={materiaSeleccionada?.id || ''}
                        onChange={handleMateriaChange}
                        displayEmpty
                        className="select-dropdown"
                    >
                        <MenuItem value="">Seleccione una materia</MenuItem>
                        {materias.map(materia => (
                            <MenuItem key={materia.id} value={materia.id}>{materia.name}</MenuItem>
                        ))}
                    </Select>
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
                                <TextField
                                    type="text"
                                    value={nombreDeLaNota}
                                    onChange={(e) => setNombreDeLaNota(e.target.value)}
                                    placeholder="Nombre de la nota"
                                    variant="outlined"
                                    size="small"
                                />
                            </td>
                            <td>
                                <TextField
                                    type="number"
                                    value={valorDeLaNota}
                                    onChange={(e) => setValorDeLaNota(e.target.value)}
                                    placeholder="Calificación (Entre 0 a 5)"
                                    variant="outlined"
                                    size="small"
                                />
                            </td>
                            <td>
                                <TextField
                                    type="number"
                                    value={porcentajeDeLaNota}
                                    onChange={(e) => setPorcentajeDeLaNota(e.target.value)}
                                    placeholder="Porcentaje"
                                    variant="outlined"
                                    size="small"
                                />
                            </td>

                            <td>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => handleAgregarNota(
                                        estudiante.id,
                                        nombreDeLaNota,
                                        parseFloat(valorDeLaNota),
                                        parseFloat(porcentajeDeLaNota)
                                    )}
                                    className='action-button'
                                >
                                    <FontAwesomeIcon icon={faPlus} /> Agregar Nota
                                </Button>
                                <Button
                                    className='action-button'
                                    variant="contained"
                                    color="secondary"
                                    onClick={() => navigate(`/student-profile/${estudiante.id}`, { state: { cursoId: materiaSeleccionada.id } })}
                                >
                                    <FontAwesomeIcon icon={faEye} /> Ver Notas
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DocenteScreen;

import React, { useState, useEffect } from 'react';
import { db } from '../../utils/firebaseConfig';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const StudentGradesScreen = () => {
    const [materias, setMaterias] = useState([]);
    const [grado, setGrado] = useState("");
    const [notas, setNotas] = useState([]);
    const [materiaSeleccionada, setMateriaSeleccionada] = useState('');
    const [cargandoNotas, setCargandoNotas] = useState(false);

    const user = getAuth().currentUser;

    useEffect(() => {
        // Obtener las materias y el grado del estudiante
        const obtenerMaterias = async () => {
            const userRef = doc(db, "users", user.uid);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
                setMaterias(userSnap.data().courses);
                setGrado(userSnap.data().grade);
            }
        };
        obtenerMaterias();
    }, [user.uid]);

    const seleccionarMateria = async (materia) => {
        setMateriaSeleccionada(materia);
        setNotas([]); // Restablecer notas antes de la nueva consulta
        setCargandoNotas(true); // Iniciar la carga de notas

        // Encontrar el ID del curso basado en la materia y el grado del estudiante
        const coursesRef = collection(db, "courses");
        const coursesQuery = query(coursesRef, where("name", "==", materia), where("grade", "==", grado));
        const coursesSnapshot = await getDocs(coursesQuery);

        if (!coursesSnapshot.empty) {
            const cursoId = coursesSnapshot.docs[0].id;

            // Obtener las notas para la materia seleccionada
            const notasRef = collection(db, "courses", cursoId, "notas");
            const notasQuery = query(notasRef, where("student", "==", user.uid));
            const notasSnap = await getDocs(notasQuery);
            setNotas(notasSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        }
        setCargandoNotas(false); // Finalizar la carga de notas
    };

    return (
        <div className="container mt-5">
        <h1 className="text-center mb-4">Mis Materias</h1>
        <div className="d-flex flex-wrap justify-content-center mb-4">
            {materias.map((materia, index) => (
                <button 
                    key={index} 
                    className="btn btn-outline-primary m-2" 
                    onClick={() => seleccionarMateria(materia)}>
                    {materia}
                </button>
            ))}
        </div>

        {materiaSeleccionada && (
            <div>
                <h2 className="text-center mb-3">Notas en {materiaSeleccionada}</h2>
                {cargandoNotas ? (
                    <div className="text-center">
                        <div className="spinner-border text-primary" role="status">
                            <span className="sr-only">Cargando...</span>
                        </div>
                    </div>
                ) : notas.length > 0 ? (
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>Descripción</th>
                                <th>Valor</th>
                                <th>Porcentaje</th>
                            </tr>
                        </thead>
                        <tbody>
                            {notas.map((nota) => (
                                <tr key={nota.id}>
                                    <td>{nota.description}</td>
                                    <td>{nota.value}</td>
                                    <td>{(nota.percentage * 100).toFixed(2)}%</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="alert alert-warning" role="alert">
                        No se han registrado notas para esta materia.
                    </div>
                )}
            </div>
        )}
    </div>
    );
};

export default StudentGradesScreen;

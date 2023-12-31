import React, { useState, useEffect } from 'react';
import { db } from '../../utils/firebaseConfig';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import './styles/ReportesScreen.css'
import { Page, Text, View, Document, StyleSheet, PDFDownloadLink, Image } from '@react-pdf/renderer';
import logou from  "../../images/corhuilalogo.png";

const ReportesScreen = () => {
    const [reportData, setReportData] = useState([]);
    const user = getAuth().currentUser;

    useEffect(() => {
        const fetchGrades = async () => {
            const allGrades = await getAllStudentGrades(user.uid);
            const processedData = processGradesForReport(allGrades);
            setReportData(processedData);
        };

        fetchGrades();
    }, [user.uid]);

    const styles = StyleSheet.create({
        page: {
            flexDirection: 'column',
            backgroundColor: '#E4E4E4'
        },
        section: {
            margin: 10,
            padding: 10,
            flexGrow: 1
        },
        logo: {
            width: 150, // o el tamaño que prefieras
            height: 'auto',
            alignSelf: 'center',
            margin: 10
        }
    });

    const MyDocument = ({ reportData }) => (
        <Document>
            <Page size="A4" style={styles.page}>
                <Image
                  style={styles.logo}
                  src={logou} // reemplaza con la ruta de tu logo
                />
                <View style={styles.section}>
                    <Text>Reporte de Notas</Text>
                    {reportData.map((item, index) => (
                        <Text key={index}>
                            {item.subject}: {item.finalGrade ? `Final - ${item.finalGrade}` : 'Aun no hay nota definitiva'}
                        </Text>
                    ))}
                </View>
            </Page>
        </Document>
    );

    const DownloadPDFReport = ({ reportData }) => (
        <PDFDownloadLink document={<MyDocument reportData={reportData} />} fileName="reporte_notas.pdf">
            {({ blob, url, loading, error }) => (loading ? 'Cargando documento...' : 'Descargar reporte de notas')}
        </PDFDownloadLink>
    );

    async function getAllStudentGrades(studentId) {
        let allGrades = [];
        // Obtener materias del estudiante
        const userRef = doc(db, "users", studentId);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            const userCourses = userSnap.data().courses || [];
            // Obtener notas para cada materia
            for (const courseName of userCourses) {
                const coursesRef = collection(db, "courses");
                const courseQuery = query(coursesRef, where("name", "==", courseName));
                const courseSnapshot = await getDocs(courseQuery);

                for (const courseDoc of courseSnapshot.docs) {
                    const courseId = courseDoc.id;
                    // Ahora obtener las notas de cada curso
                    const notasRef = collection(db, "courses", courseId, "notas");
                    const notasQuery = query(notasRef, where("student", "==", studentId));
                    const notasSnapshot = await getDocs(notasQuery);

                    notasSnapshot.forEach(notaDoc => {
                        allGrades.push({
                            materia: courseName,
                            ...notaDoc.data()
                        });
                    });
                }
            }
        }
        return allGrades;
    }

    function processGradesForReport(grades) {
        const finalGrades = grades.reduce((acc, current) => {
            if (!acc[current.materia]) {
                acc[current.materia] = { totalPonderado: 0, percentageSum: 0 };
            }
            acc[current.materia].totalPonderado += current.value * current.percentage;
            acc[current.materia].percentageSum += current.percentage;
            return acc;
        }, {});

        return Object.entries(finalGrades).map(([subject, { totalPonderado, percentageSum }]) => {
            let currentGrade = '';
            let finalGrade = '';

            if (percentageSum < 1) {
                currentGrade = `${(totalPonderado).toFixed(2)}`;
            } else {
                finalGrade = `${(totalPonderado / percentageSum).toFixed(2)}`;
            }
            return { subject, currentGrade, finalGrade };
        });
    }



    // Función para descargar el reporte
    /*const downloadReport = () => {
        let csvContent = "data:text/csv;charset=utf-8,";
        // Encabezados
        csvContent += "Materia,Nota Final\n";

        // Cuerpo del archivo
        reportData.forEach(row => {
            let rowContent = `${row.subject},${row.finalGrade}\n`;
            csvContent += rowContent;
        });

        // Crear un enlace para descargar
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', 'reporte_notas.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };*/

    const capitalize = (str) => {
        return str.replace(/(?:^|\s)\S/g, a => a.toUpperCase());
    };

    return (
        <div className="container mt-5 report-container">
             <h1 className="text-center mb-4">Reporte de Notas</h1>
            <DownloadPDFReport reportData={reportData} />

            <div className="table-responsive">
                <table className="table table-hover table-striped">
                    <thead className="table-dark">
                        <tr>
                            <th>Materia</th>
                            <th>Nota Actual</th>
                            <th>Nota Final</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reportData.length > 0 ? (
                            reportData.map((item, index) => (
                                <tr key={index}>
                                    <td>{capitalize(item.subject)}</td>
                                    <td>{item.currentGrade || 'N/A'}</td>
                                    <td>{item.finalGrade || 'N/A'}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3" className="text-center">
                                    No hay datos de notas para mostrar.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ReportesScreen;

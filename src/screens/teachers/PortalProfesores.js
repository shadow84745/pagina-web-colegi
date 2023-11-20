import React from 'react';
import Carousel from 'react-bootstrap/Carousel';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import './styles/PortalProfesores.css'; // Cambiar el estilo para docentes
import docenteSlider1 from "../../images/teacherSlider1.png";
import docenteSlider2 from "../../images/homeImage2.png";

const PortalProfesores = () => {
    return (
        <div>
            <div className="header">
                <h1 className="text-center">Bienvenido Docente</h1>
                {/* Mensaje personalizado según el horario del día */}
                <p className="text-center">Buenos días, listo para inspirar mentes jóvenes?</p>
            </div>

            <Carousel>
                <Carousel.Item>
                    <img className="d-block w-100" src={docenteSlider1} alt="Primer slide para docentes" />
                    <Carousel.Caption>
                        <h3>Los docentes mejores calificados</h3>
                        <p>Descripción formal del primer slide.</p>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                    <img className="d-block w-100" src={docenteSlider2} alt="Second slide para docentes" />
                    <Carousel.Caption>
                        <h3>Fomentando la excelencia</h3>
                        <p>Descripción formal del segundo slide.</p>
                    </Carousel.Caption>
                </Carousel.Item>
                {/* Agregar más elementos si es necesario */}
            </Carousel>

            {/* Sección de tarjetas informativas - Enfocadas en recursos para docentes */}
            <Grid container spacing={4} className="my-4">
                <Grid item xs={12} sm={6} md={4}>
                    <Card>
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="div">
                                Recurso para Docentes 1
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Información útil y recursos para la enseñanza.
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                {/* Repetir para más tarjetas */}
            </Grid>

            {/* Sección de anuncios académicos */}
            <div className="anuncios my-4">
                <h2>Anuncios Académicos</h2>
                <p>Información relevante y actualizaciones para el personal docente.</p>
                {/* Agregar más contenido según sea necesario */}
            </div>
        </div>
    )
}

export default PortalProfesores;

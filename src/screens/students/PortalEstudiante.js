import React from 'react';
import Carousel from 'react-bootstrap/Carousel';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import './styles/PortalEstudiante.css'
import slider1 from  "../../images/slider1.png";
import slider2 from  "../../images/slider2.png";


const PortalEstudiante = () => {
    return (
        <div>
            <h1 className="text-center my-4">Bienvenido Estudiante</h1>

            {/* Carrusel */}
            <Carousel>
                <Carousel.Item>
                    <img className="d-block w-100" src={slider1} alt="Primer slide" />
                    <Carousel.Caption>
                        <h3>Titulo de la imagen 1</h3>
                        <p>Descripción breve de la imagen 1.</p>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                    <img className="d-block w-100" src={slider2} alt="Second slide" />
                    <Carousel.Caption>
                        <h3>Titulo de la imagen 2</h3>
                        <p>Descripción breve de la imagen 2.</p>
                    </Carousel.Caption>
                </Carousel.Item>
                {/* Agregar más elementos si es necesario */}
            </Carousel>

            {/* Sección de tarjetas informativas */}
            <Grid container spacing={4} className="my-4">
                <Grid item xs={12} sm={6} md={4}>
                    <Card>
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="div">
                                Título de la Tarjeta
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Descripción de la tarjeta. Información útil para el estudiante.
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                {/* Repetir para más tarjetas */}
            </Grid>

            {/* Sección de avisos */}
            <div className="avisos my-4">
                <h2>Avisos Importantes</h2>
                <p>Aquí puedes colocar avisos o actualizaciones importantes para los estudiantes.</p>
                {/* Agregar más contenido según sea necesario */}
            </div>
        </div>
    )
}

export default PortalEstudiante;

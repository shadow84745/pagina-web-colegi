import React from 'react';
import { Container, Row, Col, Carousel, Card } from 'react-bootstrap';
import { School, EmojiEvents, AutoStories } from '@mui/icons-material';
import 'bootstrap/dist/css/bootstrap.min.css';
import corhuilalogo from '../../images/corhuilalogo.png'
import './styles/HomeScreen.css'

const HomeScreen = () => {
  return (
    <Container fluid>
      <Carousel>
        <Carousel.Item>
          <img src={corhuilalogo} alt='slider-logo' className='logo-home'/>
        </Carousel.Item>

      </Carousel>

      <Row className="my-5">
        <Col md={4}>
          <Card className="text-center">
            <Card.Body>
              <School fontSize="large" />
              <Card.Title>Misión</Card.Title>
              <Card.Text>
                Nuestra misión es proporcionar educación de calidad...
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center">
            <Card.Body>
              <EmojiEvents fontSize="large" />
              <Card.Title>Visión</Card.Title>
              <Card.Text>
                Ser líderes en educación, formando profesionales...
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center">
            <Card.Body>
              <AutoStories fontSize="large" />
              <Card.Title>Valores</Card.Title>
              <Card.Text>
                Fomentamos la integridad, el respeto y la excelencia...
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>


      <Row className="my-5">
        <Col>
          <h2 className="text-center">Últimas Noticias</h2>
          {/* Aquí puedes insertar un carrusel o lista de noticias */}
        </Col>
      </Row>

      {/* Additional sections like news, events, testimonials */}
      {/* ... */}
    </Container>
  )
}

export default HomeScreen;

// src/components/NotFound.tsx
import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import "../css/NotFound.css";
import { useNavigate } from 'react-router-dom';

const NotFound: React.FC = () => {
  const navigate = useNavigate();
  return (
    <Container fluid className="min-vh-100 d-flex align-items-center justify-content-center bg-dark position-relative overflow-hidden">
      {/* Animated particles background */}
      <div className="particles-container">
        {[...Array(40)].map((_, i) => (
          <span key={`four-${i}`} className="particle particle-4">4</span>
        ))}
        {[...Array(40)].map((_, i) => (
          <span key={`zero-${i}`} className="particle particle-0">0</span>
        ))}
      </div>

      <Row className="w-100 justify-content-center position-relative" style={{ zIndex: 10 }}>
        <Col xs={12} md={8} lg={6}>
          <Card className="border-0 bg-transparent text-center">
            <Card.Body className="p-5">
              {/* Large 404 with glow effect */}
              <div className="display-1 text-white mb-4 fw-bold" style={{ 
                textShadow: '0 0 20px rgba(0, 255, 255, 0.7), 0 0 40px rgba(0, 255, 255, 0.5), 0 0 60px rgba(0, 255, 255, 0.3)',
                fontSize: '8rem',
                letterSpacing: '1rem'
              }}>
                404
              </div>
              
              {/* Main message */}
              <h1 className="text-white mb-3" style={{ 
                textShadow: '0 0 10px rgba(255, 255, 255, 0.5)',
                fontSize: '2.5rem'
              }}>
                Damnit stranger,
              </h1>
              
              <h2 className="h2 text-white-50 mb-4">
                You got lost in the <strong className="text-info">404 galaxy</strong>
              </h2>
              
              <p className="text-white-50 mb-5" style={{ fontSize: '1.2rem' }}>
                The page you're looking for has drifted into deep space or never existed.
              </p>
              
              {/* Animated button */}
              <Button 
                variant="outline-info" 
                size="lg" 
                className="px-5 py-3 rounded-pill border-2 position-relative overflow-hidden"
                onClick={()=>navigate('/')}
                style={{
                  background: 'rgba(0, 255, 255, 0.1)',
                  backdropFilter: 'blur(5px)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(0, 255, 255, 0.2)';
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.boxShadow = '0 0 30px rgba(0, 255, 255, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(0, 255, 255, 0.1)';
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                  <span className="me-2">🚀</span>
                  Return to Earth
                  <span className="ms-2">🌍</span>
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default NotFound;
// src/pages/teacher/components/SkeletonLoader.tsx
import React from "react";
import { Container, Card, Row, Col, Placeholder } from "react-bootstrap";

export const WelcomeSectionSkeleton: React.FC = () => (
  <Card
    className="border-0 rounded-4 mb-4"
    style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}
  >
    <Card.Body className="p-4">
      <div className="d-flex align-items-center mb-3">
        <Placeholder as="div" animation="glow" className="me-3">
          <div
            className="rounded-circle bg-white bg-opacity-25"
            style={{ width: "60px", height: "60px" }}
          ></div>
        </Placeholder>
        <div className="flex-grow-1">
          <Placeholder as={Placeholder} animation="glow">
            <Placeholder
              xs={6}
              bg="light"
              className="rounded mb-2"
              style={{ opacity: 0.5 }}
            />
            <Placeholder
              xs={8}
              bg="light"
              className="rounded"
              style={{ opacity: 0.5 }}
            />
          </Placeholder>
        </div>
      </div>
      <Placeholder as={Placeholder} animation="glow">
        <Placeholder
          xs={3}
          bg="light"
          className="rounded-pill"
          style={{ opacity: 0.5 }}
        />
      </Placeholder>
    </Card.Body>
  </Card>
);

export const StatCardSkeleton: React.FC = () => (
  <Card className="border-0 rounded-4 shadow-sm">
    <Card.Body className="p-4">
      <div className="d-flex justify-content-between align-items-start">
        <div className="w-100">
          <Placeholder as={Placeholder} animation="glow">
            <Placeholder
              xs={2}
              className="rounded-3 mb-3"
              style={{ height: "40px" }}
            />
            <Placeholder
              xs={4}
              className="rounded mb-2"
              style={{ height: "32px" }}
            />
            <Placeholder xs={6} className="rounded" />
          </Placeholder>
        </div>
        <Placeholder as={Placeholder} animation="glow">
          <Placeholder
            xs={12}
            className="rounded-pill"
            style={{ width: "70px", height: "30px" }}
          />
        </Placeholder>
      </div>
    </Card.Body>
  </Card>
);

export const SubjectItemSkeleton: React.FC = () => (
  <Card className="border-0 shadow-sm rounded-4">
    <Card.Body className="p-4">
      <div className="d-flex align-items-start gap-3">
        <Placeholder as="div" animation="glow">
          <div
            className="bg-light rounded-3"
            style={{ width: "70px", height: "70px" }}
          ></div>
        </Placeholder>
        <div className="flex-grow-1">
          <div className="d-flex justify-content-between mb-2">
            <Placeholder
              as={Placeholder}
              animation="glow"
              className="flex-grow-1 me-3"
            >
              <Placeholder
                xs={8}
                className="rounded"
                style={{ height: "24px" }}
              />
            </Placeholder>
            <Placeholder as={Placeholder} animation="glow">
              <Placeholder
                xs={12}
                className="rounded-pill"
                style={{ width: "80px", height: "32px" }}
              />
            </Placeholder>
          </div>
          <div className="d-flex flex-wrap gap-4">
            <Placeholder as={Placeholder} animation="glow">
              <Placeholder
                xs={12}
                className="rounded"
                style={{ width: "150px", height: "20px" }}
              />
            </Placeholder>
            <Placeholder as={Placeholder} animation="glow">
              <Placeholder
                xs={12}
                className="rounded"
                style={{ width: "120px", height: "20px" }}
              />
            </Placeholder>
            <Placeholder as={Placeholder} animation="glow">
              <Placeholder
                xs={12}
                className="rounded"
                style={{ width: "120px", height: "20px" }}
              />
            </Placeholder>
            <Placeholder as={Placeholder} animation="glow">
              <Placeholder
                xs={12}
                className="rounded"
                style={{ width: "180px", height: "20px" }}
              />
            </Placeholder>
          </div>
        </div>
      </div>
    </Card.Body>
  </Card>
);

export const TeacherDashboardSkeleton: React.FC = () => (
  <Container
    fluid
    className="py-4 px-lg-4"
    style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}
  >
    <WelcomeSectionSkeleton />

    <Row className="g-4 mb-4">
      <Col xs={12} sm={6} xl={3}>
        <StatCardSkeleton />
      </Col>
      <Col xs={12} sm={6} xl={3}>
        <StatCardSkeleton />
      </Col>
    </Row>

    <div className="mb-4">
      <div className="d-flex gap-2 mb-4">
        {[1, 2, 3, 4].map((i) => (
          <Placeholder key={i} as={Placeholder} animation="glow">
            <Placeholder
              xs={12}
              className="rounded-pill"
              style={{ width: "100px", height: "35px" }}
            />
          </Placeholder>
        ))}
      </div>

      <Row className="g-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Col xs={12} key={i}>
            <SubjectItemSkeleton />
          </Col>
        ))}
      </Row>
    </div>
  </Container>
);

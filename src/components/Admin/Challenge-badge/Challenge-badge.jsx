import React from "react";

import { Button, Card, ListGroup, Badge } from 'react-bootstrap';
import { GiPresent, GiTrophyCup } from 'react-icons/gi'; 

const ChallengesSection = () => {
 return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="arabic-text">المهام اليومية</h4>
        <Button variant="purple" className="rounded-pill">
          + إضافة مهمة جديدة
        </Button>
      </div>
      <Card className="mb-3 task-card">
        <ListGroup variant="flush">
          <ListGroup.Item className="d-flex justify-content-between align-items-center task-item">
            <div className="task-info">
              <Button variant="success" size="sm" className="me-2 rounded-circle">
                ✓
              </Button>
              <span className="text-muted me-2 arabic-text">مهمة 500</span>
              <Badge bg="warning" className="ms-2">★</Badge>
            </div>
            <div className="task-actions arabic-text">
              <span className="text-success me-2">342 متابع</span>
              <GiPresent className="text-primary me-2" />
              <GiTrophyCup className="text-success me-2" />
              <span className="text-muted me-2">pg: 7 ⏳</span>
              <Button variant="outline-primary" size="sm" className="me-2 rounded-pill">
                عرض
              </Button>
              <Button variant="outline-danger" size="sm" className="me-2 rounded-pill">
                حذف
              </Button>
            </div>
          </ListGroup.Item>
          <ListGroup.Item className="d-flex justify-content-between align-items-center task-item">
            <div className="task-info">
              <Button variant="secondary" size="sm" className="me-2 rounded-circle">
                ☐
              </Button>
              <span className="text-muted me-2 arabic-text">مهمة 800</span>
              <Badge bg="warning" className="ms-2">★</Badge>
            </div>
            <div className="task-actions arabic-text">
              <span className="text-success me-2">128 متابع</span>
              <span className="text-muted me-2">20% ✓</span>
              <span className="text-muted me-2">pg: 30 ⏳</span>
              <Button variant="outline-primary" size="sm" className="me-2 rounded-pill">
                عرض
              </Button>
              <Button variant="outline-danger" size="sm" className="me-2 rounded-pill">
                حذف
              </Button>
            </div>
          </ListGroup.Item>
          <ListGroup.Item className="d-flex justify-content-between align-items-center task-item">
            <div className="task-info">
              <Button variant="success" size="sm" className="me-2 rounded-circle">
                ✓
              </Button>
              <span className="text-muted me-2 arabic-text">مهمة 300</span>
              <Badge bg="warning" className="ms-2">★</Badge>
            </div>
            <div className="task-actions arabic-text">
              <span className="text-success me-2">89 متابع</span>
              <GiPresent className="text-primary me-2" />
              <span className="text-muted me-2">pg: 14 ⏳</span>
              <Button variant="outline-primary" size="sm" className="me-2 rounded-pill">
                عرض
              </Button>
              <Button variant="outline-danger" size="sm" className="me-2 rounded-pill">
                حذف
              </Button>
            </div>
          </ListGroup.Item>
        </ListGroup>
      </Card>
      <div className="d-flex justify-content-between align-items-center">
        <h4 className="arabic-text">المهام القادمة</h4>
        <Button variant="purple" className="rounded-pill">
          + إضافة مهمة جديدة
        </Button>
      </div>
    </div>
  );
};

export default ChallengesSection;
import React from "react";
import { Container, Row, Col, Card, Image,  InputGroup,Button,Form} from 'react-bootstrap';
import "./Rename.css";
const Rename = () => {
  return (
   <Container fluid className="rename-container d-flex justify-content-center align-items-center py-4" style={{ direction: 'rtl' }}>
      {/* Profile Card */}
      <Card className="name" style={{ maxWidth: '926px', width: '95%' }}>
        <Row className="align-items-center">
          <Col xs="auto">
            <div style={{ position: 'relative', width: '60px', height: '60px' }}>
              <Image
                src="./jklj"
                roundedCircle
                width={60}
                height={60}
                style={{ objectFit: 'cover' }}
              />
              
            </div>
          </Col>

          <Col>
            <div className="fw-semibold">ساره محمود</div>
            <div className="text-muted small">sara.mahmoud@email.com</div>
          </Col>
        </Row>
      </Card>


<div className="update" >
    <div style={{width:'1200px', height:'28px',marginTop:'18px'}}>
<p className="name-update">✏️         تعديل الاسم</p>
</div>
<label className="current-name">الاسم الحالي: ساره</label>

<Form>
    <InputGroup className="mb-3">
          <Form.Control 
          className="new-name"
            type="text"
            placeholder=" أدخل الاسم الجديد"
            aria-label="Recipient's username"
            aria-describedby="basic-addon2"
          />
          <p className="show-name">الاسم سيظهر في ملفك الشخصي </p>
          <Button className="save-name">💾  حفظ التعديل</Button>
          <Button className="cancel">الغاء</Button>

        </InputGroup>
</Form>

</div>
      

      </Container>

);
};

export default Rename;
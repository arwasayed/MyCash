import React from "react";
import { Modal, Form, Button, Image } from "react-bootstrap";
import { FaGift, FaLock, FaQuestionCircle, FaUserEdit } from "react-icons/fa";
import { AiOutlineSave } from "react-icons/ai";
import './Challenge.css';

const ChallengeModal = ({ show, handleClose }) => {
  return (
    <Modal show={show} onHide={handleClose} centered size="md" className="challenge-modal">
      <Modal.Header className="challenge-header" closeButton>
        <Modal.Title className="text-white add ">
          <Image src="Admin/Frame.svg" alt="icon" className="me-2 m-2" />
          إضافة تحدي جديد
        </Modal.Title>
      </Modal.Header>

      <Modal.Body style={{padding:'30px'}}>
        <Form>
          <Form.Group className="mb-4">
            <Form.Label>
            <Image src="Admin/name.svg" alt="icon" className="me-2 m-2" />

              اسم التحدي
            </Form.Label>
            <Form.Control type="text" placeholder="ادخل اسم التحدي" className="bg-light-purple" />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>
          <Image src="Admin/des.svg" alt="icon" className="me-2 m-2" />
             <span className="title"> وصف التحدي</span>
            </Form.Label>
            <Form.Control as="textarea" rows={3} placeholder="ادخل وصف التحدي" className="bg-light-purple" />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>
          <Image src="Admin/time.svg" alt="icon" className="me-2 m-2" />
             <span className="title"> عدد أيام التحدي</span>
            </Form.Label>
            <Form.Control type="number" placeholder="ادخل عدد الأيام" className="bg-light-purple" />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>
          <Image src="Admin/mo.svg" alt="icon" className="me-2 m-2" />
           <span className="title">   المتكافأة </span>
            </Form.Label>
            <Form.Control type="text" placeholder="ادخل اسم الجائزة" className="bg-light-purple" />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>الحالة</Form.Label>
            <div className="form-switch d-flex align-items-center gap-3">
              <Form.Check type="switch" id="challenge-active" />
              <span style={{color:"#A5B1CE"}}>تفعيل التحدى </span>
            </div>
          </Form.Group>

          <div className="d-flex  mt-5 ">
            <Button variant="primary" className="save-btn">
              <AiOutlineSave className="me-1 m-2 " />
              حفظ التحدي
            </Button>
            <Button variant="secondary" onClick={handleClose} className="mx-2 close-btn">
               إلغاء<Image src="Admin/close.svg" alt="icon" className="me-2 m-2" />  
            </Button>
            
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ChallengeModal;

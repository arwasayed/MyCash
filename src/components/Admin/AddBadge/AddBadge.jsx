import React, { useState } from "react";

import { Modal, Form, Button, Image } from "react-bootstrap";
import { FaGift, FaLock, FaQuestionCircle, FaUserEdit } from "react-icons/fa";
import { AiOutlineSave } from "react-icons/ai";

const AddBadgeModel = ({ show, handleClose }) => {
  const [formData, setFormData] = useState({
  name: "",
  description: "",
  days: "",
  reward: "",
  active: true,
  challenge: "", 
});

  return (
    <Modal show={show} onHide={handleClose} centered size="md" className="challenge-modal">
      <Modal.Header className="challenge-header" closeButton>
        <Modal.Title className="text-white add ">
          <Image src="Admin/Frame.svg" alt="icon" className="me-2 m-2" />
        إضافة شاره جديده
        </Modal.Title>
      </Modal.Header>

      <Modal.Body style={{padding:'30px'}}>
        <Form>
          <Form.Group className="mb-4">
            <Form.Label>
            <Image src="Admin/badge.svg" alt="icon" className="me-2 m-2" />

              اسم الشارة
            </Form.Label>
            <Form.Control type="text" placeholder="ادخل اسم الشارة" className="bg-light-purple" />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>
          <Image src="Admin/des.svg" alt="icon" className="me-2 m-2" />
             <span className="title"> وصف الشارة</span>
            </Form.Label>
            <Form.Control as="textarea" rows={3} placeholder="ادخل وصف الشارة" className="bg-light-purple" />
          </Form.Group>

      <Form.Group className="mb-4 position-relative">
  <Form.Label>
    <Image src="Admin/name.svg" alt="icon" className="me-2 m-2" />
    <span className="title">التحدي</span>
  </Form.Label>
  <Form.Select className="custom-dropdown bg-light-purple"   
  name="challenge"
  value={formData.challenge || ""}
>
    <option value="" disabled className="placeholder-option">اختر التحدي</option>
    <option value="challenge1">تحدي 1</option>
    <option value="challenge2">تحدي 2</option>
    <option value="challenge3">تحدي 3</option>
  </Form.Select>
</Form.Group>


          <Form.Group className="mb-4">
            <Form.Label>
          <Image src="Admin/img.svg" alt="icon" className="me-2 m-2" />
           <span className="title">   عنوان الصورة </span>
            </Form.Label>
            <Form.Control type="text" placeholder="ادخل عنوان الصورة " className="bg-light-purple" />
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

export default AddBadgeModel;

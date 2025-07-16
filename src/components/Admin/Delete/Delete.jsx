import React from "react";
import { Button, Modal, Row, Col } from "react-bootstrap";
import { ExclamationTriangleFill, TrashFill, X } from "react-bootstrap-icons";
import './Delete.css'
const DeleteConfirmModal = ({ show, onCancel, onConfirm }) => {
  return (
    <Modal
      show={show}
      onHide={onCancel}
      centered
      backdrop="static"
      keyboard={false}
      contentClassName="rounded-4 shadow Delete-model"
    >
      <Modal.Body className="text-center Delete-body" >
        <Modal.Title className="mb-3 Delet-title" >
          هل أنت متأكد من الحذف؟
        </Modal.Title>
        <p className="mb-4 Delet-subtitle" >
          هل أنت متأكد من الرغبة في حذف ؟ لا يمكن التراجع عن هذا الإجراء.
        </p>
        <div
          className="mx-auto mb-4"
          style={{
            width: "96px",
            height: "96px",
            borderRadius: "50%",
            backgroundColor: "#FEE2E2",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "#842029",
            marginBottom: "30px",
          }}
        >
          <ExclamationTriangleFill size={32} color="#EF4444"  />
        </div>

        <Row className="btns">
               <Col>
            <Button
              variant="danger"
              className=" d-flex justify-content-center align-items-center yes-btn"
              onClick={onConfirm}
            >
                 <TrashFill className="ms-2" />
              نعم، احذف
             
            </Button>
          </Col>
          <Col>
            <Button
              variant="secondary"
              className=" d-flex justify-content-center align-items-center no-btn"
              onClick={onCancel}
            >
              <X className="me-2" size={20}/>
              إلغاء
            </Button>
          </Col>
       
        </Row>
      </Modal.Body>
    </Modal>
  );
};

export default DeleteConfirmModal;

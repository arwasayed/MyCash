import React, { useState } from "react";
import { Modal, Form, Button, Image } from "react-bootstrap";
import { AiOutlineSave } from "react-icons/ai";
import axios from "axios";
import './Challenge.css';

const ChallengeModal = ({ show, handleClose }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    durationDays: 7,
    rewardXP: 100,
    isActive: true,
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        '/api/challenges/',
        {
          title: formData.title,
          description: formData.description,
          durationDays: Number(formData.durationDays),
          rewardXP: Number(formData.rewardXP),
          isActive: formData.isActive,
        },
        {
          headers: {
  Authorization: localStorage.getItem("token"),
},

        }
      );
      setSuccess("تم إنشاء التحدي بنجاح!");
      setError(null);
      setFormData({
        title: "",
        description: "",
        durationDays: 7,
        rewardXP: 100,
        isActive: true,
      });
      setTimeout(() => {
        handleClose();
        setSuccess(null);
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "حدث خطأ أثناء إنشاء التحدي");
      setSuccess(null);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered size="md" className="challenge-modal">
      <Modal.Header className="challenge-header" closeButton>
        <Modal.Title className="text-white add">
          <Image src="Admin/Frame.svg" alt="icon" className="me-2 m-2" />
          إضافة تحدي جديد
        </Modal.Title>
      </Modal.Header>

      <Modal.Body style={{ padding: '30px' }}>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-4">
            <Form.Label>
              <Image src="Admin/name.svg" alt="icon" className="me-2 m-2" />
              اسم التحدي
            </Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="ادخل اسم التحدي"
              className="bg-light-purple"
              required
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>
              <Image src="Admin/des.svg" alt="icon" className="me-2 m-2" />
              <span className="title"> وصف التحدي</span>
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="ادخل وصف التحدي"
              className="bg-light-purple"
              required
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>
              <Image src="Admin/time.svg" alt="icon" className="me-2 m-2" />
              <span className="title"> عدد أيام التحدي</span>
            </Form.Label>
            <Form.Control
              type="number"
              name="durationDays"
              value={formData.durationDays}
              onChange={handleChange}
              placeholder="ادخل عدد الأيام"
              className="bg-light-purple"
              min="1"
              required
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>
              <Image src="Admin/mo.svg" alt="icon" className="me-2 m-2" />
              <span className="title"> المكافأة </span>
            </Form.Label>
            <Form.Control
              type="number"
              name="rewardXP"
              value={formData.rewardXP}
              onChange={handleChange}
              placeholder="ادخل قيمة المكافأة (XP)"
              className="bg-light-purple"
              min="0"
              required
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>الحالة</Form.Label>
            <div className="form-switch d-flex align-items-center gap-3">
              <Form.Check
                type="switch"
                id="challenge-active"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
              />
              <span style={{ color: "#A5B1CE" }}>تفعيل التحدي</span>
            </div>
          </Form.Group>

          {error && <div className="text-danger mb-3">{error}</div>}
          {success && <div className="text-success mb-3">{success}</div>}

          <div className="d-flex mt-5">
            <Button variant="primary" type="submit" className="save-btn">
              <AiOutlineSave className="me-1 m-2" />
              حفظ التحدي
            </Button>
            <Button variant="secondary" onClick={handleClose} className="mx-2 close-btn">
              إلغاء
              <Image src="Admin/close.svg" alt="icon" className="me-2 m-2" />
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ChallengeModal;
import React, { useState, useEffect } from "react";
import { Modal, Form, Button, Image } from "react-bootstrap";
import { AiOutlineSave } from "react-icons/ai";
import axios from "axios";

const UpdateChallengeModal = ({ show, handleClose, onUpdate, challenge }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    durationDays: 7,
    rewardXP: 100,
    isActive: true,
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (challenge) {
      setFormData({
        title: challenge.title || "",
        description: challenge.description || "",
        durationDays: challenge.durationDays || 7,
        rewardXP: challenge.rewardXP || 100,
        isActive: challenge.isActive !== undefined ? challenge.isActive : true,
      });
    }
  }, [challenge, show]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : type === "number" ? Number(value) : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      setError("برجاء تسجيل الدخول كـ admin أولاً");
      return;
    }
    if (!challenge?._id) {
      setError("لا يوجد تحدي محدد للتعديل");
      return;
    }
    setIsLoading(true);
    try {
      const response = await axios.put(
        `http://localhost:3000/api/challenges/${challenge._id}`,
        {
          title: formData.title,
          description: formData.description,
          durationDays: formData.durationDays,
          rewardXP: formData.rewardXP,
          isActive: formData.isActive,
        },
        { headers: { Authorization: token } }
      );
      console.log("API Response:", response.data); // للتحقق من الاستجابة
      setSuccess("تم تحديث التحدي بنجاح!");
      setError(null);
      // تمرير البيانات المحدثة إلى المكون الأب
      onUpdate(challenge._id, {
        ...formData,
        _id: challenge._id,
      });
      setTimeout(() => {
        handleClose();
        setSuccess(null);
      }, 1000);
    } catch (err) {
      console.error("خطأ في طلب PUT:", err.response?.data || err.message);
      setError(err.response?.data?.message || "حدث خطأ أثناء تحديث التحدي");
      setSuccess(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered size="md" className="challenge-modal">
      <Modal.Header className="challenge-header" closeButton>
        <Modal.Title className="text-white add">
          <Image src="Admin/Frame.svg" alt="icon" className="me-2 m-2" />
          تعديل التحدي
        </Modal.Title>
      </Modal.Header>

      <Modal.Body style={{ padding: "30px" }}>
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
              disabled={isLoading}
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
              disabled={isLoading}
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
              disabled={isLoading}
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
              disabled={isLoading}
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
                disabled={isLoading}
              />
              <span style={{ color: "#A5B1CE" }}>
                {formData.isActive ? "إلغاء تفعيل التحدي" : "تفعيل التحدي"}
              </span>
            </div>
          </Form.Group>

          {error && <div className="text-danger mb-3">{error}</div>}
          {success && <div className="text-success mb-3">{success}</div>}

          <div className="d-flex mt-5">
            <Button
              variant="primary"
              type="submit"
              className="save-btn"
              disabled={isLoading}
            >
              <AiOutlineSave className="me-1 m-2" />
              {isLoading ? "جاري التحميل..." : "حفظ التحدي"}
            </Button>
            <Button
              variant="secondary"
              onClick={handleClose}
              className="mx-2 close-btn"
              disabled={isLoading}
            >
              إلغاء
              <Image src="Admin/close.svg" alt="icon" className="me-2 m-2" />
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default UpdateChallengeModal;
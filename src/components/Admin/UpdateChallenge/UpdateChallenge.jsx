import React, { useState, useEffect } from "react";
import { Modal, Form, Button, Image } from "react-bootstrap";
import { FaGift, FaLock, FaQuestionCircle, FaUserEdit } from "react-icons/fa";
import { AiOutlineSave } from "react-icons/ai";
import axios from "axios";

const UpdateChallengeModal = ({ show, handleClose }) => {
  const [challenges, setChallenges] = useState([]);
  const [selectedChallengeId, setSelectedChallengeId] = useState("");
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

  // جلب التحديات من الـ API
  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("برجاء تسجيل الدخول كـ admin أولاً");
          return;
        }
        const response = await axios.get("/api/challenges", {
          headers: {
            Authorization: token,
          },
        });
        setChallenges(response.data.data);
      } catch (err) {
        setError(err.response?.data?.message || "حدث خطأ أثناء جلب التحديات");
      }
    };
    if (show) {
      fetchChallenges();
    }
  }, [show]);

  // ملء الفورم ببيانات التحدي المختار
  const handleChallengeSelect = (e) => {
    const challengeId = e.target.value;
    setSelectedChallengeId(challengeId);
    const selectedChallenge = challenges.find(
      (challenge) => challenge._id === challengeId
    );
    if (selectedChallenge) {
      setFormData({
        title: selectedChallenge.title,
        description: selectedChallenge.description,
        durationDays: selectedChallenge.durationDays || 7,
        rewardXP: selectedChallenge.rewardXP || 100,
        isActive: selectedChallenge.isActive,
      });
    } else {
      setFormData({
        title: "",
        description: "",
        durationDays: 7,
        rewardXP: 100,
        isActive: true,
      });
    }
  };

const handleChange = (e) => {
  const { name, value, type, checked } = e.target;
  setFormData({
    ...formData,
    [name]: type === "checkbox" ? checked : value,
  });
};
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedChallengeId) {
      setError("من فضلك اختاري تحدي لتعديله");
      return;
    }
    const token = localStorage.getItem("token");
    if (!token) {
      setError("برجاء تسجيل الدخول كـ admin أولاً");
      return;
    }
    setIsLoading(true);
    try {
      const response = await axios.put(
        `/api/challenges/${selectedChallengeId}`,
        {
          title: formData.title,
          description: formData.description,
          durationDays: Number(formData.durationDays),
          rewardXP: Number(formData.rewardXP),
          isActive: formData.isActive,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setSuccess("تم تحديث التحدي بنجاح!");
      setError(null);
      setFormData({
        title: "",
        description: "",
        durationDays: 7,
        rewardXP: 100,
        isActive: true,
      });
      setSelectedChallengeId("");
      setTimeout(() => {
        handleClose();
        setSuccess(null);
      }, 2000);
    } catch (err) {
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

      <Modal.Body style={{ padding: '30px' }}>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-4">
            <Form.Label>
              <Image src="Admin/name.svg" alt="icon" className="me-2 m-2" />
              اختر التحدي
            </Form.Label>
            <Form.Select
              value={selectedChallengeId}
              onChange={handleChallengeSelect}
              className="bg-light-purple"
              disabled={isLoading}
            >
              <option value="">اختر تحدي...</option>
              {challenges.map((challenge) => (
                <option key={challenge._id} value={challenge._id}>
                  {challenge.title}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

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
              <Image src="Admin/time.svg" alt="icon" className="me-2m-2" />
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
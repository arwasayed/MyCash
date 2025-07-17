import React, { useState, useEffect } from "react";
import { Modal, Form, Button, Image } from "react-bootstrap";
import { AiOutlineSave } from "react-icons/ai";
import axios from "axios";

const UpdateBadgeModel = ({ show, handleClose }) => {
  const [badges, setBadges] = useState([]);
  const [selectedBadgeId, setSelectedBadgeId] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    challengeId: "",
  });
  const [file, setFile] = useState(null); 
  const [imagePreview, setImagePreview] = useState(null); 
  const [challenges, setChallenges] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("برجاء تسجيل الدخول كـ admin أولاً");
          return;
        }
        const challengesResponse = await axios.get("http://localhost:3000/api/challenges", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setChallenges(challengesResponse.data.data || []);

        const badgesResponse = await axios.get("http://localhost:3000/api/badges", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBadges(badgesResponse.data.data || []);
      } catch (err) {
        setError(err.response?.data?.message || "حدث خطأ أثناء جلب البيانات");
      }
    };
    if (show) {
      fetchData();
    }
  }, [show]);

  const handleBadgeSelect = (e) => {
    const badgeId = e.target.value;
    setSelectedBadgeId(badgeId);
    const selectedBadge = badges.find((badge) => badge._id === badgeId);
    if (selectedBadge) {
      setFormData({
        title: selectedBadge.title || "",
        description: selectedBadge.description || "",
        challengeId: selectedBadge.challengeId || "",
      });
      setImagePreview(selectedBadge.iconUrl || null);
      setFile(null);
    } else {
      setFormData({
        title: "",
        description: "",
        challengeId: "",
        isActive: true,
      });
      setImagePreview(null);
      setFile(null);
    }
    setError(null);
    setSuccess(null);
  };

  // تحديث بيانات الفورم
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (!selectedFile.type.startsWith("image/")) {
        setError("برجاء اختيار ملف صورة (PNG، JPG، JPEG)");
        setFile(null);
        setImagePreview(null);
        return;
      }
      setFile(selectedFile);
      setImagePreview(URL.createObjectURL(selectedFile));
      setError(null);
    } else {
      setFile(null);
      setImagePreview(null);
    }
  };
  const uploadImage = async (file) => {
    const token = localStorage.getItem("token");
    const data = new FormData();
    data.append("file", file);

    const res = await axios.post("http://localhost:3000/api/upload", data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data.url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedBadgeId) {
      setError("من فضلك اختاري شارة لتعديلها");
      return;
    }
    if (!formData.title.trim()) {
      setError("برجاء إدخال اسم الشارة");
      return;
    }
    if (!formData.description.trim()) {
      setError("برجاء إدخال وصف الشارة");
      return;
    }
    if (!formData.challengeId) {
      setError("برجاء اختيار تحدي صالح");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setError("برجاء تسجيل الدخول كـ admin أولاً");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      let iconUrl = imagePreview;
      if (file) {
        iconUrl = await uploadImage(file);
      }

    const payload = {
  title: formData.title.trim(),
  description: formData.description.trim(),
  iconUrl,
};

if (formData.challengeId && formData.challengeId.trim() !== "") {
  payload.challengeId = formData.challengeId;
}


      await axios.put(`http://localhost:3000/api/badges/${selectedBadgeId}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSuccess("تم تحديث الشارة بنجاح!");
      setFormData({
        title: "",
        description: "",
        challengeId: "",
        isActive: true,
      });
      setFile(null);
      setImagePreview(null);
      setSelectedBadgeId("");
      setTimeout(() => {
        handleClose();
        setSuccess(null);
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "حدث خطأ أثناء تحديث الشارة");
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
          تعديل الشارة
        </Modal.Title>
      </Modal.Header>

      <Modal.Body style={{ padding: "30px" }}>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-4">
            <Form.Label>
              <Image src="Admin/badge.svg" alt="icon" className="me-2 m-2" />
              اختر الشارة
            </Form.Label>
            <Form.Select
              value={selectedBadgeId}
              onChange={handleBadgeSelect}
              className="bg-light-purple"
              disabled={isLoading}
            >
              <option value="">اختر شارة...</option>
              {badges.map((badge) => (
                <option key={badge._id} value={badge._id}>
                  {badge.title}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>
              <Image src="Admin/badge.svg" alt="icon" className="me-2 m-2" />
              اسم الشارة
            </Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="ادخل اسم الشارة"
              className="bg-light-purple"
              required
              disabled={isLoading}
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>
              <Image src="Admin/des.svg" alt="icon" className="me-2 m-2" />
              وصف الشارة
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="ادخل وصف الشارة"
              className="bg-light-purple"
              required
              disabled={isLoading}
            />
          </Form.Group>

          <Form.Group className="mb-4 position-relative">
            <Form.Label>
              <Image src="Admin/name.svg" alt="icon" className="me-2 m-2" />
              التحدي
            </Form.Label>
            <Form.Select
              name="challengeId"
              value={formData.challengeId}
              onChange={handleChange}
              className="custom-dropdown bg-light-purple"
              disabled={isLoading}
            >
              <option value="">اختر التحدي (اختياري)</option>
              {challenges.map((challenge) => (
                <option key={challenge._id} value={challenge._id}>
                  {challenge.title}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>
              <Image src="Admin/img.svg" alt="icon" className="me-2 m-2" />
              صورة الشارة
            </Form.Label>
            <Form.Control
              type="file"
              name="icon"
              accept="image/png,image/jpeg,image/jpg"
              onChange={handleFileChange}
              className="bg-light-purple"
              disabled={isLoading}
            />
            {imagePreview && (
              <div className="mt-2">
                <Image
                  src={imagePreview}
                  alt="معاينة الصورة"
                  style={{ maxWidth: "100px", maxHeight: "100px" }}
                  onError={() => setImagePreview(null)}
                />
              </div>
            )}
          </Form.Group>


          {error && <div className="text-danger mb-3">{error}</div>}
          {success && <div className="text-success mb-3">{success}</div>}

          <div className="d-flex mt-5">
            <Button variant="primary" type="submit" disabled={isLoading}>
              <AiOutlineSave className="me-1 m-2" />
              {isLoading ? "جاري التحميل..." : "حفظ الشارة"}
            </Button>
            <Button
              variant="secondary"
              onClick={handleClose}
              className="mx-2"
              disabled={isLoading}
            >
              إلغاء
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default UpdateBadgeModel;

import React, { useState, useEffect } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import ChallengeModal from "../Challenge/Challenge";
import UpdateChallengeModal from "../UpdateChallenge/UpdateChallenge";
import DeleteConfirmModal from "../Delete/Delete";
import AddBadgeModel from "../AddBadge/AddBadge";
import UpdateBadgeModel from "../UpdateBadge/UpdateBadge";
import axios from "axios";

const svgIcon = (name) => `/Admin UI/${name}`;


// ChallengeCard component
function ChallengeCard({ challenge, onDelete , onUpdate}) {
  console.log("ChallengeCard props.challenge:", challenge);


  const [updateChallengModel, setUpdateChallengModel] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const openDeleteModal = (target) => {
    setDeleteTarget(target);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setDeleteTarget(null);
  };

  

  const handleDeleteConfirm = async () => {
    if (deleteTarget === "challenge") {
      try {
        const response = await axios.delete(`/api/challenges/${challenge._id}`, {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        });
        console.log("API Response:", response.data);
        onDelete(challenge._id); // إعلام المكون الأب بحذف التحدي
      } catch (err) {
        console.error("خطأ:", err.message);
      }
    }
    closeDeleteModal();
  };

  const handleUpdate = (updatedData) => {
     console.log("ChallengeCard handleUpdate called with:", updatedData);
    onUpdate(challenge._id, updatedData);
    setUpdateChallengModel(false);
  };

  return (
    <div
      className="challenge-card-responsive"
      style={{
        background: "#fff",
        borderRadius: 18,
        boxShadow: "0 2px 12px 0 rgba(16,30,54,0.06)",
        padding: "2.2rem 2.5rem 1.2rem 2.5rem",
        margin: "0 auto 2rem auto",
        maxWidth: 1400,
        minWidth: 320,
        minHeight: 120,
        width: "100%",
        fontFamily: "Tajawal, 'Cairo', 'Noto Kufi Arabic', Arial, sans-serif",
        position: "relative",
      }}
    >
      <div className="d-flex flex-row-reverse justify-content-between align-items-start flex-wrap mb-3">
        {challenge.isActive && (
          <span
            className="badge d-flex align-items-center"
            style={{
              background: "#6ee7b7",
              color: "#047857",
              fontWeight: 600,
              fontSize: "1rem",
              borderRadius: "1.5rem",
              padding: "0.5rem 1.2rem",
              marginTop: "0.5rem",
              minWidth: 70,
              justifyContent: "center",
            }}
          >
            <img
              src={svgIcon("svg(8).svg")}
              alt="check"
              style={{ width: 18, marginRight: 6 }}
            />
            نشط
          </span>
        )}
        <div className="text-end" style={{ minWidth: 220, maxWidth: 320 }}>
          <div style={{ fontWeight: 700, fontSize: 20, color: "#23262f" }}>
            {challenge.title}
          </div>
          <div style={{ color: "#888", fontSize: 15, marginTop: 4 }}>
            {challenge.description}
          </div>
        </div>
      </div>

      <div
        className="d-flex flex-row-reverse align-items-center justify-content-between flex-wrap mb-2 gap-2"
        style={{ width: "100%" }}
      >
        <div
          className="d-flex align-items-center gap-1"
          style={{ minWidth: 100 }}
        >
          <span className="text-secondary" style={{ fontSize: "1rem" }}>
            {challenge.rewardXP} نقطة
          </span>
          <img
            src={svgIcon("Vector(13).svg")}
            alt="star"
            style={{ width: 22, height: 22, marginLeft: 5 }}
          />
        </div>

        <div
          className="d-flex align-items-center gap-1"
          style={{ minWidth: 90 }}
        >
          <span className="text-secondary" style={{ fontSize: "1rem" }}>
            {challenge.durationDays} أيام
          </span>
          <img
            src={svgIcon("Vector(16).svg")}
            alt="calendar"
            style={{ width: 22, height: 22, marginLeft: 5 }}
          />
        </div>

        <div
          className="d-flex align-items-center justify-content-center"
          style={{ minWidth: 60 }}
        >
          <span
            style={{
              background: "#DCFCE7",
              borderRadius: "25%",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 40,
              height: 40,
            }}
          >
            <img
              src={svgIcon("Vector(17).svg")}
              alt="trophy"
              style={{ width: 24, height: 24 }}
            />
          </span>
        </div>
      </div>

      <div
        className="d-flex flex-row-reverse gap-2 mt-3"
        style={{ justifyContent: "flex-end" }}
      >
        <Button
          variant="danger"
          onClick={() => openDeleteModal("challenge")}
          style={{
            minWidth: 70,
            fontWeight: 500,
            fontSize: 16,
            borderRadius: 12,
            background: "#DC262647",
            color: "#DC2626",
            border: "none",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <img
            src={svgIcon("Vector(21).svg")}
            alt="edit"
            style={{ width: 18, marginLeft: 6 }}
          />
          حذف
        </Button>
        <Button
          variant="primary"
          onClick={() => setUpdateChallengModel(true)}
          style={{
            minWidth: 80,
            fontWeight: 500,
            fontSize: 16,
            borderRadius: 12,
            background: "#2563eb",
            border: "none",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <img
            src={svgIcon("Vector(20).svg")}
            alt="edit"
            style={{ width: 18, marginLeft: 6 }}
          />
          تعديل
        </Button>
      </div>

      <UpdateChallengeModal
        show={updateChallengModel}
        handleClose={() => setUpdateChallengModel(false)}
        challenge={challenge}
        onUpdate={handleUpdate}
      />

      <DeleteConfirmModal
        show={showDeleteModal}
        onCancel={closeDeleteModal}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}

// BadgeCard component
function BadgeCard({ badge, idx, onDelete,onUpdate }) {
  const [UpdateBadge, setUpdateBadgeModel] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const openDeleteModal = (target) => {
    setDeleteTarget(target);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setDeleteTarget(null);
  };


const handleDeleteConfirm = async () => {
    if (deleteTarget === "badge") {
      try {
        const response = await axios.delete(`/api/badges/${badge._id}`, {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        });
        console.log("API Response:", response.data);
        onDelete(badge._id);// إعلام المكون الأب بحذف التحدي
      } catch (err) {
        console.error("خطأ:", err.message);
      }
    }
    closeDeleteModal();
  };

  const handleUpdate = (updatedData) => {
    onUpdate(badge._id, updatedData);
    setUpdateBadgeModel(false);
  };

  let bg;
  if (idx === 0) {
    bg = "linear-gradient(135deg, #FACC15 0%, #EAB308 100%)";
  } else if (idx === 1) {
    bg = "linear-gradient(135deg, #C084FC 0%, #A855F7 100%)";
  } else if (idx === 2) {
    bg = "linear-gradient(135deg, #4ADE80 0%, #22C55E 100%)";
  } else {
    bg = badge.color || "#A259FF";
  }

  return (
    <div
      className="shadow-sm p-4"
      style={{
        borderRadius: 20,
        background: "#fff",
        minWidth: 220,
        maxWidth: 300,
        margin: "auto",
        textAlign: "center",
        fontFamily: "Tajawal, 'Cairo', 'Noto Kufi Arabic', Arial, sans-serif",
      }}
    >
      <div
        style={{
          background: bg,
          borderRadius: "50%",
          width: 56,
          height: 56,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "auto",
          marginBottom: 12,
        }}
      >
        {badge.iconUrl ? (
          <img
            src={badge.iconUrl}
            alt="badge"
            style={{ width: 54, height: 54, borderRadius: "50%" }}
          />
        ) : (
          <span style={{ color: "white", fontSize: 20 }}>🏆</span>
        )}
      </div>

      <div style={{ fontWeight: 700, fontSize: 18, color: "#23262f" }}>
        {badge.title}
      </div>
      <div style={{ color: "#888", fontSize: 15, margin: "6px 0 16px 0" }}>
        {badge.description}
      </div>

      <div className="d-flex justify-content-between gap-2 mt-2">
        <Button
          variant="primary"
          onClick={() => setUpdateBadgeModel(true)}
          style={{
            fontWeight: 500,
            fontSize: 15,
            borderRadius: 12,
            background: "#3B82F6",
            border: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
          }}
        >
          تعديل
        </Button>
        <Button
          variant="danger"
          onClick={() => openDeleteModal("badge")}
          style={{
            background: "#DC262647",
            color: "#DC2626",
            border: "none",
            minWidth: 30,
            fontWeight: 500,
            fontSize: 15,
            borderRadius: 12,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
          }}
        >
          <img
            src={svgIcon("Vector(21).svg")}
            alt="trash"
            style={{ width: 18, marginLeft: 6 }}
          />
        </Button>
      </div>

      <UpdateBadgeModel
        show={UpdateBadge}
        handleClose={() => setUpdateBadgeModel(false)}
        badge={badge}
        onUpdate={handleUpdate}
      />

      <DeleteConfirmModal
        show={showDeleteModal}
        onCancel={closeDeleteModal}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}

const ManageChallenge = () => {
  const [challenges, setChallenges] = useState([]);
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showChallengeModal, setShowChallengeModal] = useState(false);
  const [showBadgeModal, setShowBadgeModal] = useState(false);

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  // const apiRequest = async (url, method = "GET", body = null) => {
  //   const token = localStorage.getItem("token");
  //   const headers = {
  //     Authorization: token,
  //     "Content-Type": "application/json",
  //   };

  //   const config = {
  //     method,
  //     headers,
  //   };

  //   if (body) {
  //     config.body = JSON.stringify(body);
  //   }

  //   const response = await fetch(url, config);

  //   if (response.status === 401) {
  //     handleLogout();
  //     return null;
  //   }

  //   return response;
  // };

 const fetchChallenges = async () => {
    try {
      const response = await axios.get("/api/challenges", {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      setChallenges(response.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "فشل في جلب بيانات التحديات");
    }
  };
const fetchBadges = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      handleLogout();
      return;
    }
    const response = await axios.get("http://localhost:3000/api/badges", {
      headers: {
        Authorization: token,
      },
    });
    console.log("Badges API Response:", response.data); // للتحقق من الاستجابة
    setBadges(response.data.data || response.data || []); // دعم بنية استجابة مختلفة
    setError(null); // إعادة تعيين الخطأ عند النجاح
  } catch (err) {
    console.error("Error fetching badges:", err);
    let errorMessage = "فشل في جلب بيانات الشارات";
    if (err.response) {
      if (err.response.status === 401) {
        handleLogout();
        errorMessage = "جلسة منتهية، يرجى تسجيل الدخول مرة أخرى";
      } else if (err.response.status === 404) {
        errorMessage = "مسار الشارات غير موجود";
      } else {
        errorMessage = err.response.data?.message || errorMessage;
      }
    } else if (err.request) {
      errorMessage = "فشل الاتصال بالخادم، تحقق من تشغيل الخادم على http://localhost:3000";
    }
    setError(errorMessage);
  }
};

  const handleAddChallenge = async (newChallenge) => {
  try {
  
      await fetchChallenges(); // إعادة جلب التحديات من الخادم
      setShowChallengeModal(false);

  } catch (err) {
    console.error("خطأ:", err.message);
  }
};

const handleAddBadge = async (newBadge) => {
  try {
  
    console.log("Adding new badge:", newBadge);
      await fetchBadges(); // إعادة جلب الشارات من الخادم
      setShowBadgeModal(false);
 
  } catch (err) {
    console.error("خطأ:", err.message);
  }
};


const handleUpdateChallenge = (challengeId, updatedChallenge) => {
  console.log('🔄 Updating challenge in state:', challengeId, updatedChallenge);

  setChallenges(prev =>
    prev.map(ch => (ch._id === challengeId ? { ...ch, ...updatedChallenge } : ch))
  );
  fetchChallenges();
};


const handleUpdateBadge = (badgeId, updatedData) => {
  console.log("Updating badge:", badgeId, updatedData);
  setBadges(
    badges.map((badge) =>
      badge._id === badgeId ? { ...badge, ...updatedData } : badge
    )
  );
   fetchBadges();
};

  const handleDeleteChallenge = (challengeId) => {
    setChallenges(challenges.filter((challenge) => challenge._id !== challengeId));
  };

  const handleDeleteBadge = (badgeId) => {
    setBadges(badges.filter((badge) => badge._id !== badgeId));
  };

  const openChallengeForm = (challenge = null) => {
    setShowChallengeModal(true);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      handleLogout();
      return;
    }

    const loadData = async () => {
      setLoading(true);
      try {
        await Promise.all([fetchChallenges(), fetchBadges()]);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div
        style={{
          background: "#fafbfc",
          minHeight: "100vh",
          direction: "rtl",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div>جاري التحميل...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          background: "#fafbfc",
          minHeight: "100vh",
          direction: "rtl",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "red",
        }}
      >
        <div>{error}</div>
      </div>
    );
  }

  return (
    <div
      style={{ background: "#fafbfc", minHeight: "100vh", direction: "rtl" }}
    >
      <div className="py-5">
        <div
          className="d-flex flex-row-reverse align-items-center mb-5"
          style={{ justifyContent: "space-between" }}
        >
          <Button
            onClick={() => setShowChallengeModal(true)}
            style={{
              background: "#A259FF",
              border: "none",
              borderRadius: 18,
              fontWeight: 500,
              fontSize: "1.1rem",
              padding: "0.7rem 2.2rem",
              minWidth: 200,
              boxShadow: "0 4px 16px #a259ff33",
            }}
            className="d-flex align-items-center gap-2"
          >
            <span style={{ fontSize: "1.5rem", marginLeft: 8 }}>+</span>
            إضافة تحدي جديد
          </Button>
          <div className="text-end">
            <h2 style={{ fontWeight: 700 }}>إدارة التحديات</h2>
            <div style={{ color: "#888", fontSize: "1.1rem", marginTop: 8 }}>
              أنشئ وأدر التحديات لتحفيز المستخدمين
            </div>
          </div>
        </div>

        {challenges.length > 0 ? (
          challenges.map((challenge) => (
            <ChallengeCard
              key={challenge._id}
              challenge={challenge}
  onDelete={handleDeleteChallenge}
onUpdate={handleUpdateChallenge}

            />
          ))
        ) : (
          <div style={{ textAlign: "center", padding: "2rem", color: "#888" }}>
            لا توجد تحديات متاحة حالياً
          </div>
        )}
      </div>

      <div className="mt-5">
        <div
          className="d-flex flex-row-reverse align-items-center mb-4"
          style={{ justifyContent: "space-between" }}
        >
          <Button
            onClick={() => setShowBadgeModal(true)}
            style={{
              background: "#A259FF",
              border: "none",
              borderRadius: 18,
              fontWeight: 500,
              fontSize: "1.1rem",
              padding: "0.7rem 2.2rem",
              minWidth: 200,
              boxShadow: "0 4px 16px #a259ff33",
            }}
            className="d-flex align-items-center gap-2"
          >
            <span style={{ fontSize: "1.5rem", marginLeft: 8 }}>+</span>
            إضافة شارة جديد
          </Button>
          <div className="text-end">
            <h2 style={{ fontWeight: 700 }}>إدارة الشارات</h2>
            <div style={{ color: "#888", fontSize: "1.1rem", marginTop: 8 }}>
              أنشئ وأدر الشارات والمكافآت
            </div>
          </div>
        </div>

        <div className="row g-4">
          {badges.length > 0 ? (
            badges.map((badge, idx) => (
              <div className="col-12 col-md-6 col-lg-4" key={badge._id}>
                <BadgeCard
                 badge={badge}
  idx={idx}
  onDelete={handleDeleteBadge}
onUpdate={handleUpdateBadge}
                />
              </div>
            ))
          ) : (
            <div
              style={{
                textAlign: "center",
                padding: "2rem",
                color: "#888",
                width: "100%",
              }}
            >
              لا توجد شارات متاحة حالياً
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .challenge-card-responsive { padding: 1.2rem 0.7rem !important; }
        }
        @media (max-width: 700px) {
          .challenge-card-responsive { flex-direction: column !important; gap: 1.2rem !important; min-width: 0 !important; }
        }
      `}</style>

      <ChallengeModal
        show={showChallengeModal}
        handleClose={() => setShowChallengeModal(false)}
        onAdd={handleAddChallenge}
      />

      <AddBadgeModel
        show={showBadgeModal}
        handleClose={() => setShowBadgeModal(false)}
        onAdd={handleAddBadge}
      />
    </div>
  );
};

export default ManageChallenge;
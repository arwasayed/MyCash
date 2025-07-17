/**
 * تم تعديل الكارت ليطابق التصميم المطلوب بدقة مع استخدام SVGs المرفقة وBootstrap وCSS حديث وRTL
 */
import React from "react";
import { Button } from "react-bootstrap";

const svgIcon = (name) => `/Admin UI/${name}`;

const mockChallenges = [
  {
    _id: "1",
    title: "تحدي الادخار اليومي",
    description: "ادخر مبلغ صغير يومياً لمدة أسبوع كامل",
    rewardXP: 500,
    isActive: true,
    users: 342,
    badge: "شارة ذهبية",
    days: 7,
  },
];

// بيانات الشارات
const mockBadges = [
  {
    _id: "b1",
    title: "شارة الملك",
    description: "للمستخدمين الذين يدخرون بنظام",
    color: "#22C55E",
    icon: "Vector(22).svg",
    badgeType: "ذهبي",
    level: "عاليه",
    points: 1000,
    users: 45,
  },
  {
    _id: "b2",
    title: "شارة الملك",
    description: "للمستخدمين الذين يدخرون بنظام",
    color: "#A259FF",
    icon: "Vector(23).svg",
    badgeType: "فضي",
    level: "عاليه",
    points: 1000,
    users: 45,
  },
  {
    _id: "b3",
    title: "شارة الملك",
    description: "للمستخدمين الذين يدخرون بنظام",
    color: "#EAB308",
    icon: "Vector(24).svg",
    badgeType: "ذهبي",
    level: "عاليه",
    points: 1000,
    users: 45,
  },
];

function BadgeCard({ badge, idx }) {
  let bg;
  if (idx === 0) {
    bg = "linear-gradient(135deg, #FACC15 0%, #EAB308 100%)";
  } else if (idx === 1) {
    bg = "linear-gradient(135deg, #C084FC 0%, #A855F7 100%)";
  } else if (idx === 2) {
    bg = "linear-gradient(135deg, #4ADE80 0%, #22C55E 100%)";
  } else {
    bg = badge.color;
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
      {/* أيقونة الشارة */}
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
        <img
          src={svgIcon(badge.icon)}
          alt="badge"
          style={{ width: 32, height: 32 }}
        />
      </div>
      {/* العنوان والوصف */}
      <div style={{ fontWeight: 700, fontSize: 18, color: "#23262f" }}>
        {badge.title}
      </div>
      <div style={{ color: "#888", fontSize: 15, margin: "6px 0 16px 0" }}>
        {badge.description}
      </div>
      {/* صف المعلومات */}
      <div
        className="d-flex justify-content-between align-items-start mb-3"
        style={{ gap: 2, fontSize: 15, color: "#888", textAlign: "right" }}
      >
        {/* العناوين */}
        <div
          className="d-flex flex-column align-items-end"
          style={{ minWidth: 110 }}
        >
          <div>المستوى:</div>
          <div>النقاط المطلوبة:</div>
          <div>الحاصلين عليها:</div>
        </div>
        {/* القيم */}
        <div
          className="d-flex flex-column align-items-start"
          style={{ color: "#23262f", minWidth: 90 }}
        >
          <div>{badge.badgeType}</div>
          <div>{badge.points}</div>
          <div>{badge.users} مستخدم</div>
        </div>
      </div>
      {/* الأزرار */}
      <div className="d-flex justify-content-between gap-2 mt-2">
        <Button
          variant="primary"
          style={{
            // minWidth: 60,
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
    </div>
  );
}

const ManageChallenge = () => {
  return (
    <div
      style={{ background: "#fafbfc", minHeight: "100vh", direction: "rtl" }}
    >
      <div className="py-5">
        {/* Header */}
        <div
          className="d-flex flex-row-reverse align-items-center mb-5"
          style={{ justifyContent: "space-between" }}
        >
          <Button
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
        {/* Challenge Card - تصميم جديد مطابق للصورة والوصف */}
        <div
          className="challenge-card-responsive"
          style={{
            background: "#fff",
            borderRadius: 18,
            boxShadow: "0 2px 12px 0 rgba(16,30,54,0.06)",
            padding: "2.2rem 2.5rem 1.2rem 2.5rem",
            margin: "0 auto",
            maxWidth: 1400,
            minWidth: 320,
            minHeight: 120,
            width: "100%",
            fontFamily:
              "Tajawal, 'Cairo', 'Noto Kufi Arabic', Arial, sans-serif",
            position: "relative",
          }}
        >
          {/* العنوان والوصف وشارة نشط */}

          <div className="d-flex flex-row-reverse justify-content-between align-items-start flex-wrap mb-3">
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
            <div className="text-end" style={{ minWidth: 220, maxWidth: 320 }}>
              <div style={{ fontWeight: 700, fontSize: 20, color: "#23262f" }}>
                {mockChallenges[0].title}
              </div>
              <div style={{ color: "#888", fontSize: 15, marginTop: 4 }}>
                {mockChallenges[0].description}
              </div>
            </div>
          </div>
          {/* صف الأيقونات */}
          <div
            className="d-flex flex-row-reverse align-items-center justify-content-between flex-wrap mb-2 gap-2"
            style={{ width: "100%" }}
          >
            {/* النقاط */}
            <div
              className="d-flex align-items-center gap-1"
              style={{ minWidth: 100 }}
            >
              <span className="text-secondary" style={{ fontSize: "1rem" }}>
                {mockChallenges[0].rewardXP} نقطة
              </span>
              <img
                src={svgIcon("Vector(13).svg")}
                alt="star"
                style={{ width: 22, height: 22, marginLeft: 5 }}
              />
            </div>
            {/* المستخدمين */}
            <div
              className="d-flex align-items-center gap-1"
              style={{ minWidth: 110 }}
            >
              <span className="text-secondary" style={{ fontSize: "1rem" }}>
                {mockChallenges[0].users} مستخدم
              </span>
              <img
                src={svgIcon("Vector(14).svg")}
                alt="users"
                style={{ width: 22, height: 22, marginLeft: 5 }}
              />
            </div>

            {/* شارة ذهبية */}
            <div
              className="d-flex align-items-center gap-1"
              style={{ minWidth: 110 }}
            >
              <span className="text-secondary" style={{ fontSize: "1rem" }}>
                {mockChallenges[0].badge}
              </span>
              <img
                src={svgIcon("Vector(15).svg")}
                alt="badge"
                style={{ width: 22, height: 22, marginLeft: 5 }}
              />
            </div>
            {/* أيام */}
            <div
              className="d-flex align-items-center gap-1"
              style={{ minWidth: 90 }}
            >
              <span className="text-secondary" style={{ fontSize: "1rem" }}>
                {mockChallenges[0].days} أيام
              </span>
              <img
                src={svgIcon("Vector(16).svg")}
                alt="calendar"
                style={{ width: 22, height: 22, marginLeft: 5 }}
              />
            </div>
            {/* كأس (يمين) */}
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
          {/* الأزرار */}
          <div
            className="d-flex flex-row-reverse gap-2 mt-3"
            style={{ justifyContent: "flex-end" }}
          >
            <Button
              variant="danger"
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
        </div>
      </div>
      {/* بعد سكشن التحديات مباشرة */}
      {/* سكشن إدارة الشارات */}
      <div className="mt-5">
        <div
          className="d-flex flex-row-reverse align-items-center mb-4"
          style={{ justifyContent: "space-between" }}
        >
          <Button
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
        {/* Grid of Badge Cards */}
        <div className="row g-4">
          {mockBadges.map((badge, idx) => (
            <div className="col-12 col-md-6 col-lg-4" key={badge._id}>
              <BadgeCard badge={badge} idx={idx} />
            </div>
          ))}
        </div>
      </div>
      {/* Responsive CSS */}
      <style>{`
        @media (max-width: 900px) {
          .challenge-card-responsive { padding: 1.2rem 0.7rem !important; }
        }
        @media (max-width: 700px) {
          .challenge-card-responsive { flex-direction: column !important; gap: 1.2rem !important; min-width: 0 !important; }
        }
      `}</style>
    </div>
  );
};

export default ManageChallenge;

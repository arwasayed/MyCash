import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  CrownIcon,
  LeafIcon,
  FlameIcon,
  AwardIcon,
  CalendarIcon,
  DollarSignIcon,
  TimerIcon,
  RocketIcon,
  BotIcon,
} from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Game.css";
import ChallengeCard from "../ChallengeCard/ChallengeCard";
const DashboardPage = () => {
  const [challenges, setChallenges] = useState({
    activeChallenges: [],
    personalizedChallenges: [],
    staticChallenges: [],
  });

  const [badges, setBadges] = useState([]);

  const token = localStorage.getItem("token");

  const fetchChallenges = async () => {
    try {
      const res = await axios.get("/api/challenges/active", {
        headers: { Authorization: token },
      });
      console.log(res.data.data);
      setChallenges(res.data.data);
    } catch (err) {
      console.error("Error fetching challenges:", err);
    }
  };

  const fetchBadges = async () => {
    try {
      const res = await axios.get("/api/badges/user", {
        headers: { Authorization: token },
      });
      console.log(res.data);
      setBadges(res.data.data || []);
    } catch (err) {
      console.error("Error fetching badges:", err);
    }
  };

  useEffect(() => {
    fetchChallenges();
    fetchBadges();
  }, []);

  const handleChallengeClick = async (challengeId) => {
    try {
      await axios.post(`/api/challenges/join/${challengeId}`, null, {
        headers: { Authorization: token },
      });
      fetchChallenges();
    } catch (err) {
      console.error("Error joining challenge:", err);
      console.error("Backend response:", err.response?.data);
    }
  };

  const completeChallenge = async (challengeId) => {
    try {
      await axios.post(`/api/challenges/complete/${challengeId}`, null, {
        headers: { Authorization: token },
      });
      fetchChallenges();
      fetchBadges();
    } catch (err) {
      console.error("Error completing challenge:", err);
      console.error("Backend response:", err.response?.data);
    }
  };

  const badgeStyle = [
    {
      color: "bg-pink",
      badgeColor: "bg-pink bg-opacity-25 text-pink-emphasis",
    },
    {
      color: "bg-purple",
      badgeColor: "bg-purple bg-opacity-25 text-purple-emphasis",
    },
    {
      color: "bg-success",
      badgeColor: "bg-success bg-opacity-25 text-success-emphasis",
    },
    {
      color: "bg-warning",
      badgeColor: "bg-warning bg-opacity-25 text-warning-emphasis",
    },
  ];

  const rankLevels = [
    { title: "مبتدئ", description: "ابدأ رحلتك المالية!", threshold: 0 },
    { title: "موفر ذكي", description: "بدأت تسيطر على مصاريفك!", threshold: 2 },
    {
      title: "خبير ميزانية",
      description: "أنت محترف في إدارة المال!",
      threshold: 5,
    },
    { title: "Budget Master", description: "المستوى النهائي 💰", threshold: 8 },
  ];
  const totalChallenges =
    challenges.activeChallenges.length +
    challenges.personalizedChallenges.length +
    challenges.staticChallenges.length;
  const completedChallenges = 3;
  const currentRank =
    rankLevels
      .slice()
      .reverse()
      .find((rank) => completedChallenges >= rank.threshold) || rankLevels[0];
  const percentage = Math.min(
    100,
    Math.round((completedChallenges / 10) * 100)
  );
  let levelLabel = `مرتبة ${rankLevels.indexOf(currentRank) + 1}`;




  
  return (
    <div className=" mx-auto px-4 py-6 dashboard-page">
      {/* Welcome Section (Bootstrap) */}
      <div className=" my-5">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="bg-white rounded-4 shadow-sm p-4 text-center">
              <h2
                className="fw-bold mb-2"
                style={{ fontFamily: "Cairo, sans-serif" }}
              >
                جاهز تبدأ رحلتك؟
              </h2>
              <p
                className="mb-4"
                style={{ fontFamily: "Cairo, sans-serif", fontSize: "1.2rem" }}
              >
                خُد خطوة صغيرة النهاردة، هتوصل بعيد بكرة 🚀
              </p>
              <div className="d-flex justify-content-center">
                <img
                  src="public/Game/Image/img.png"
                  alt="Game Section"
                  className=""
                  style={{
                    width: "100%",
                    height: "256px",
                    objectFit: "cover",
                    borderRadius: "16px",
                    border: "1px solid #E5E7EB",
                    marginTop: "1rem",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Card (مطابق للصورة المطلوبة) */}
      <div
        className="mb-4"
        style={{
          background: "#8854D0",
          borderRadius: 16,
          padding: "1.5rem 2rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          direction: "rtl",
          color: "#fff",
          boxShadow: "0 2px 12px 0 #8854D033",
        }}
      >
        {/* النصوص + الميدالية */}
        <div style={{ display: 'flex', flexDirection: 'column',  textAlign: 'right', gap: 0 }} dir="rtl">
          <div style={{ fontWeight: 700, fontSize: '1.2rem', marginBottom: 2 }}>رتبتك الحالية</div>
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 6, margin: '0.2rem 0 0.2rem 0' }}>
          {badges.length > 0? 
          <img
          src="/Game/Icons/Vector(7).svg"
          alt="medal"
          style={{ width: 28, height: 28, marginLeft: 4 }}
        />
         :<></> }
            
            <span style={{ fontWeight: 700, fontSize: '1.15rem' }}>{badges.length == 0? "مبتدئ" :"بطل" }</span>
          </div>
          <div style={{ fontSize: '0.95rem', opacity: 0.85, marginTop: 2 }}>{badges.length == 0? "شد حيلك شوية" :"أنت محترف في إدارة المال" }!</div>
        </div>


        
      </div>

      {/* Challenges Section (مطابق لفجما) */}
      <div className="mb-5">
        <h2 className="section-title mb-4 text-center">التحديات المتاحة</h2>

        <br />
        {/* Render Static Challenges */}
        {challenges.staticChallenges.length > 0 && (
          <>
            <h4 className="section-title mb-4 text-left">تحديات مقترحة</h4>
            <div className="row justify-content-center g-4 mb-4">
              {challenges.staticChallenges.map((challenge, index) => (
                <ChallengeCard
                  key={challenge._id}
                  challenge={challenge}
                  index={index}
                  active={false}
                  onStart={() => handleChallengeClick(challenge._id)}
                />
              ))}
            </div>
          </>
        )}
        <br />

        {/* Render Personalized Challenges */}
        {challenges.personalizedChallenges.length > 0 && (
          <>
            <h4 className="section-title mb-4 text-left">تحديات مخصصة لك</h4>
            <div className="row justify-content-center g-4 mb-4">
              {challenges.personalizedChallenges.map((challenge, index) => (
                <ChallengeCard
                  key={challenge._id}
                  challenge={challenge}
                  index={index}
                  active={false}
                  onStart={() => handleChallengeClick(challenge._id)}
                />
              ))}
            </div>
          </>
        )}
        <br />
        {/* Render Active Challenges */}
        {challenges.activeChallenges.length > 0 && (
          <>
            <h4 className="section-title mb-4 text-left">تحدياتك الحالية</h4>
            <div className="row justify-content-center g-4">
              {challenges.activeChallenges.map((challenge, index) => (
                <ChallengeCard
                  key={challenge._id}
                  challenge={challenge}
                  index={index}
                  active={true}
                  onStart={() => completeChallenge(challenge._id)}
                />
              ))}
            </div>
          </>
        )}
      </div>
      <br />
      <br />
      {/* Achievements Section (مطابق لفجما) */}
      <div className="mb-5">
        <h2 className="section-title mb-4 text-center">شاراتك</h2>
        <br />
        <div className="row justify-content-center g-4">
          {badges.map((achievement, index) => {
            const style = badgeStyle[index % badgeStyle.length];
            const badge = achievement.badgeId || {};

            return (
              <div key={achievement._id} className="col-md-3 d-flex">
                <div className="card achievement-card h-100 w-100">
                  <div className="card-body p-4">
                    <div className="d-flex flex-column align-items-center">
                      <div
                        className={`achievement-icon ${
                          style.color || ""
                        } mb-3 d-flex align-items-center justify-content-center`}
                        style={{
                          width: 48,
                          height: 48,
                          background: "transparent",
                        }}
                      >
                        <img
                          src={badge.iconUrl || "/Game/Icons/Vector(5).svg"}
                          alt="icon"
                          style={{ width: 40, height: 40 }}
                        />
                      </div>
                      <h3 className="achievement-title mb-1">
                        {badge.title || "بدون عنوان"}
                      </h3>
                      <p className="achievement-description mb-3">
                        {badge.description || "لا يوجد وصف"}
                      </p>
                      <span
                        className={`achievement-badge ${
                          style.badgeColor || ""
                        }`}
                      >
                        {badge.badge || "شارة الأبطال"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Assistant Banner (زر تحت الرسالة، الروبوت ملاصق للرسالة) */}
      <div
        className="card mb-4"
        style={{
          border: "1px solid #C6F7E2",
          boxShadow: "0 2px 8px 0 #C6F7E233",
          borderRadius: "16px",
          background: "#fff",
          padding: "0.5rem 0",
        }}
        dir="rtl"
      >
        <div className="d-flex align-items-start p-3 flex-row-reverse">
          {/* صورة الروبوت */}
          <div
            className="d-flex align-items-center justify-content-center"
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              background: "#fff",
              border: "3px solid #FBE381",
              marginLeft: 0,
              marginRight: 8,
              flexShrink: 0,
            }}
          >
            <img
              src="/Game/Image/img(1).png"
              alt="المساعد الذكي"
              style={{ width: 56, height: 56, borderRadius: "50%" }}
            />
          </div>
          {/* رسالة المساعد + الزر */}
          <div className="flex-grow-1 d-flex flex-column align-items-start">
            <div
              style={{
                background: "linear-gradient(90deg, #FFF9C4 0%, #B8F2E6 100%)",
                borderRadius: 16,
                padding: "0.75rem 1.25rem",
                color: "#222",
                fontWeight: 500,
                fontSize: "1.1rem",
                width: "100%",
                textAlign: "right",
                marginBottom: 16,
              }}
            >
              {challenges.staticChallenges?.[0]?.description ||
                challenges.personalizedChallenges?.[0]?.description ||
                "لو وفرت 20 دج النهاردة، هتجمع وتوفر 600 دج في الشهر!"}
            </div>

            {challenges.staticChallenges?.[0] ||
            challenges.personalizedChallenges?.[0] ? (
              <button
                className="d-flex align-items-center"
                style={{
                  background: "#7C3AED",
                  color: "#fff",
                  border: "none",
                  borderRadius: 24,
                  fontWeight: 600,
                  fontSize: "1rem",
                  padding: "0.5rem 1.5rem",
                  boxShadow: "0 2px 8px 0 #7C3AED22",
                  minWidth: 120,
                  marginRight: "auto",
                }}
                onClick={() => {
                  const challenge =
                    challenges.staticChallenges?.[0] ||
                    challenges.personalizedChallenges?.[0];
                  if (challenge)
                    handleChallengeClick(challenge._id || challenge.id);
                }}
              >
                <img
                  src="/Game/Icons/Vector(6).svg"
                  alt="تحدي"
                  style={{
                    width: 20,
                    height: 20,
                    marginLeft: 8,
                    marginRight: 0,
                  }}
                />
                تحداني
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;

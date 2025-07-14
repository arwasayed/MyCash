import React, { useState } from 'react';
import { CrownIcon, LeafIcon, FlameIcon, AwardIcon, CalendarIcon, DollarSignIcon, TimerIcon, RocketIcon, BotIcon } from 'lucide-react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Game.css';
// import { ReactComponent as Vector5 } from './public/Game/Icons/Vector(5).svg';
// import { ReactComponent as Vector4 } from './public/Game/Icons/Vector(4).svg';
// import { ReactComponent as Vector2 } from './public/Game/Icons/Vector(2).svg';
// import { ReactComponent as Vector3 } from './public/Game/Icons/Vector(3).svg';
// import { ReactComponent as Vector1 } from './public/Game/Icons/Vector(1).svg';
// import { ReactComponent as Vector } from './public/Game/Icons/Vector.svg';
// import { ReactComponent as Frame } from './public/Game/Icons/Frame.svg';

const DashboardPage = () => {
  const [challenges] = useState([
    {
      id: 1,
      icon: '/Game/Icons/Vector.svg',
      title: 'وفر 100 د.ج في 3 أيام',
      description: 'تحدي سريع للتوفير',
      progress: 67,
      colorHex: '#7C3AED', // بنفسجي
      buttonColor: '#7C3AED',
      progressColor: '#7C3AED',
      iconBg: '#7C3AED33',
      shadow: '0 4px 16px 0 #7C3AED22'
    },
    {
      id: 2,
      icon: '/Game/Icons/Vector(1).svg',

      title: 'أسبوع بدون كماليات',
      description: 'تجنب المشتريات غير ضرورية',
      progress: 51,
      colorHex: '#FACC15', // أصفر
      buttonColor: '#FACC15',
      progressColor: '#FACC15',
      iconBg: '#FACC1533',
      shadow: '0 4px 16px 0 #FACC1522'
    },
    {
      id: 3,
      icon: '/Game/Icons/Vector(2).svg',
      title: '7 أيام توفير',
      description: 'وفر مبلغ يوميا لمدة أسبوع',
      progress: 35,
      colorHex: '#4ADE80', // أخضر
      buttonColor: '#4ADE80',
      progressColor: '#4ADE80',
      iconBg: '#4ADE8033',
      shadow: '0 4px 16px 0 #4ADE8022'
    }
  ]);

  const [achievements] = useState([
    {
      id: 4,
      icon: '/Game/Icons/Frame.svg',
      title: 'صائد الأهداف',
      description: 'حقق 3 أهداف مالية',
      badge: 'مكتمل',
      color: 'bg-pink',
      badgeColor: 'bg-pink bg-opacity-25 text-pink-emphasis'
    },
    {
      id: 3,
      icon: '/Game/Icons/Vector(3).svg',
      title: 'متتالية الأسبوع',
      description: '3 أيام متتالية مع التطبيق',
      badge: 'مكتمل',
      color: 'bg-purple',
      badgeColor: 'bg-purple bg-opacity-25 text-purple-emphasis'
    },
    {
      id: 2,
      icon: '/Game/Icons/Vector(4).svg',

      title: 'البداية القوية',
      description: 'أول تحدي مكتمل',
      badge: 'مكتمل',
      color: 'bg-success',
      badgeColor: 'bg-success bg-opacity-25 text-success-emphasis'
    },
    {
      id: 1,
      icon: '/Game/Icons/Vector(5).svg',
      title: 'ملك التوفير',
      description: 'وفر 1000 د.ج في شهر',
      badge: 'نادرة',
      color: 'bg-warning',
      badgeColor: 'bg-warning bg-opacity-25 text-warning-emphasis'
    },



  ]);

  const handleChallengeClick = (challengeId) => {
    console.log(`Starting challenge ${challengeId}`);
    // Add challenge logic here
  };

  const handleAssistantClick = () => {
    console.log('Assistant collaboration clicked');
    // Add assistant logic here
  };

  return (
    <div className=" mx-auto px-4 py-6 dashboard-page">
      {/* Welcome Section (Bootstrap) */}
      <div className=" my-5">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="bg-white rounded-4 shadow-sm p-4 text-center">
              <h2 className="fw-bold mb-2" style={{ fontFamily: 'Cairo, sans-serif' }}>
                جاهز تبدأ رحلتك؟
              </h2>
              <p className="mb-4" style={{ fontFamily: 'Cairo, sans-serif', fontSize: '1.2rem' }}>
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
                    marginTop: "1rem"
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
          background: '#8854D0',
          borderRadius: 16,
          padding: '1.5rem 2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          direction: 'rtl',
          color: '#fff',
          boxShadow: '0 2px 12px 0 #8854D033'
        }}
      >
        {/* النصوص + الميدالية */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', textAlign: 'right', gap: 0 }} dir="rtl">
          <div style={{ fontWeight: 700, fontSize: '1.2rem', marginBottom: 2 }}>رتبتك الحالية</div>
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 6, margin: '0.2rem 0 0.2rem 0' }}>
            <img
              src="/Game/Icons/Vector(7).svg"
              alt="medal"
              style={{ width: 28, height: 28, marginLeft: 4 }}
            />
            <span style={{ fontWeight: 700, fontSize: '1.15rem' }}>Budget Master</span>
          </div>
          <div style={{ fontSize: '0.95rem', opacity: 0.85, marginTop: 2 }}>أنت محترف في إدارة المال!</div>
        </div>
        {/* دائرة النسبة */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '1.1rem',
              marginBottom: 4
            }}
          >
            85%
          </div>
          <div style={{ fontSize: '0.85rem', opacity: 0.8 }}>مرتبة الثالثة</div>
        </div>
      </div>

      {/* Challenges Section (مطابق لفجما) */}
      <div className="mb-5">
        <h2 className="section-title mb-4 text-center">التحديات المتاحة</h2>
        <div className="row justify-content-center g-4">
          {challenges.map(challenge => (
            <div key={challenge.id} className="col-md-4 d-flex">
              <div
                className="card challenge-card h-100 w-100"
                style={{
                  boxShadow: challenge.shadow,
                  border: `2px solid ${challenge.colorHex}`
                }}
              >
                <div className="card-body p-4">
                  <div className="d-flex flex-column align-items-center">
                    <div
                      className="mb-3 d-flex align-items-center justify-content-center"
                      style={{
                        background: challenge.iconBg,
                        borderRadius: '50%',
                        width: 56,
                        height: 56
                      }}
                    >
                      <img src={challenge.icon} alt="icon" style={{ width: 40, height: 40 }} />
                    </div>
                    <h3 className="challenge-title mb-1">{challenge.title}</h3>
                    <p className="challenge-description mb-4">
                      {challenge.description}
                    </p>
                    <div
                      className="mb-4 d-flex align-items-center justify-content-center"
                      style={{
                        border: `2px solid ${challenge.progressColor}`,
                        borderRadius: '50%',
                        width: 48,
                        height: 48
                      }}
                    >
                      <span style={{ color: challenge.colorHex, fontWeight: 'bold' }}>
                        {challenge.progress}%
                      </span>
                    </div>
                    <button
                      className="text-white w-100"
                      style={{
                        background: challenge.buttonColor,
                        border: 'none',
                        borderRadius: 20,
                        fontWeight: 'bold',
                        fontSize: '1.1rem',
                        padding: '0.5rem 0',
                        boxShadow: challenge.shadow
                      }}
                      onClick={() => handleChallengeClick(challenge.id)}
                    >
                      ابدأ التحدي
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Achievements Section (مطابق لفجما) */}
      <div className="mb-5">
        <h2 className="section-title mb-4 text-center">نشاراتك</h2>
        <div className="row justify-content-center g-4">
          {achievements.map(achievement => (
            <div key={achievement.id} className="col-md-3 d-flex">
              <div className="card achievement-card h-100 w-100">
                <div className="card-body p-4">
                  <div className="d-flex flex-column align-items-center">
                    <div
                      className={`achievement-icon ${achievement.color} mb-3 d-flex align-items-center justify-content-center`}
                      style={{ width: 48, height: 48, background: 'transparent' }}
                    >
                      <img src={achievement.icon} alt="icon" style={{ width: 40, height: 40 }} />
                    </div>
                    <h3 className="achievement-title mb-1">{achievement.title}</h3>
                    <p className="achievement-description mb-3">
                      {achievement.description}
                    </p>
                    <span className={`achievement-badge ${achievement.badgeColor}`}>
                      {achievement.badge}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Assistant Banner (زر تحت الرسالة، الروبوت ملاصق للرسالة) */}
      <div
        className="card mb-4"
        style={{
          border: '1px solid #C6F7E2',
          boxShadow: '0 2px 8px 0 #C6F7E233',
          borderRadius: '16px',
          background: '#fff',
          padding: '0.5rem 0',
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
              borderRadius: '50%',
              background: '#fff',
              border: '3px solid #FBE381',
              marginLeft: 0,
              marginRight: 8,
              flexShrink: 0
            }}
          >
            <img
              src="/Game/Image/img(1).png"
              alt="المساعد الذكي"
              style={{ width: 56, height: 56, borderRadius: '50%' }}
            />
          </div>
          {/* رسالة المساعد + الزر */}
          <div className="flex-grow-1 d-flex flex-column align-items-start">
            <div
              style={{
                background: 'linear-gradient(90deg, #FFF9C4 0%, #B8F2E6 100%)',
                borderRadius: 16,
                padding: '0.75rem 1.25rem',
                color: '#222',
                fontWeight: 500,
                fontSize: '1.1rem',
                width: '100%',
                textAlign: 'right',
                marginBottom: 16
              }}
            >
              لو وفرت 20 دج النهاردة، هتجمع وتوفر 600 دج في الشهر!
            </div>
            <button
              className="d-flex align-items-center"
              style={{
                background: '#7C3AED',
                color: '#fff',
                border: 'none',
                borderRadius: 24,
                fontWeight: 600,
                fontSize: '1rem',
                padding: '0.5rem 1.5rem',
                boxShadow: '0 2px 8px 0 #7C3AED22',
                minWidth: 120,
                marginRight: 'auto'
              }}
              onClick={handleAssistantClick}
            >
              <img
                src="/Game/Icons/Vector(6).svg"
                alt="تحدي"
                style={{ width: 20, height: 20, marginLeft: 8, marginRight: 0 }}
              />
              تحداني
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage; 
import React from "react";
import "./LandingPage.css";
import {
  MdOutlineTrackChanges,
  MdBarChart,
  MdOutlineLightbulb,
  MdSmartphone,
  MdOutlineShield,
} from "react-icons/md";
import { GiRobotGolem } from "react-icons/gi";

const LandingPage = () => {
  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <h1 className="hero-title">
              سيطر على فلوسك
              <br />
              <span className="highlight">بذكاء...!</span>
            </h1>
            <p className="hero-description">
              مساعدك الذكي لإدارة الأموال الشخصية بطريقة ممتعة وبسيطة. ابدأ
              <br />
              رحلتك نحو الحرية المالية اليوم
            </p>
            <div className="hero-buttons d-flex gap-2 flex-wrap justify-content-end">
              <button className="btn-primary">
                ابدأ الآن مجاناً
                <span className="startnow-icon" style={{ marginRight: 8 }}>
                  <img
                    src="/public/Landing-Page/landing-icons/StartNow.svg"
                    alt="ابدأ الآن"
                    width={19}
                    height={19}
                  />
                </span>
              </button>
              <button className="btn-secondary">
                شاهد كيف يعمل
                <span className="watchnow-icon" style={{ marginRight: 8 }}>
                  <img
                    src="/public/Landing-Page/landing-icons/WatchNow.svg"
                    alt="شاهد كيف يعمل"
                    width={15}
                    height={19}
                  />
                </span>
              </button>
            </div>
          </div>
          <div className="hero-image">
            <img
              src="/public/Landing-Page/landing-image/img0.png"
              alt="AI Assistant with person"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="features-container">
          <div className="features-header text-center mb-5">
            <h2 className="features-title">لماذا ماي كاش؟</h2>
            <p className="features-subtitle">
              مميزات تجعل إدارة أموالك أسهل وأكثر متعة
            </p>
          </div>
          <div className="features-grid">
            {/* Row 1 */}
            <div className="feature-card">
              <div className="feature-icon purple-icon">
                <img
                  src="/public/Landing-Page/landing-icons/AI.svg"
                  alt="مساعد ذكي شخصي"
                  width={32}
                  height={32}
                />
              </div>
              <h3 className="feature-title">مساعد ذكي شخصي</h3>
              <p className="feature-description">
                شات بوت ذكي يساعدك في تتبع مصروفاتك
                <br />
                وتحقيق أهدافك المالية
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon green-icon">
                <img
                  src="/public/Landing-Page/landing-icons/Reports.svg"
                  alt="تقارير تفاعلية"
                  width={32}
                  height={32}
                />
              </div>
              <h3 className="feature-title">تقارير تفاعلية</h3>
              <p className="feature-description">
                رسوم بيانية جميلة تظهر تطور وضعك المالي
                <br />
                بطريقة واضحة
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon pink-icon">
                <img
                  src="/public/Landing-Page/landing-icons/Goals.svg"
                  alt="أهداف ذكية"
                  width={32}
                  height={32}
                />
              </div>
              <h3 className="feature-title">أهداف ذكية</h3>
              <p className="feature-description">
                ضع أهدافك المالية واتركنا نساعدك في تحقيقها
                <br />
                خطوة بخطوة
              </p>
            </div>

            {/* Row 2 */}
            <div className="feature-card">
              <div className="feature-icon purple-shield-icon">
                <img
                  src="/public/Landing-Page/landing-icons/Securty.svg"
                  alt="أمان عالي"
                  width={32}
                  height={32}
                />
              </div>
              <h3 className="feature-title">أمان عالي</h3>
              <p className="feature-description">
                بياناتك محمية بأعلى معايير الأمان والخصوصية
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon blue-icon">
                <img
                  src="/public/Landing-Page/landing-icons/EasyUsed.svg"
                  alt="سهولة الاستخدام"
                  width={32}
                  height={32}
                />
              </div>
              <h3 className="feature-title">سهولة الاستخدام</h3>
              <p className="feature-description">
                واجهة بسيطة وسهلة تناسب جميع الأعمار
                <br />
                والخبرات
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon yellow-icon">
                <img
                  src="/public/Landing-Page/landing-icons/advice.svg"
                  alt="نصائح ذكية"
                  width={32}
                  height={32}
                />
              </div>
              <h3 className="feature-title">نصائح ذكية</h3>
              <p className="feature-description">
                احصل على نصائح مخصصة لتحسين عاداتك المالية
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <div className="how-it-works-container">
          <div className="how-it-works-header text-center mb-5">
            <h2 className="how-it-works-title">كيف يعمل ماي كاش؟</h2>
            <p className="how-it-works-subtitle">
              ثلاث خطوات بسيطة لبداية رحلتك المالية
            </p>
          </div>

          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number purple-step">1</div>
              <h3 className="step-title">سجل وأربط حساباتك</h3>
              <p className="step-description">
                أنشئ حسابك وأربط حساباتك البنكية بأمان تام
              </p>
              <div className="step-image">
                <img
                  src="/public/Landing-Page/landing-image/img(3).png"
                  alt="Banking App"
                />
              </div>
            </div>

            <div className="step-card">
              <div className="step-number green-step">2</div>
              <h3 className="step-title">تحدث مع المساعد الذكي</h3>
              <p className="step-description">
                اسأل عن أموالك واحصل على إجابات فورية
              </p>
              <div className="step-image">
                <img
                  src="/public/Landing-Page/landing-image/img(2).png"
                  alt="AI Chat"
                />
              </div>
            </div>

            <div className="step-card">
              <div className="step-number red-step">3</div>
              <h3 className="step-title">حقق أهدافك المالية</h3>
              <p className="step-description">
                تابع تقدمك واحصل على نصائح لتحقيق أهدافك
              </p>
              <div className="step-image">
                <img
                  src="/public/Landing-Page/landing-image/img(1)(2).png"
                  alt="Financial Goals"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="cta-section">
        <div className="cta-container d-flex flex-column align-items-center">
          <h2 className="cta-title">جاهز لتغيير حياتك المالية؟</h2>
          <p className="cta-subtitle">
            انضم لآلاف المستخدمين الذين يديرون أموالهم بذكاء مع ماي كاش
          </p>
          <div className="cta-buttons d-flex gap-2 justify-content-center mb-4 flex-wrap">
            <button className="btn-primary-cta">
              ابدأ رحلتك الآن
              <span className="startjourny-icon" style={{ marginRight: 8 }}>
                <img
                  src="/public/Landing-Page/landing-icons/StartJourny.svg"
                  alt="ابدأ رحلتك الآن"
                  width={17}
                  height={19}
                />
              </span>
            </button>
            <button className="btn-secondary-cta">
              تواصل معنا
              <span className="contactus-icon" style={{ marginRight: 8 }}>
                <img
                  src="/public/Landing-Page/landing-icons/ContactUs.svg"
                  alt="تواصل معنا"
                  width={23}
                  height={19}
                />
              </span>
            </button>
          </div>
          <div className="cta-image">
            <img
              src="/public/Landing-Page/landing-image/img(4).png"
              alt="Happy People Celebrating"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;

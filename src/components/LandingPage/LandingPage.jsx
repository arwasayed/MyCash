import React from "react";
import "./LandingPage.css";

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
                ابدأ الآن مجاناً <span className="rocket-icon">🚀</span>
              </button>
              <button className="btn-secondary">
                شاهد كيف يعمل <span className="play-icon">▶</span>
              </button>
            </div>
          </div>
          <div className="hero-image">
            <img src="/public/img0.png" alt="AI Assistant with person" />
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
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    x="5"
                    y="8"
                    width="14"
                    height="10"
                    rx="5"
                    fill="#ede9fe"
                    stroke="#8b5cf6"
                    strokeWidth="1.5"
                  />
                  <circle cx="8.5" cy="13" r="1" fill="#8b5cf6" />
                  <circle cx="15.5" cy="13" r="1" fill="#8b5cf6" />
                  <rect
                    x="10"
                    y="3"
                    width="4"
                    height="2"
                    rx="1"
                    fill="#8b5cf6"
                  />
                  <rect
                    x="2"
                    y="11"
                    width="2"
                    height="2"
                    rx="1"
                    fill="#8b5cf6"
                  />
                  <rect
                    x="20"
                    y="11"
                    width="2"
                    height="2"
                    rx="1"
                    fill="#8b5cf6"
                  />
                </svg>
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
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    x="3"
                    y="13"
                    width="3"
                    height="8"
                    rx="1.5"
                    fill="#d1fae5"
                    stroke="#10b981"
                    strokeWidth="1.5"
                  />
                  <rect
                    x="8.5"
                    y="9"
                    width="3"
                    height="12"
                    rx="1.5"
                    fill="#d1fae5"
                    stroke="#10b981"
                    strokeWidth="1.5"
                  />
                  <rect
                    x="14"
                    y="5"
                    width="3"
                    height="16"
                    rx="1.5"
                    fill="#d1fae5"
                    stroke="#10b981"
                    strokeWidth="1.5"
                  />
                </svg>
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
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="#ec4899"
                    strokeWidth="2"
                    fill="#fff0f6"
                  />
                  <circle
                    cx="12"
                    cy="12"
                    r="5"
                    stroke="#ec4899"
                    strokeWidth="2"
                    fill="none"
                  />
                  <circle cx="12" cy="12" r="2" fill="#ec4899" />
                </svg>
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
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 3l7 4v5c0 5-3.5 9-7 9s-7-4-7-9V7l7-4z"
                    fill="#ede9fe"
                    stroke="#9333ea"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M12 11v3"
                    stroke="#9333ea"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <circle cx="12" cy="15" r="1" fill="#9333ea" />
                </svg>
              </div>
              <h3 className="feature-title">أمان عالي</h3>
              <p className="feature-description">
                بياناتك محمية بأعلى معايير الأمان والخصوصية
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon blue-icon">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    x="7"
                    y="3"
                    width="10"
                    height="18"
                    rx="2"
                    fill="#dbeafe"
                    stroke="#3b82f6"
                    strokeWidth="1.5"
                  />
                  <rect
                    x="10"
                    y="18"
                    width="4"
                    height="2"
                    rx="1"
                    fill="#3b82f6"
                  />
                </svg>
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
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="12" cy="12" r="10" fill="#fef9c3" />
                  <path
                    d="M9 17h6M10 20h4"
                    stroke="#f59e0b"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M12 7v4"
                    stroke="#f59e0b"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
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
                <img src="/public/img(3).png" alt="Banking App" />
              </div>
            </div>

            <div className="step-card">
              <div className="step-number green-step">2</div>
              <h3 className="step-title">تحدث مع المساعد الذكي</h3>
              <p className="step-description">
                اسأل عن أموالك واحصل على إجابات فورية
              </p>
              <div className="step-image">
                <img src="/public/img(2).png" alt="AI Chat" />
              </div>
            </div>

            <div className="step-card">
              <div className="step-number red-step">3</div>
              <h3 className="step-title">حقق أهدافك المالية</h3>
              <p className="step-description">
                تابع تقدمك واحصل على نصائح لتحقيق أهدافك
              </p>
              <div className="step-image">
                <img src="/public/img(1)(2).png" alt="Financial Goals" />
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
            <button className="btn-primary-cta">ابدأ رحلتك الآن ←</button>
            <button className="btn-secondary-cta">تواصل معنا</button>
          </div>
          <div className="cta-image">
            <img src="/public/img(4).png" alt="Happy People Celebrating" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;

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
import { Link } from "react-router-dom";
import { LiaAnkhSolid } from "react-icons/lia";

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
              <Link to="/register" className="btn-primary d-flex align-items-center text-decoration-none">
    ابدأ الآن مجاناً
    <span className="startnow-icon" style={{ marginRight: 8 }}>
      <img
        src="/Landing-Page/landing-icons/StartNow.svg"
        alt="ابدأ الآن"
        width={19}
        height={19}
      />
    </span>
  </Link>
              <a
  href="https://drive.google.com/file/d/10_g3gmz_tFbQULpHxaYQE4aHFPmnn2oC/view?usp=drive_link"
  target="_blank"
  rel="noopener noreferrer"
  className="btn-secondary"
  style={{ textDecoration: "none" }}
>
  شاهد كيف يعمل
  <span className="watchnow-icon" style={{ marginRight: 8 }}>
    <img
      src="/Landing-Page/landing-icons/WatchNow.svg"
      alt="شاهد كيف يعمل"
      width={15}
      height={19}
    />
  </span>
</a>
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
                {/* <br /> */}
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
              ثلاث خطوات بسيطة لإدارة رحلتك المالية
            </p>
          </div>

          <div className="how-steps">
            <div className="how-step">
              <div className="how-step-circle step1">1</div>
              <div className="how-step-title">سجل واربط حساباتك</div>
              <div className="how-step-desc">
                أنشئ حسابك واربِط حساباتك البنكية بأمان تام
              </div>
              <img
                src="/Landing-Page/landing-image/img(3).png"
                alt="سجل حسابك"
                className="how-step-img"
              />
            </div>
            <div className="how-step">
              <div className="how-step-circle step2">2</div>
              <div className="how-step-title">تحدث مع المساعد الذكي</div>
              <div className="how-step-desc">
                اسأل عن أمورك واحصل على إجابات فورية
              </div>
              <img
                src="/Landing-Page/landing-image/img(2).png"
                alt="تحدث مع المساعد"
                className="how-step-img"
              />
            </div>
            <div className="how-step">
              <div className="how-step-circle step3">3</div>
              <div className="how-step-title">حقق أهدافك المالية</div>
              <div className="how-step-desc">
                تابع أهدافك واحصل على اقتراحات لتحقيق أهدافك
              </div>
              <img
                src="/Landing-Page/landing-image/AchivGoals1.png"
                alt="حقق أهدافك"
                className="how-step-img"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="cta-section">
        <div
          className="cta-container d-flex flex-column align-items-center justify-content-center text-center"
          style={{ minHeight: "100vh" }}
        >
          <h2 className="cta-title">جاهز لتغيير حياتك المالية؟</h2>
          <p className="cta-subtitle">
            انضم لآلاف المستخدمين الذين يديرون أموالهم بذكاء مع ماي كاش
          </p>
          <div className="cta-buttons d-flex gap-2 justify-content-center mb-4 flex-wrap">
          <Link to="/register" className="btn-primary-cta" style={{ textDecoration: "none" }}>
  ابدأ رحلتك الآن
  <span className="startjourny-icon" style={{ marginRight: 8 }}>
    <img
      src="/Landing-Page/landing-icons/StartJourny.svg"
      alt="ابدأ رحلتك الآن"
      width={17}
      height={19}
    />
  </span>
</Link>
            <Link className="btn-secondary-cta" to="https://wa.me/201008170815?text=%20مرحبًا،%20أرغب%20في%20الاستفسار%20عن%20خدمتكم%20فى%20موقع%20ماى%20كاش" style={{ textDecoration: "none" }}>
              تواصل معنا
              <span className="contactus-icon" style={{ marginRight: 8 }}>
                <img
                  src="/public/Landing-Page/landing-icons/ContactUs.svg"
                  alt="تواصل معنا"
                  width={23}
                  height={19}
                />
              </span>
            </Link>
          </div>
          <div className="cta-image mt-4">
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

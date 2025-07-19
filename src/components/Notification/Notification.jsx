import React, { useState, useEffect } from "react";
import "./Notification.css";
import {
  Container,
  Row,
  Col,
  Image,
  Button,
  Card,
  Spinner,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const getIcon = (type) => {
  switch (type) {
    case "goal":
      return <img src="Notification/div (1).svg" alt="goal" />;
    case "challenge":
      return <img src="Notification/div (2).svg" alt="challenge" />;
    case "badge":
      return <img src="Notification/div (3).svg" alt="badge" />;
    case "finance":
      return <img src="Notification/div (5).svg" alt="finance" />;
    default:
      return <img src="Notification/div (5).svg" alt="default" />;
  }
};

const getVariant = (type) => {
  switch (type) {
    case "goal":
      return { border: "1px solid #BBF7D0" };
    case "challenge":
      return { border: "1px solid #FECACA" };
    case "badge":
      return { border: "1px solid #BFDBFE" };
    case "finance":
      return { border: "1px solid #E9D5FF" };
    default:
      return {};
  }
};

const typeTextMap = {
  goal: "هدف",
  challenge: "تحدى",
  badge: "شارة",
  finance: "مالى",
};

const Notification = () => {
  const navigate = useNavigate();
  const [allNotifications, setAllNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterType, setFilterType] = useState("all");
  const [visibleCount, setVisibleCount] = useState(5);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login", {
        state: { 
          from: "/notification",
          message: "يجب تسجيل الدخول أولاً للوصول لصفحة الدفع" 
        }
      });
    }
    const fetchNotifications = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        alert("⚠️ لم يتم العثور على توكن! الرجاء تسجيل الدخول أولاً.");
        setLoading(false);
        return;
      }
      try {
        const response = await fetch(
          "http://localhost:3000/api/notifications",
          {
            headers: {
              Authorization: ` ${token}`,
            },
          }
        );

        if (response.status === 401) {
          alert("⚠️ غير مصرح. الرجاء تسجيل الدخول مجددًا.");
          setLoading(false);
          return;
        }

        const data = await response.json();
        if (data.success) {
          setAllNotifications(
            data.data.map((notif) => ({
              id: notif._id,
              type: notif.type,
              title: notif.title || notif.message || "بدون عنوان",
              message: notif.message,
              text: typeTextMap[notif.type] || "تذكير",
              time: new Date(notif.createdAt).toLocaleTimeString("ar-EG", {
                hour: "2-digit",
                minute: "2-digit",
              }),
            }))
          );
        } else {
        }
      } catch (err) {
        console.error("خطأ في جلب الإشعارات:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [navigate]);

  const filteredNotifications =
    filterType === "all"
      ? allNotifications
      : allNotifications.filter((notif) => notif.type === filterType);

  // فقط الإشعارات المرئية حسب visibleCount
  const visibleNotifications = filteredNotifications.slice(0, visibleCount);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 5);
  };

  //test

  //   const handleSendTestNotification = async () => {
  //     const token = localStorage.getItem("token");
  //     if (!token) {
  //       alert("⚠️ لم يتم العثور على توكن! الرجاء تسجيل الدخول أولاً.");
  //       return;
  //     }

  //     try {
  //       const res = await fetch("http://localhost:3000/api/notifications/test", {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${token}`,
  //         },
  //         body: JSON.stringify({
  //           message: "📢 هذا إشعار تجريبي تم إرساله بنجاح!",
  //           type: "goal",
  //         }),
  //       });

  //       const data = await res.json();
  //       if (data.success) {
  //         alert("✅ تم إرسال الإشعار!");
  //       } else {
  //         alert("❌ فشل في الإرسال: " + (data.message || 'خطأ غير معروف'));
  //       }
  //     } catch (err) {
  //       console.error("Send Notification Error:", err);
  //       alert("⚠️ حصل خطأ أثناء الإرسال");
  //     }
  // };

  return (
    <Container
      fluid
      className="notification-container d-flex justify-content-center align-items-center"
    >
      <Row className="notification mt-4">
        <Col xs="auto" className="text-center text-md-end">
          <h2 className="notification-title">الإشعارات</h2>
          <p className="notification-subtext">
            تابع آخر التحديثات والتنبيهات المهمة
          </p>
        </Col>
        <Col xs="auto">
          <Image
            src="/Notification/div.svg"
            alt="Robot"
            className="robot-image"
            fluid
          />
        </Col>
      </Row>

      <Row className="search mt-3 justify-content-center ">
        {["all", "goal", "challenge", "badge", "finance"].map((type) => (
          <Col
            key={type}
            xs={12}
            md="auto"
            className="mb-2 mb-md-0 px-1 text-center"
          >
            <Button
              className={`bt minimal all ${
                filterType === type ? "active" : ""
              }`}
              onClick={() => {
                setFilterType(type);
                setVisibleCount(5);
              }}
              style={{
                minWidth: "100px",
                ...(filterType === type
                  ? { background: "#6C5DD3", color: "white" }
                  : {}),
              }}
            >
              {
                {
                  all: "الكل",
                  goal: "الاهداف",
                  challenge: "التحديات",
                  badge: "الشارات",
                  finance: "الماليات",
                }[type]
              }
            </Button>
          </Col>
        ))}
      </Row>

      {/* قائمة الإشعارات */}
      <div className="container mt-4">
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : (
          <>
            {visibleNotifications.length === 0 ? (
              <p className="text-center none">لا توجد إشعارات</p>
            ) : (
              visibleNotifications.map((notif) => (
                <Card
                  key={notif.id}
                  className="mb-3 notif"
                  style={getVariant(notif.type)}
                >
                  <Card.Body>
                    <div className="d-flex flex-column flex-md-row align-items-start">
                      <div className="fs-4 mb-2 mb-md-0">
                        {getIcon(notif.type)}
                      </div>
                      <div className="mx-md-3 w-100">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <Card.Title
                            className="mb-0"
                            style={{
                              fontFamily: "Cairo",
                              fontWeight: 400,
                              fontSize: "16px",
                              lineHeight: "24px",
                            }}
                          >
                            {notif.title}
                          </Card.Title>
                          <small style={{ color: "#999", fontSize: "12px" }}>
                            {notif.time}
                          </small>
                        </div>

                        <Card.Text
                          className="mb-2"
                          style={{
                            fontFamily: "Cairo",
                            fontWeight: 400,
                            fontSize: "16px",
                            lineHeight: "24px",
                            color: "#7B88A8",
                          }}
                        >
                          {notif.message}
                        </Card.Text>
                          
                        <div className="text-end">
                          <span className={`custom-badge ${notif.type}`}>
                            {notif.text}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              ))
            )}

            {visibleCount < filteredNotifications.length && (
              <div className="text-center">
                <Button
                  variant="primary"
                  className="mt-2 load"
                  onClick={handleLoadMore}
                >
                  تحميل المزيد من الإشعارات
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      {/* <div className="text-center mt-4">
        <Button variant="success" onClick={handleSendTestNotification}>
          إرسال إشعار تجريبي
        </Button>
      </div> */}
    </Container>
  );
};

export default Notification;

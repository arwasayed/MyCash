import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Image } from "react-bootstrap";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Payment.css";

const Payment = () => {
  const [selectedCountry, setSelectedCountry] = useState("مصر");
  const [errorMsg, setErrorMsg] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(false);

  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const { state } = useLocation();

  const amount = state?.amount || 45;
  const planType = state?.planType || "Monthly";

  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.post(
          `http://localhost:3000/api/payment/create`,
          {
            amount: amount * 100,
            currency: "EGP",
            planType,
          },
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );
        setClientSecret(res.data.clientSecret);
      } catch (err) {
        console.error(err);
        setErrorMsg("فشل في بدء عملية الدفع");
      }
    };

    createPaymentIntent();
  }, [amount, planType]);

  const handlePayment = async () => {
    setLoading(true);
    setErrorMsg("");

    try {
      const cardElement = elements.getElement(CardElement);
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
      });

      if (error) {
        setErrorMsg(error.message);
        setLoading(false);
        return;
      }

      const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: paymentMethod.id,
      });

      if (confirmError || paymentIntent.status !== "succeeded") {
        setErrorMsg("فشل تأكيد الدفع");
        setLoading(false);
        return;
      }

      // Confirm on server
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:3000/api/payment/confirm`,
        { paymentIntentId: paymentIntent.id },
        { headers: { Authorization: `${token}` } }
      );

      alert("تم الدفع بنجاح");
      navigate("/home");
    } catch (err) {
      console.error(err);
      setErrorMsg("حدث خطأ أثناء الدفع");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid className="payment-container">
      <div className="custom-div content-wrapper">
        <Row className="mycach">
          {/* Payment Form */}
          <Col md={7} className="payment-box p-5">
            <h5 className="payment-heading">أدخل بيانات الدفع الخاصة بك</h5>
            <Form className="payment-form">
              <Form.Label className="mt-5">طرق الدفع</Form.Label>
              <div className="payment-icons">
                <span className="pay payment-method">
                  <Image className="pay-img" src="Payment/ApplePay.png" alt="Visa" />
                </span>
                <span className="paypal payment-method">
                  <Image className="paypal-img" src="Payment/Mastercard.png" alt="Visa" />
                </span>
                <span className="visa payment-method">
                  <Image className="visa-img" src="Payment/visa-logo.png" alt="Visa" />
                </span>
              </div>

              <Form.Group className="mb-3 mt-4">
                <Form.Label>بطاقة الدفع</Form.Label>
                <div style={{ padding: "12px", border: "1px solid #ccc", borderRadius: "6px" }}>
                  <CardElement />
                </div>
              </Form.Group>

              <Form.Group className="mb-3">
              <Form.Label>اسم صاحب البطاقة</Form.Label>
              <Form.Control type="text" placeholder="الاسم كما هو مكتوب على البطاقة" />
            </Form.Group>

              <Form.Group className="mb-3">
              <Form.Label>عنوان الفاتورة</Form.Label><br/>
                <Form.Label>الدولة</Form.Label>
                <Form.Group controlId="country">
                <Form.Group controlId="countryDropdown" style={{ position: 'relative',width:'100%', maxWidth: '1000px', height: '50px' }}>
                <Form.Select
                    value={selectedCountry}
                    onChange={(e) => setSelectedCountry(e.target.value)}
                    style={{
                      width: '100%',
                      height: '100%',
                      backgroundColor: '#FFFFFF',
                      borderRadius: '8px',
                      fontFamily: 'Cairo',
                      fontSize: '16px',
                      lineHeight: '30px',
                      color: '#000',
                      appearance: 'none',            
                    WebkitAppearance: 'none',     
                    MozAppearance: 'none',         
                    backgroundImage: 'none' 
                    }}
                  >
                    <option value="مصر">مصر</option>
                    <option value="السعودية">السعودية</option>
                    <option value="الإمارات">الإمارات</option>
                    <option value="الكويت">الكويت</option>
                  </Form.Select>
                  <span
    style={{
      position: 'absolute',
      top: '50%',
      left: '20px',
      width: '16px',
      height: '10px',
      backgroundColor: 'rgba(147, 51, 234, 0.71)',
      clipPath: 'polygon(50% 100%, 0 0, 100% 0)', 
    }}
  ></span>
                </Form.Group>
                </Form.Group>
              </Form.Group>

              <Form.Group className="mb-3">
              <Form.Label>العنوان بالتفصيل (سطر 1)</Form.Label>
              <Form.Control type="text" placeholder= "رقم المبنى، اسم الشارع" />
            </Form.Group>
            <Form.Group className="mb-3">
             <Form.Label>العنوان بالتفصيل (سطر 2) - اختياري</Form.Label>

              <Form.Control type="text" placeholder="الحي، المنطقة" />
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                               <Form.Label> المحافظة </Form.Label>

                  <Form.Control type="text" placeholder="المحافظة" value="القاهرة" />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                               <Form.Label>المدينة</Form.Label>

                  <Form.Control type="text" placeholder=" المدينة" value="القاهرة" />
                </Form.Group>
              </Col>
            </Row>
            </Form>
          </Col>

          {/* Subscription Summary */}
          <Col md={5} className="your-subscription">
            <div className="payment-info">
              <h5 className="payment-heading">
                اشتراكك في <span style={{ color: "#ae66c4" }}>ماي كاش</span> My Cash
              </h5>
              <div className="d-flex justify-content-between mb-3">
                <span className="payment-label">الخطة المختارة:</span>
                <span className="payment-value">الخطة الشهرية</span>
              </div>
              <div className="d-flex justify-content-between mb-3">
                <span className="payment-label">سعر الاشتراك:</span>
                <span className="payment-value">45 جنيه شهريًا</span>
              </div>
              <div className="d-flex justify-content-between mb-3">
                <span className="payment-label">الخصم:</span>
                <span className="payment-value">6.30 جنيه</span>
              </div>
              <div className="d-flex justify-content-between mb-3">
                <span className="payment-label" style={{ color: "#111827", fontSize: "18px" }}>
                  الإجمالي:
                </span>
                <span className="total-price">38.30 جنيه</span>
              </div>
              <div className="payment-note text-end">
                <Image src="Payment/Frame.png" alt="auto" /> يتم الخصم تلقائيًا عند اشتراكك أو الإلغاء في أي وقت
              </div>
              <p className="text-success mt-3 text-end">
                <Image src="Payment/Frame (1).png" alt="lock" /> دفع آمن ومشفر
              </p>
            </div>

            <Button
              className="confirm-button"
              onClick={handlePayment}
              disabled={!stripe || !elements || loading}
            >
              {loading ? "جارٍ المعالجة..." : "تأكيد الدفع"}
            </Button>
            <Button className="cancel-button" onClick={() => navigate("/subscription")}>
              الإلغاء
            </Button>

            {errorMsg && <div className="text-danger mt-3">{errorMsg}</div>}
          </Col>
        </Row>
      </div>
    </Container>
  );
};

export default Payment;

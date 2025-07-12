import React, { useState, useEffect } from 'react';
import './Notification.css';
import { Container, Row, Col, Image ,Button,Card,Badge,Spinner} from 'react-bootstrap';


const getIcon = (type) => {
  switch (type) {
    case 'success': return <img src="Notification/div (1).svg"/>;
    case 'danger': return <img src="Notification/div (2).svg"/>;
    case 'info': return <img src="Notification/div (3).svg"/>;
    case 'reminder': return <img src="Notification/div (5).svg"/>;
    default: return <img src="Notification/div (5).svg"/>;
  }
};

const getVariant = (type) => {
  switch (type) {
    case 'success': return { border: '1px solid #BBF7D0' };
    case 'danger': return { border: '1px solid #FECACA' };
    case 'info': return { border: '1px solid #BFDBFE' };
    case 'reminder': return { border: '1px solid #E9D5FF' };
    default: return {};
  }
};


const Notification = () => {
   const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  //backend
 useEffect(() => {
    setLoading(true);
     setTimeout(() => {
      setNotifications([
        {
          id: 1,
          type: 'success',
          title: 'تهانينا! تم تحقق أهدافك المالـية',
          message: 'لقد نجحت في توفير 5000 ريال، وجهت "رحلة النفقات الذكية". استمر في التحدي!',
          text: ' انجاز ',
        },
        {
          id: 2,
          type: 'danger',
          title: 'تحذير! تجاوزت حد الميزانية',
          message: 'لقد تجاوزت ميزانية "الترفيه" بمبلغ 300 ريال هذا الشهر. راجع مصروفاتك.',
          text: ' تحذير ',
        },
        {
          id: 3,
          type: 'info',
          title: 'اقتراح لتوفير المال',
          message: 'توفير 200 ريال شهريًا عبر تقليل طلبات التوصيل والطبخ المنزلي في المثال.',
          text: ' اقتراح ',
        },
        {
          id: 4,
          type: 'success',
          title: 'ميزة جديدة مفتوحة!',
          message: 'حصلت على شارة "المدخر المحترف" لتوفير أول 1000 ريال في التطبيق.',
          text: ' انجاز ',
        },
        {
          id: 5,
          type: 'reminder',
          title: 'تذكير بمراجعة الميزانية الشهرية',
          message: 'قد حان وقت مراجعة ميزانيتك وتحديث أهدافك المالية للشهر القادم.',
          text: ' تذكير ',
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

return (
    <Container fluid className="notification-container d-flex justify-content-center align-items-center ">
      <Row className=" notification mt-5" >
       
          <Col xs="auto" className="text-center text-md-end">
          <h2 className="notification-title">الإشعارات</h2>
          <p className="notification-subtext">تابع آخر التحديثات والتنبيهات المهمة</p>
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


      <Row className='search'>
        <Col>
        <Button className='bt all'>الكل</Button>
        </Col>
          <Col>
        <Button className='bt all'>الإنجازات</Button>
        </Col>
          <Col>
        <Button className='bt all'>التحذيرات</Button>
        </Col>
          <Col>
        <Button className='bt all'>الاقتراحات</Button>
        </Col>
      </Row>



        <div className="container mt-4">
      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <>
          {notifications.map((notif) => (
            <Card key={notif.id} className="mb-3 notif" style={getVariant(notif.type)}>
              <Card.Body>
                <div className="d-flex align-items-start">
                  <div className="fs-4">{getIcon(notif.type)}</div>
                  <div className="mx-3">
                    <Card.Title className="mb-1"style={{
  fontFamily: 'Cairo',
  fontWeight: 400,
  fontStyle: 'normal',
  fontSize: '16px',
  lineHeight: '24px',
  letterSpacing: '0'
}}>
  {notif.title}</Card.Title>
                    <Card.Text className="mb-1" style={{
  fontFamily: 'Cairo, sans-serif',
  fontWeight: 400,
  fontStyle: 'normal',
  fontSize: '16px',
  lineHeight: '24px',
  letterSpacing: '0px',
  left:"260px",
  color:'#7B88A8'

}}
>{notif.message}</Card.Text>
<span className={`custom-badge ${notif.type}`}>{notif.text}</span>

                  </div>
                </div>
              </Card.Body>
            </Card>
          ))}
          <div className="text-center">
            <Button variant="" className="mt-2 load" >
              تحميل المزيد من الإشعارات
            </Button>
          </div>
        </>
      )}
    </div>
    </Container>
  );
};

export default Notification;

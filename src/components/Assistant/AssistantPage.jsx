import React, { useState } from 'react';
import { BotIcon, SendIcon, PaperclipIcon, TrendingUpIcon, DollarSignIcon, BarChartIcon, LockIcon } from 'lucide-react';
import UserAvatar from "../UI/UserAvatar.jsx";
import 'bootstrap/dist/css/bootstrap.min.css';
import './AssistantPage.css';

const AssistantPage = () => {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    {
      id: 1,
      type: 'bot',
      content: {
        text: 'مرحبا بك مع المساعد الذكي في ماي كاش! 👋',
        subText: 'كيف يمكنني مساعدتك اليوم؟'
      },
      time: '11:30 صباحاً'
    },
    {
      id: 2,
      type: 'user',
      content: {
        text: 'أريد نصائح لتوفير المال'
      },
      time: '11:32 صباحاً'
    },
    {
      id: 3,
      type: 'bot',
      content: {
        text: 'إليك أهم النصائح لتوفير المال:',
        list: [
          'ميزانية شهرية منظمة',
          'وفر 20% من راتبك',
          'تجنب المشتريات العاطفية'
        ],
        chart: {
          title: 'توزيع الوقت المالي:',
          items: [
            { label: 'المستلزمات', percentage: 50, color: 'purple' },
            { label: 'التوفير', percentage: 30, color: 'green' },
            { label: 'الترفيه', percentage: 20, color: 'red' }
          ]
        }
      },
      time: '11:33 صباحاً'
    }
  ]);

  const features = [
    {
      id: 1,
      icon: <LockIcon size={20} className="text-warning" />,
      title: 'كيف أوفر المال؟',
      color: 'bg-warning bg-opacity-10'
    },
    {
      id: 2,
      icon: <BarChartIcon size={20} className="text-success" />,
      title: 'خطة استثمار',
      color: 'bg-success bg-opacity-10'
    },
    {
      id: 3,
      icon: <TrendingUpIcon size={20} className="text-primary" />,
      title: 'تحليل مصروفاتي',
      color: 'bg-primary bg-opacity-10'
    },
    {
      id: 4,
      icon: <DollarSignIcon size={20} className="text-purple" />,
      title: 'نصائح توفير يومية',
      color: 'bg-purple bg-opacity-10'
    }
  ];

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      const newMessage = {
        id: chatHistory.length + 1,
        type: 'user',
        content: {
          text: message
        },
        time: new Date().toLocaleTimeString('ar-SA', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: true 
        })
      };
      setChatHistory(prev => [...prev, newMessage]);
      setMessage('');
      
      // Simulate bot response
      setTimeout(() => {
        const botResponse = {
          id: chatHistory.length + 2,
          type: 'bot',
          content: {
            text: 'شكراً لك! سأقوم بتحليل طلبك وتقديم النصائح المناسبة.'
          },
          time: new Date().toLocaleTimeString('ar-SA', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true 
          })
        };
        setChatHistory(prev => [...prev, botResponse]);
      }, 1000);
    }
  };

  const handleFeatureClick = (featureTitle) => {
    const featureMessage = {
      id: chatHistory.length + 1,
      type: 'user',
      content: {
        text: `أريد معلومات عن: ${featureTitle}`
      },
      time: new Date().toLocaleTimeString('ar-SA', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      })
    };
    setChatHistory(prev => [...prev, featureMessage]);
    
    // Simulate bot response for feature
    setTimeout(() => {
      const botResponse = {
        id: chatHistory.length + 2,
        type: 'bot',
        content: {
          text: `سأقدم لك معلومات مفصلة عن ${featureTitle}. دعني أحضر لك أفضل النصائح والاستراتيجيات.`
        },
        time: new Date().toLocaleTimeString('ar-SA', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: true 
        })
      };
      setChatHistory(prev => [...prev, botResponse]);
    }, 1000);
  };

  return (
    <div className="container mx-auto px-4 py-6 assistant-page">
      {/* Assistant Header */}
      <div className="text-center my-5">
        <div className="d-inline-flex align-items-center justify-content-center assistant-avatar mb-3">
          <BotIcon size={48} className="text-purple" />
        </div>
        <h1 className="assistant-title">المساعد الذكي</h1>
        <p className="assistant-subtitle">
          مساعدك الشخصي لإدارة التمويل والاستثمار الذكي
        </p>
      </div>

      {/* Assistant Features */}
      <div className="row mb-4">
        {features.map(feature => (
          <div key={feature.id} className="col-6 col-md-3 mb-3">
            <button 
              className={`feature-button ${feature.color} p-3 rounded-3 text-center w-100 h-100`}
              onClick={() => handleFeatureClick(feature.title)}
            >
              <div className="d-flex justify-content-center mb-2">
                {feature.icon}
              </div>
              <span className="feature-title">{feature.title}</span>
            </button>
          </div>
        ))}
      </div>

      {/* Chat Interface */}
      <div className="card chat-card mb-4">
        <div className="card-body p-4">
          <div className="chat-messages mb-4">
            {chatHistory.map(chat => (
              <div key={chat.id} className={`chat-message ${chat.type === 'user' ? 'user-message' : 'bot-message'} mb-4`}>
                {chat.type === 'bot' ? (
                  <div className="d-flex align-items-start">
                    <div className="bot-avatar me-3">
                      <BotIcon size={24} className="text-purple" />
                    </div>
                    <div className="flex-grow-1">
                      <div className="bot-bubble mb-2">
                        <p className="mb-1">{chat.content.text}</p>
                        {chat.content.subText && (
                          <p className="mb-0">{chat.content.subText}</p>
                        )}
                        {chat.content.list && (
                          <ul className="chat-list mb-0">
                            {chat.content.list.map((item, index) => (
                              <li key={index}>{item}</li>
                            ))}
                          </ul>
                        )}
                        {chat.content.chart && (
                          <div className="mt-3">
                            <p className="chart-title mb-2">{chat.content.chart.title}</p>
                            {chat.content.chart.items.map((item, index) => (
                              <div key={index} className="d-flex align-items-center mb-2">
                                <div className="chart-bar-container me-2">
                                  <div 
                                    className={`chart-bar bg-${item.color}`}
                                    style={{ width: `${item.percentage}%` }}
                                  ></div>
                                </div>
                                <span className="chart-label">{item.label}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <span className="chat-time">{chat.time}</span>
                    </div>
                  </div>
                ) : (
                  <div className="d-flex align-items-start justify-content-end">
                    <div className="flex-grow-1">
                      <div className="user-bubble mb-2">
                        <p className="mb-0">{chat.content.text}</p>
                      </div>
                      <span className="chat-time d-block text-start">{chat.time}</span>
                    </div>
                    <UserAvatar />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <form onSubmit={handleSendMessage} className="position-relative">
            <input 
              type="text" 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="اكتب رسالتك هنا..." 
              className="form-control chat-input pe-5 ps-5" 
            />
            <div className="chat-input-buttons">
              <button type="button" className="btn btn-link text-muted attachment-btn">
                <PaperclipIcon size={20} />
              </button>
              <button type="submit" className="btn btn-primary send-btn">
                <SendIcon size={18} />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AssistantPage; 
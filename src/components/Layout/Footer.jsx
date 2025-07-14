import React from 'react';
import { Link } from 'react-router-dom';
import { Linkedin, Instagram, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white py-8 mt-12 border-t border-gray-200">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-right">
            <h3 className="text-lg font-semibold mb-4">عن التطبيق</h3>
            <p className="text-gray-600 text-sm">
              ماي كاش هو تطبيقك الذكي لإدارة الأموال وتحقيق الأهداف المالية
              بطريقة سهلة وممتعة
            </p>
          </div>
          <div className="text-right">
            <h3 className="text-lg font-semibold mb-4">روابط سريعة</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 hover:text-purple-600 text-sm">
                  الصفحة الرئيسية
                </Link>
              </li>
              <li>
                <Link to="/assistant" className="text-gray-600 hover:text-purple-600 text-sm">
                  المساعد الذكي
                </Link>
              </li>
              <li>
                <Link to="#" className="text-gray-600 hover:text-purple-600 text-sm">
                  التقارير
                </Link>
              </li>
              <li>
                <Link to="#" className="text-gray-600 hover:text-purple-600 text-sm">
                  الاشتراكات
                </Link>
              </li>
            </ul>
          </div>
          <div className="text-right">
            <h3 className="text-lg font-semibold mb-4">تواصل معنا</h3>
            <div className="flex space-x-4 space-x-reverse justify-end">
              <a href="#" className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-purple-100 hover:text-purple-600">
                <Linkedin size={18} />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-purple-100 hover:text-purple-600">
                <Instagram size={18} />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-purple-100 hover:text-purple-600">
                <Twitter size={18} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 
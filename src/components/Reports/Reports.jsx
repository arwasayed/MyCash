import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Reports.css";
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip as ChartTooltip,
  Legend as ChartLegend,
  Title,
} from "chart.js";
import DownloadIcon from "./svg6.jsx";
import FilterIcon from "./FilterIcon.jsx";
import ChartDataLabels from "chartjs-plugin-datalabels";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Label,
} from "recharts";
import DownloadPdfIcon from "./DownloadPdfIcon";
import DownloadExcelIcon from "./DownloadExcelIcon";

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ChartTooltip,
  ChartLegend,
  Title,
  ChartDataLabels
);

const Reports = () => {
  const [loading, setLoading] = useState(true);
  const [financialData, setFinancialData] = useState(null);
  const [filter, setFilter] = useState({
    period: "this-month",
    category: "all",
    transactionType: "all"
  });

  // Get user data from localStorage
  const userData = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  // Fetch financial data from backend
  const fetchFinancialData = async () => {
    try {
      if (!userData || !token) {
        console.error("User not authenticated");
        return;
      }

      setLoading(true);
      const response = await axios.get("http://localhost:3000/api/financial-report", {
        params: {
          user_id: userData.id,
          ...filter
        },
        headers: {
          Authorization: `${token}`
        }
      });
      setFinancialData(response.data);
    } catch (error) {
      console.error("Error fetching financial data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFinancialData();
  }, [filter]);

  // Prepare chart data from backend response
  const prepareChartData = () => {
    if (!financialData) return { pieData: [], lineData: [] };

    // Pie chart data (expenses by category)
    const pieData = Object.entries(financialData.summary.expenses_by_category)
      .map(([name, value]) => ({
        name,
        value,
        color: getCategoryColor(name)
      }));

    // Line chart data (monthly expenses)
    const monthlyExpenses = {};
    financialData.summary.transaction_history
      .filter(tx => tx.type === "expense")
      .forEach(tx => {
        const month = new Date(tx.timestamp).toLocaleString('ar-EG', { month: 'long' });
        monthlyExpenses[month] = (monthlyExpenses[month] || 0) + tx.amount;
      });

    const lineData = Object.entries(monthlyExpenses)
      .map(([name, value]) => ({ name, value }));

    return { pieData, lineData };
  };

  // Get color for each category
  const getCategoryColor = (category) => {
    const colors = {
      "المواصلات": "#20bf6b",
      "الترفيه": "#ff6f61",
      "طعام وشراب": "#6C5DD3",
      "فواتير": "#f7b731",
      "أخرى": "#7b7b7b"
    };
    return colors[category] || "#" + Math.floor(Math.random()*16777215).toString(16);
  };

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter(prev => ({ ...prev, [name]: value }));
  };

  // Download PDF report
  const handleDownloadPDF = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/financial-report/pdf", {
        params: { 
          user_id: userData.id,
          ...filter 
        },
        headers: {
          Authorization: `${token}`
        },
        responseType: "blob"
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `financial-report-${new Date().toISOString().split('T')[0]}.pdf`);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error("Error downloading PDF:", error);
      alert("حدث خطأ أثناء تحميل ملف PDF");
    }
  };

  // Download Excel report
  const handleDownloadExcel = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/financial-report/excel", {
        params: { 
          user_id: userData.id,
          ...filter 
        },
        headers: {
          Authorization: `${token}`
        },
        responseType: "blob"
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `financial-report-${new Date().toISOString().split('T')[0]}.xlsx`);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error("Error downloading Excel:", error);
      alert("حدث خطأ أثناء تحميل ملف Excel");
    }
  };

  // Custom label for pie chart
  const renderCustomizedLabel = ({ cx, cy, midAngle, outerRadius, index }) => {
    const RADIAN = Math.PI / 180;
    const radius = outerRadius + 60;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="#222"
        fontSize={15}
        fontWeight="bold"
        fontFamily="Cairo, sans-serif"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {financialData?.summary?.expenses_by_category 
          ? Object.keys(financialData.summary.expenses_by_category)[index]
          : ''}
      </text>
    );
  };

  const { pieData, lineData } = prepareChartData();

  // Authentication check
  if (!userData || !token) {
    return (
      <div className="text-center py-5">
        <h4>يجب تسجيل الدخول لعرض التقارير</h4>
        <a href="/login" className="btn btn-primary mt-3">
          الانتقال إلى صفحة تسجيل الدخول
        </a>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">جار التحميل...</span>
        </div>
        <p className="mt-3">جارٍ تحميل البيانات المالية...</p>
      </div>
    );
  }

  if (!financialData) {
    return (
      <div className="text-center py-5">
        <h4 className="text-danger">حدث خطأ في تحميل البيانات</h4>
        <button 
          className="btn btn-primary mt-3"
          onClick={fetchFinancialData}
        >
          محاولة مرة أخرى
        </button>
      </div>
    );
  }

  return (
    <div className="reports-section" dir="rtl">
      {/* Hero Section */}
      <div className="bg-gradient">
        <div className="reports-hero p-4 mb-4">
          <div className="container">
            <div className="row align-items-center justify-content-center">
              <div className="col-md-8 text-md-end text-center">
                <h2 className="reports-title mb-2 text-center">
                  تقاريرك المالية
                </h2>
                <p className="reports-subtitle mb-4">
                  احصل على رؤى شاملة حول مصروفاتك و نفقاتك مع تقارير تفاعلية مفصلة
                </p>
                <div className="d-flex justify-content-center gap-2">
                  <button 
                    className="btn btn-download d-flex align-items-center gap-2"
                    onClick={handleDownloadPDF}
                  >
                    <DownloadIcon
                      style={{
                        color: "#6C5DD3",
                        width: "18px",
                        height: "18px",
                      }}
                    />
                    تحميل التقرير
                  </button>
                  <button className="btn btn-outline-light">
                    مشاركة التقرير
                  </button>
                </div>
              </div>
              <div className="col-md-4 d-flex justify-content-center mb-3 mb-md-0">
                <div className="reports-img-card d-flex align-items-center justify-content-center">
                  <img
                    src="/public/Reports/Images/img.png"
                    alt="تقارير مالية"
                    className="reports-hero-img img-fluid"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="mb-4">
        <div className="reports-filter card">
          <div className="row align-items-end gy-3">
            <div className="col-12 mb-3 text-center">
              <span className="fw-bold" style={{ fontSize: "1.2rem" }}>
                فلتر التقارير
              </span>
            </div>
            
            <div className="col-md-3 col-12">
              <label className="form-label">الفترة الزمنية</label>
              <select 
                className="form-select"
                name="period"
                value={filter.period}
                onChange={handleFilterChange}
              >
                <option value="this-month">هذا الشهر</option>
                <option value="last-month">الشهر الماضي</option>
                <option value="this-year">هذا العام</option>
              </select>
            </div>
            
            <div className="col-md-3 col-12">
              <label className="form-label">التصنيف</label>
              <select 
                className="form-select"
                name="category"
                value={filter.category}
                onChange={handleFilterChange}
              >
                <option value="all">جميع التصنيفات</option>
                <option value="expenses">مصروفات</option>
                <option value="income">دخل</option>
                {Object.keys(financialData.summary.expenses_by_category).map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            
            <div className="col-md-3 col-12">
              <label className="form-label">نوع المعاملة</label>
              <select 
                className="form-select"
                name="transactionType"
                value={filter.transactionType}
                onChange={handleFilterChange}
              >
                <option value="all">الكل</option>
                <option value="cash">نقدي</option>
                <option value="card">بطاقة</option>
              </select>
            </div>
            
            <div className="col-md-3 col-12 d-flex align-items-end justify-content-center justify-content-md-start h-100">
              <button 
                className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2"
                onClick={fetchFinancialData}
              >
                تطبيق الفلتر
                <FilterIcon style={{ color: "#fff", width: "18px", height: "18px" }} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="mb-4">
        <div className="row reports-charts-row g-4">
          <div className="col-md-6">
            <div className="card h-100 p-0">
              <h6
                className="text-center"
                style={{
                  fontWeight: 600,
                  fontSize: "1.15rem",
                  margin: "0 1.5rem 1.5rem 0",
                }}
              >
                اتجاه المصروفات الشهرية
              </h6>
              <div
                style={{
                  height: 300,
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart
                    data={lineData}
                    margin={{ top: 30, right: 20, left: 10, bottom: 30 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis
                      dataKey="name"
                      fontFamily="Cairo, Arial, sans-serif"
                      fontSize={16}
                      stroke="#222"
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      fontFamily="Cairo, Arial, sans-serif"
                      fontSize={16}
                      stroke="#222"
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(v) => `${v.toLocaleString('ar-EG')}`}
                      tickMargin={12}
                    >
                      <Label
                        value="المبلغ (ج.م)"
                        angle={-90}
                        position="insideLeft"
                        style={{
                          textAnchor: "middle",
                          fontSize: 15,
                          fill: "#888",
                          fontFamily: "Cairo, Arial, sans-serif",
                        }}
                      />
                    </YAxis>
                    <Tooltip 
                      formatter={(value) => `${value.toLocaleString('ar-EG')} ج.م`}
                      labelFormatter={(label) => `الشهر: ${label}`}
                    />
                    <Legend
                      verticalAlign="bottom"
                      iconType="circle"
                      align="center"
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      name="المصروفات"
                      stroke="#6C5DD3"
                      strokeWidth={3}
                      dot={{
                        r: 5,
                        stroke: "#6C5DD3",
                        strokeWidth: 2,
                        fill: "#fff",
                      }}
                      activeDot={{ r: 7 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card h-100 p-0">
              <h6
                className="text-end"
                style={{
                  fontWeight: 600,
                  fontSize: "1.15rem",
                  margin: "0 1.5rem 1.5rem 0",
                }}
              >
                توزيع المصروفات حسب التصنيف
              </h6>
              <div
                style={{
                  height: 270,
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ResponsiveContainer width="100%" height={270}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={renderCustomizedLabel}
                      outerRadius={90}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => `${value.toLocaleString('ar-EG')} ج.م`}
                      labelFormatter={(label) => `التصنيف: ${label}`}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Section */}
      <div className="quick-stats-section py-5">
        <h3 className="quick-stats-title text-center mb-4">إحصائيات سريعة</h3>
        <div className="mb-4">
          <div className="row g-4 justify-content-center">
            {/* Card 1 - Total Expenses */}
            <div className="col-12 col-md-3">
              <div className="quick-stat-card">
                <div
                  className="quick-stat-icon"
                  style={{ background: "rgba(108,93,211,0.12)" }}
                >
                  <img src="/Reports/Icons/svg(4).svg" alt="إجمالي المصروفات" />
                </div>
                <div className="quick-stat-label">إجمالي المصروفات</div>
                <div className="quick-stat-value text-purple">
                  {financialData.summary.total_expenses_made.toLocaleString('ar-EG')} ج.م
                </div>
                <div className="quick-stat-desc">
                  {financialData.summary.total_income_received > 0 
                    ? `${Math.round(
                        (financialData.summary.total_expenses_made / 
                        financialData.summary.total_income_received) * 100
                      )}% من إجمالي الدخل` 
                    : '0% من إجمالي الدخل'}
                </div>
              </div>
            </div>

            {/* Card 2 - Daily Average */}
            <div className="col-12 col-md-3">
              <div className="quick-stat-card">
                <div
                  className="quick-stat-icon"
                  style={{ background: "rgba(32,191,107,0.12)" }}
                >
                  <img src="/Reports/Icons/svg(3).svg" alt="متوسط يومي" />
                </div>
                <div className="quick-stat-label">متوسط يومي</div>
                <div className="quick-stat-value text-success">
                  {Math.round(financialData.summary.total_expenses_made / 30).toLocaleString('ar-EG')} ج.م
                </div>
                <div className="quick-stat-desc">
                  {financialData.summary.total_expenses_made > 0 
                    ? 'متوسط المصروفات اليومية' 
                    : 'لا توجد مصروفات'}
                </div>
              </div>
            </div>

            {/* Card 3 - Top Category */}
            <div className="col-12 col-md-3">
              <div className="quick-stat-card">
                <div
                  className="quick-stat-icon"
                  style={{ background: "rgba(255,99,71,0.12)" }}
                >
                  <img src="/Reports/Icons/svg(2).svg" alt="أعلى تصنيف" />
                </div>
                <div className="quick-stat-label">أعلى تصنيف</div>
                <div className="quick-stat-value text-danger">
                  {Object.keys(financialData.summary.expenses_by_category).length > 0
                    ? Object.entries(financialData.summary.expenses_by_category)
                        .sort((a, b) => b[1] - a[1])[0][0]
                    : "لا يوجد بيانات"}
                </div>
                <div className="quick-stat-desc">
                  {Object.keys(financialData.summary.expenses_by_category).length > 0
                    ? `${Object.entries(financialData.summary.expenses_by_category)
                        .sort((a, b) => b[1] - a[1])[0][1].toLocaleString('ar-EG')} ج.م`
                    : ''}
                </div>
              </div>
            </div>

            {/* Card 4 - Current Balance */}
            <div className="col-12 col-md-3">
              <div className="quick-stat-card">
                <div
                  className="quick-stat-icon"
                  style={{ background: "rgba(108,93,211,0.12)" }}
                >
                  <img src="/Reports/Icons/svg.svg" alt="الرصيد الحالي" />
                </div>
                <div className="quick-stat-label">الرصيد الحالي</div>
                <div className="quick-stat-value text-purple">
                  {financialData.summary.current_balance.toLocaleString('ar-EG')} ج.م
                </div>
                <div className="quick-stat-desc">
                  آخر تحديث: {new Date(financialData.summary.last_transaction_date).toLocaleString('ar-EG')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Download Section */}
      <div className="download-section my-5 d-flex justify-content-center">
        <div className="download-card card p-4 text-center">
          <div className="d-flex flex-column align-items-center w-100">
            <h4 className="download-title mb-2">تحميل التقرير المفصل</h4>
            <p className="download-desc">
              احصل على تقرير PDF أو Excel يحتوي على جميع البيانات والرسوم البيانية
            </p>
            <div className="d-flex justify-content-center gap-3 flex-wrap">
              <button 
                className="btn btn-purple d-flex align-items-center gap-2 px-4 py-2"
                onClick={handleDownloadPDF}
                disabled={loading}
              >
                <DownloadPdfIcon className="me-2" />
                تحميل PDF
              </button>
              <button 
                className="btn btn-green d-flex align-items-center gap-2 px-4 py-2"
                onClick={handleDownloadExcel}
                disabled={loading}
              >
                <DownloadExcelIcon className="me-2" />
                تحميل Excel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;

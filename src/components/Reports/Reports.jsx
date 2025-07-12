import React from "react";
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

const stats = [
  {
    icon: "/public/Reports/Icons/svg(1).svg",
    label: "إجمالي المصروفات",
    value: "2,250 ج.م",
  },
  {
    icon: "/public/Reports/Icons/svg(2).svg",
    label: "أعلى تصنيف",
    value: "شراء ملابس",
  },
  {
    icon: "/public/Reports/Icons/svg(3).svg",
    label: "عدد المعاملات",
    value: "19 عملية",
  },
  {
    icon: "/public/Reports/Icons/svg(4).svg",
    label: "إجمالي الدخل",
    value: "12,400 ج.م",
  },
];

const pieData = {
  labels: ["طعام وشراب", "مواصلات", "ترفيه", "فواتير", "أخرى"],
  datasets: [
    {
      data: [300, 220, 180, 140, 80],
      backgroundColor: ["#6C5DD3", "#20bf6b", "#ff6f61", "#f7b731", "#7b7b7b"],
      borderWidth: 0,
    },
  ],
};

const pieOptions = {
  plugins: {
    legend: { display: false },
    datalabels: {
      color: "#222",
      font: { size: 15, weight: 600, family: "Cairo, sans-serif" },
      align: "outside",
      anchor: "end",
      offset: 20,
      clamp: true,
      textAlign: "center",
      display: true,
      formatter: (value, context) =>
        context.chart.data.labels[context.dataIndex],
    },
    tooltip: {
      callbacks: {
        label: function (context) {
          return context.label + ": " + context.parsed + " ج.م";
        },
      },
    },
  },
  layout: {
    padding: 0,
  },
  responsive: true,
  maintainAspectRatio: false,
};

const lineData = {
  labels: ["يناير", "فبراير", "مارس", "ابريل", "مايو", "يونيو"],
  datasets: [
    {
      label: "المصروفات الشهرية",
      data: [1200, 900, 1400, 1100, 1500, 1250],
      fill: false,
      borderColor: "#6c5dd3",
      tension: 0.4,
    },
  ],
};

const pieDataRecharts = [
  { name: "طعام وشراب", value: 300, color: "#6C5DD3" },
  { name: "مواصلات", value: 220, color: "#20bf6b" },
  { name: "ترفيه", value: 180, color: "#ff6f61" },
  { name: "فواتير", value: 140, color: "#f7b731" },
  { name: "أخرى", value: 80, color: "#7b7b7b" },
];

const lineDataRecharts = [
  { name: "يناير", value: 10000 },
  { name: "فبراير", value: 12000 },
  { name: "مارس", value: 8000 },
  { name: "ابريل", value: 15500 },
  { name: "مايو", value: 11000 },
  { name: "يونيو", value: 12500 },
];

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
      {pieDataRecharts[index].name}
    </text>
  );
};

const Reports = () => {
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
                  احصل على رؤى شاملة حول مصروفاتك و نفقاتك مع تقارير تفاعلية
                  مفصلة
                </p>
                <div className="d-flex justify-content-center gap-2">
                  <button className="btn btn-download d-flex align-items-center gap-2">
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
      <div className="container mb-4">
        <div className="reports-filter card">
          <div className="row align-items-end gy-3">
            <div className="col-12 mb-3 text-center">
              <span className="fw-bold" style={{ fontSize: "1.2rem" }}>
                فلتر التقارير
              </span>
            </div>
            <div className="col-md-3 col-12">
              <label className="form-label">الفترة الزمنية</label>
              <select className="form-select">
                <option>هذا الشهر</option>
                <option>الشهر الماضي</option>
                <option>هذا العام</option>
              </select>
            </div>
            <div className="col-md-3 col-12">
              <label className="form-label">التصنيف</label>
              <select className="form-select">
                <option>جميع التصنيفات</option>
                <option>مصروفات</option>
                <option>دخل</option>
              </select>
            </div>
            <div className="col-md-3 col-12">
              <label className="form-label">نوع المعاملة</label>
              <select className="form-select">
                <option>الكل</option>
                <option>نقدي</option>
                <option>بطاقة</option>
              </select>
            </div>
            <div className="col-md-3 col-12 d-flex align-items-end justify-content-center justify-content-md-start">
              <button className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2">
                تطبيق الفلتر
                <FilterIcon
                  style={{ color: "#fff", width: "18px", height: "18px" }}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="container mb-4">
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
                    data={lineDataRecharts}
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
                      tickFormatter={(v) => `${(v / 1000).toFixed(1)}k`}
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
                    <Tooltip formatter={(v) => `${v} ج.م`} />
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
                      data={pieDataRecharts}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={renderCustomizedLabel}
                      outerRadius={90}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieDataRecharts.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
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
        <div className="container">
          <div className="row g-4 justify-content-center">
            {/* Card 1 */}
            <div className="col-12 col-md-3">
              <div className="quick-stat-card">
                <div
                  className="quick-stat-icon"
                  style={{ background: "rgba(108,93,211,0.12)" }}
                >
                  <img src="/Reports/Icons/svg(4).svg" alt="إجمالي المدخرات" />
                </div>
                <div className="quick-stat-label">إجمالي المصروفات</div>
                <div className="quick-stat-value text-purple">12,450 ج.م</div>
                <div className="quick-stat-desc">5% من الشهر الماضي</div>
              </div>
            </div>
            {/* Card 2 */}

            <div className="col-12 col-md-3">
              <div className="quick-stat-card">
                <div
                  className="quick-stat-icon"
                  style={{ background: "rgba(32,191,107,0.12)" }}
                >
                  <img src="/Reports/Icons/svg(3).svg" alt="متوسط يومي" />
                </div>
                <div className="quick-stat-label">متوسط يومي</div>
                <div className="quick-stat-value text-success">415 ج.م</div>
                <div className="quick-stat-desc">2% من الشهر الماضي</div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="col-12 col-md-3">
              <div className="quick-stat-card">
                <div
                  className="quick-stat-icon"
                  style={{ background: "rgba(255,99,71,0.12)" }}
                >
                  <img src="/Reports/Icons/svg(2).svg" alt="أعلى تصنيف" />
                </div>
                <div className="quick-stat-label">أعلى تصنيف</div>
                <div className="quick-stat-value text-danger">طعام وشراب</div>
                <div className="quick-stat-desc">34% 4,200 ج.م</div>
              </div>
            </div>
            {/* Card 4 */}
            <div className="col-12 col-md-3">
              <div className="quick-stat-card">
                <div
                  className="quick-stat-icon"
                  style={{ background: "rgba(108,93,211,0.12)" }}
                >
                  <img src="/Reports/Icons/svg.svg" alt="المصروفات" />
                </div>
                <div className="quick-stat-label">المدخرات</div>
                <div className="quick-stat-value text-purple">2,850 ج.م</div>
                <div className="quick-stat-desc">12% من الشهر الماضي</div>
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
              احصل على تقرير PDF شامل يحتوي على جميع البيانات والرسوم البيانية
            </p>
            <div className="d-flex justify-content-center gap-3 flex-wrap">
              <button className="btn btn-purple d-flex align-items-center gap-2 px-4 py-2">
                <DownloadPdfIcon className="me-2" />
                تحميل PDF
              </button>
              <button className="btn btn-green d-flex align-items-center gap-2 px-4 py-2">
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

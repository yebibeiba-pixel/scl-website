import { useState, useEffect } from "react";
import { trpc } from "../lib/trpc";

export default function SimpleAdmin() {
  const [token, setToken] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!token) {
      setError("الرجاء إدخال رمز الوصول");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const data = await trpc.registrations.listWithToken.query({ token });
      setRegistrations(data);
      setIsAuthenticated(true);
      localStorage.setItem("admin_token", token);
    } catch (err: any) {
      setError("رمز الوصول غير صحيح");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadRegistrations = async () => {
    const savedToken = localStorage.getItem("admin_token");
    if (!savedToken) return;

    setLoading(true);
    try {
      const data = await trpc.registrations.listWithToken.query({ token: savedToken });
      setRegistrations(data);
      setIsAuthenticated(true);
      setToken(savedToken);
    } catch (err) {
      localStorage.removeItem("admin_token");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRegistrations();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    setIsAuthenticated(false);
    setToken("");
    setRegistrations([]);
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: "قيد الانتظار",
      contacted: "تم الاتصال",
      scheduled: "تم الجدولة",
      in_progress: "قيد التنفيذ",
      completed: "مكتمل",
      cancelled: "ملغى",
    };
    return labels[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-800",
      contacted: "bg-blue-100 text-blue-800",
      scheduled: "bg-purple-100 text-purple-800",
      in_progress: "bg-orange-100 text-orange-800",
      completed: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getPackageLabel = (packageType: string) => {
    const labels: Record<string, string> = {
      "100mbps": "100 ميغابت",
      "200mbps": "200 ميغابت",
      "500mbps": "500 ميغابت",
    };
    return labels[packageType] || packageType;
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4" dir="rtl">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              لوحة الإدارة السريعة
            </h1>
            <p className="text-gray-600">
              أدخل رمز الوصول للاطلاع على الطلبات
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                رمز الوصول
              </label>
              <input
                type="password"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleLogin()}
                placeholder="أدخل رمز الوصول"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {loading ? "جاري التحميل..." : "دخول"}
            </button>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>ملاحظة:</strong> رمز الوصول الافتراضي هو: <code className="bg-blue-100 px-2 py-1 rounded">scl2024admin</code>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">
            لوحة إدارة الطلبات
          </h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            تسجيل الخروج
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              جميع الطلبات ({registrations.length})
            </h2>
          </div>

          {loading ? (
            <div className="p-8 text-center text-gray-500">
              جاري التحميل...
            </div>
          ) : registrations.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              لا توجد طلبات حالياً
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      رقم التتبع
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      الاسم
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      الهاتف
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      البريد
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      الباقة
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      الحالة
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      التاريخ
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {registrations.map((reg) => (
                    <tr key={reg.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                        {reg.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {reg.fullName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <a href={`tel:${reg.phoneNumber}`} className="text-blue-600 hover:underline">
                          {reg.phoneNumber}
                        </a>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {reg.email ? (
                          <a href={`mailto:${reg.email}`} className="text-blue-600 hover:underline">
                            {reg.email}
                          </a>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {getPackageLabel(reg.packageType)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(reg.status)}`}>
                          {getStatusLabel(reg.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(reg.createdAt).toLocaleString("ar-EG")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="mt-6 bg-blue-50 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">ملاحظات:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• يمكنك الاتصال بالعملاء مباشرة من خلال النقر على رقم الهاتف</li>
            <li>• لتحديث حالة الطلب، استخدم لوحة التحكم الكاملة على /admin</li>
            <li>• يتم تحديث القائمة تلقائياً عند تحديث الصفحة</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

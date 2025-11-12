import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { CheckCircle2, Clock, Phone, User, Calendar, MapPin, Package } from "lucide-react";

export default function TrackOrder() {
  const [trackingId, setTrackingId] = useState("");
  const [searchId, setSearchId] = useState("");
  
  // Get order ID from URL query parameter
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const idFromUrl = params.get('id');
    if (idFromUrl) {
      setTrackingId(idFromUrl);
      setSearchId(idFromUrl);
    }
  }, []);

  const { data: registration, isLoading, error } = trpc.registrations.getById.useQuery(
    { id: searchId },
    { enabled: !!searchId }
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchId(trackingId);
  };

  const getStatusInfo = (status: string) => {
    const statusMap = {
      pending: {
        label: "قيد المراجعة",
        color: "bg-yellow-100 text-yellow-800 border-yellow-300",
        icon: Clock,
        description: "تم استلام طلبك وهو قيد المراجعة من قبل فريقنا",
      },
      contacted: {
        label: "تم الاتصال",
        color: "bg-blue-100 text-blue-800 border-blue-300",
        icon: Phone,
        description: "تم الاتصال بك لتأكيد البيانات",
      },
      scheduled: {
        label: "تم جدولة الموعد",
        color: "bg-purple-100 text-purple-800 border-purple-300",
        icon: Calendar,
        description: "تم تحديد موعد التركيب",
      },
      in_progress: {
        label: "جاري التركيب",
        color: "bg-orange-100 text-orange-800 border-orange-300",
        icon: User,
        description: "الفني في طريقه إليك أو يقوم بالتركيب الآن",
      },
      completed: {
        label: "مكتمل",
        color: "bg-green-100 text-green-800 border-green-300",
        icon: CheckCircle2,
        description: "تم تركيب الخدمة بنجاح! مرحباً بك في عائلة مووف موريتل عبر SCL Communication",
      },
      cancelled: {
        label: "ملغي",
        color: "bg-red-100 text-red-800 border-red-300",
        icon: Clock,
        description: "تم إلغاء الطلب",
      },
    };
    return statusMap[status as keyof typeof statusMap] || statusMap.pending;
  };

  const getPackageLabel = (packageType: string) => {
    const packageMap = {
      "100mbps": "باقة 100 ميغابت/ثانية - 1500 أوقية/شهر",
      "200mbps": "باقة 200 ميغابت/ثانية - 2500 أوقية/شهر",
      "500mbps": "باقة 500 ميغابت/ثانية - حسب الطلب",
    };
    return packageMap[packageType as keyof typeof packageMap] || packageType;
  };

  const getProgressSteps = (currentStatus: string) => {
    const steps = [
      { id: "pending", label: "قيد المراجعة" },
      { id: "contacted", label: "تم الاتصال" },
      { id: "scheduled", label: "جدولة الموعد" },
      { id: "in_progress", label: "جاري التركيب" },
      { id: "completed", label: "مكتمل" },
    ];

    const statusOrder = ["pending", "contacted", "scheduled", "in_progress", "completed"];
    const currentIndex = statusOrder.indexOf(currentStatus);

    return steps.map((step, index) => ({
      ...step,
      completed: index <= currentIndex,
      current: index === currentIndex,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white" dir="rtl">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex flex-col">
            <img src="/scl-logo.png" alt="SCL Communication" className="h-12" />
            <p className="text-xs text-gray-600 mt-1">تتبع طلبك - SCL Communication</p>
          </div>
          <Button variant="outline" onClick={() => window.location.href = "/"}>
            العودة للرئيسية
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Search Form */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl">تتبع حالة طلبك</CardTitle>
              <CardDescription>أدخل رقم الطلب الذي تم إرساله لك عبر الرسالة النصية أو البريد الإلكتروني</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSearch} className="flex gap-4">
                <div className="flex-1">
                  <Label htmlFor="trackingId" className="sr-only">رقم الطلب</Label>
                  <Input
                    id="trackingId"
                    placeholder="مثال: reg_1234567890_abc123"
                    value={trackingId}
                    onChange={(e) => setTrackingId(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
                  {isLoading ? "جاري البحث..." : "تتبع الطلب"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Error State */}
          {error && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="pt-6">
                <p className="text-red-800 text-center">
                  لم يتم العثور على الطلب. يرجى التحقق من رقم الطلب والمحاولة مرة أخرى.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Registration Details */}
          {registration && (
            <>
              {/* Status Card */}
              <Card className="mb-8">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>حالة الطلب</CardTitle>
                      <CardDescription>رقم الطلب: {registration.id}</CardDescription>
                    </div>
                    <Badge className={`${getStatusInfo(registration.status).color} border text-base px-4 py-2`}>
                      {getStatusInfo(registration.status).label}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-6">{getStatusInfo(registration.status).description}</p>

                  {/* Progress Steps */}
                  {registration.status !== "cancelled" && (
                    <div className="relative">
                      <div className="flex justify-between mb-2">
                        {getProgressSteps(registration.status).map((step, index) => (
                          <div key={step.id} className="flex flex-col items-center flex-1">
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                                step.completed
                                  ? "bg-blue-600 text-white"
                                  : "bg-gray-200 text-gray-500"
                              }`}
                            >
                              {step.completed ? (
                                <CheckCircle2 className="w-6 h-6" />
                              ) : (
                                <span className="text-sm font-bold">{index + 1}</span>
                              )}
                            </div>
                            <span className={`text-xs text-center ${step.completed ? "text-blue-900 font-semibold" : "text-gray-500"}`}>
                              {step.label}
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 -z-10" style={{ margin: "0 5%" }}>
                        <div
                          className="h-full bg-blue-600 transition-all duration-500"
                          style={{
                            width: `${(getProgressSteps(registration.status).filter(s => s.completed).length - 1) * 25}%`,
                          }}
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Details Grid */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {/* Customer Info */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <User className="w-5 h-5 text-blue-600" />
                      معلومات العميل
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">الاسم</p>
                      <p className="font-semibold">{registration.fullName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">رقم الهاتف</p>
                      <p className="font-semibold">{registration.phoneNumber}</p>
                    </div>
                    {registration.email && (
                      <div>
                        <p className="text-sm text-gray-600">البريد الإلكتروني</p>
                        <p className="font-semibold">{registration.email}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Package Info */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Package className="w-5 h-5 text-orange-600" />
                      تفاصيل الباقة
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">الباقة المختارة</p>
                      <p className="font-semibold">{getPackageLabel(registration.packageType)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">تاريخ التسجيل</p>
                      <p className="font-semibold">
                        {registration.createdAt ? new Date(registration.createdAt).toLocaleDateString('ar-MR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        }) : '-'}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Address & Location */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-green-600" />
                    العنوان والموقع
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {registration.latitude && registration.longitude && (
                    <a
                      href={`https://www.google.com/maps?q=${registration.latitude},${registration.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline inline-flex items-center gap-2"
                    >
                      <MapPin className="w-4 h-4" />
                      عرض الموقع على الخريطة
                    </a>
                  )}
                </CardContent>
              </Card>

              {/* Scheduled Date & Technician */}
              {(registration.scheduledDate || registration.technicianName) && (
                <Card className="mb-8 border-blue-200 bg-blue-50">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-blue-600" />
                      معلومات الموعد
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {registration.scheduledDate && (
                      <div>
                        <p className="text-sm text-gray-600">موعد التركيب</p>
                        <p className="font-semibold text-lg text-blue-900">
                          {new Date(registration.scheduledDate).toLocaleDateString('ar-MR', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    )}
                    {registration.technicianName && (
                      <div>
                        <p className="text-sm text-gray-600">الفني المسؤول</p>
                        <p className="font-semibold">{registration.technicianName}</p>
                        {registration.technicianPhone && (
                          <a href={`tel:${registration.technicianPhone}`} className="text-blue-600 hover:underline">
                            {registration.technicianPhone}
                          </a>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Contact Support */}
              <Card className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                <CardContent className="pt-6">
                  <h3 className="text-xl font-bold mb-2">هل لديك استفسار؟</h3>
                  <p className="mb-4">تواصل معنا على الرقم التالي:</p>
                  <a
                    href="tel:0022244292222"
                    className="inline-flex items-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-lg font-bold hover:bg-blue-50 transition"
                  >
                    <Phone className="w-5 h-5" />
                    0022244292222
                  </a>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
}


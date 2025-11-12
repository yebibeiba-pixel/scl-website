import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, CheckCircle2, Info } from "lucide-react";
import { useState } from "react";

export default function Coverage() {
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  // المدن والمناطق المغطاة
  const coverageAreas = [
    {
      id: "nouakchott",
      name: "نواكشوط",
      nameAr: "نواكشوط",
      type: "capital",
      coverage: "تغطية كاملة",
      neighborhoods: [
        "تفرغ زينة",
        "كرفور",
        "السبخة",
        "تيارت",
        "الميناء",
        "عرفات",
        "الرياض",
        "توجنين",
        "تيفريت",
        "الخيمة"
      ],
      lat: 18.0735,
      lng: -15.9582,
      status: "available"
    },
    {
      id: "nouadhibou",
      name: "نواذيبو",
      nameAr: "نواذيبو",
      type: "city",
      coverage: "تغطية واسعة",
      neighborhoods: [
        "المركز",
        "نميرة",
        "الميناء",
        "المنطقة الحرة"
      ],
      lat: 20.9318,
      lng: -17.0347,
      status: "available"
    },
    {
      id: "rosso",
      name: "روصو",
      nameAr: "روصو",
      type: "city",
      coverage: "تغطية محدودة",
      neighborhoods: ["المركز", "الميناء"],
      lat: 16.5133,
      lng: -15.8047,
      status: "limited"
    },
    {
      id: "kaedi",
      name: "كيفة",
      nameAr: "كيفة",
      type: "city",
      coverage: "تغطية محدودة",
      neighborhoods: ["المركز"],
      lat: 16.1500,
      lng: -13.5000,
      status: "limited"
    },
    {
      id: "nema",
      name: "النعمة",
      nameAr: "النعمة",
      type: "city",
      coverage: "قيد التطوير",
      neighborhoods: ["المركز"],
      lat: 16.6167,
      lng: -7.2500,
      status: "coming_soon"
    },
    {
      id: "atar",
      name: "أطار",
      nameAr: "أطار",
      type: "city",
      coverage: "قيد التطوير",
      neighborhoods: ["المركز"],
      lat: 20.5167,
      lng: -13.0500,
      status: "coming_soon"
    }
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      available: { label: "متاح الآن", color: "bg-green-100 text-green-800", icon: CheckCircle2 },
      limited: { label: "تغطية محدودة", color: "bg-yellow-100 text-yellow-800", icon: Info },
      coming_soon: { label: "قريباً", color: "bg-blue-100 text-blue-800", icon: Info }
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.available;
    const Icon = config.icon;
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
        <Icon className="w-4 h-4" />
        {config.label}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white" dir="rtl">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/moov-logo.jpg" alt="Moov Mauritel" className="h-12 w-auto" />
            <div>
              <h1 className="text-xl font-bold text-blue-900">خريطة التغطية</h1>
              <p className="text-sm text-gray-600">مناطق تغطية الألياف البصرية</p>
            </div>
          </div>
          <Button variant="outline" onClick={() => window.location.href = "/"}>
            العودة للرئيسية
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Interactive Map Link */}
          <Card className="mb-8 bg-gradient-to-r from-blue-50 via-white to-orange-50 border-2 border-blue-200">
            <CardContent className="p-8 text-center">
              <div className="max-w-3xl mx-auto">
                <div className="mb-4">
                  <svg className="w-16 h-16 mx-auto text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-blue-900 mb-3">الخريطة التفاعلية الرسمية</h2>
                <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                  للتحقق من التغطية الدقيقة لمنطقتك، يمكنك استخدام الخريطة التفاعلية الرسمية من موريتل.
                  <br />
                  الخريطة تعرض شبكة الألياف البصرية بالتفصيل في جميع أنحاء نواكشوط والمدن الأخرى.
                </p>
                <a
                  href="https://www.mauritel.mr/couveture/fibre?change_language=ar"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-lg text-lg font-bold hover:from-blue-700 hover:to-blue-800 transition-all transform hover:scale-105 shadow-lg"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  عرض الخريطة التفاعلية الرسمية
                </a>
                <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-600">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  ستفتح الخريطة في نافذة جديدة على موقع موريتل الرسمي
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Divider */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-blue-900 mb-2">أو تصفح المناطق المغطاة أدناه</h2>
            <p className="text-gray-600">قائمة المدن والأحياء التي تتوفر فيها خدمة الألياف البصرية</p>
          </div>

          {/* Info Banner */}
          <Card className="mb-8 bg-gradient-to-r from-blue-600 to-blue-700 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <MapPin className="w-8 h-8 flex-shrink-0 mt-1" />
                <div>
                  <h2 className="text-2xl font-bold mb-2">شبكة ألياف بصرية بطول 4000 كم</h2>
                  <p className="text-blue-100 text-lg">
                    نوفر خدمة الإنترنت عبر الألياف البصرية في المدن الرئيسية في موريتانيا مع توسع مستمر لتغطية المزيد من المناطق
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Coverage Map */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cities List */}
            <div className="lg:col-span-1 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>المدن المغطاة</CardTitle>
                  <CardDescription>اختر مدينة لعرض التفاصيل</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {coverageAreas.map((area) => (
                    <button
                      key={area.id}
                      onClick={() => setSelectedCity(area.id)}
                      className={`w-full text-right p-4 rounded-lg border-2 transition-all ${
                        selectedCity === area.id
                          ? "border-blue-600 bg-blue-50"
                          : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-lg">{area.nameAr}</span>
                        <MapPin className={`w-5 h-5 ${selectedCity === area.id ? "text-blue-600" : "text-gray-400"}`} />
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{area.coverage}</p>
                      {getStatusBadge(area.status)}
                    </button>
                  ))}
                </CardContent>
              </Card>

              {/* Legend */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">مفتاح الخريطة</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-green-500"></div>
                    <span>متاح الآن - تغطية كاملة</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
                    <span>تغطية محدودة - المركز فقط</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                    <span>قريباً - قيد التطوير</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Details Panel */}
            <div className="lg:col-span-2">
              {selectedCity ? (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-2xl">
                          {coverageAreas.find(a => a.id === selectedCity)?.nameAr}
                        </CardTitle>
                        <CardDescription className="text-lg mt-1">
                          {coverageAreas.find(a => a.id === selectedCity)?.coverage}
                        </CardDescription>
                      </div>
                      {getStatusBadge(coverageAreas.find(a => a.id === selectedCity)?.status || "available")}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Map Placeholder */}
                      <div className="aspect-video bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg border-2 border-blue-200 flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 opacity-10">
                          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                            <path d="M0,50 Q25,30 50,50 T100,50" stroke="currentColor" strokeWidth="0.5" fill="none" className="text-blue-600" />
                            <path d="M0,60 Q25,40 50,60 T100,60" stroke="currentColor" strokeWidth="0.5" fill="none" className="text-blue-600" />
                            <path d="M0,70 Q25,50 50,70 T100,70" stroke="currentColor" strokeWidth="0.5" fill="none" className="text-blue-600" />
                          </svg>
                        </div>
                        <div className="relative z-10 text-center">
                          <MapPin className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                          <p className="text-xl font-bold text-blue-900">
                            {coverageAreas.find(a => a.id === selectedCity)?.nameAr}
                          </p>
                          <p className="text-sm text-blue-700 mt-2">
                            خط العرض: {coverageAreas.find(a => a.id === selectedCity)?.lat.toFixed(4)}° | 
                            خط الطول: {coverageAreas.find(a => a.id === selectedCity)?.lng.toFixed(4)}°
                          </p>
                        </div>
                      </div>

                      {/* Neighborhoods */}
                      <div>
                        <h3 className="font-bold text-lg mb-3">الأحياء المغطاة</h3>
                        <div className="grid md:grid-cols-2 gap-3">
                          {coverageAreas.find(a => a.id === selectedCity)?.neighborhoods.map((neighborhood, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg"
                            >
                              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                              <span className="text-gray-800">{neighborhood}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* CTA */}
                      <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-6 rounded-lg border border-orange-200">
                        <h3 className="font-bold text-lg mb-2">هل أنت في هذه المنطقة؟</h3>
                        <p className="text-gray-700 mb-4">
                          سجل الآن للحصول على خدمة الإنترنت الفائق السرعة عبر الألياف البصرية
                        </p>
                        <Button
                          className="bg-orange-500 hover:bg-orange-600 text-white"
                          onClick={() => window.location.href = "/#register"}
                        >
                          سجل الآن
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="h-full flex items-center justify-center">
                  <CardContent className="text-center py-12">
                    <MapPin className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                    <p className="text-xl text-gray-500">اختر مدينة من القائمة لعرض التفاصيل</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Contact Section */}
          <Card className="mt-8">
            <CardContent className="p-6">
              <div className="text-center">
                <h3 className="text-xl font-bold mb-2">لم تجد منطقتك؟</h3>
                <p className="text-gray-600 mb-4">
                  نحن نعمل باستمرار على توسيع شبكتنا. اتصل بنا للاستفسار عن توفر الخدمة في منطقتك
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <a href="tel:0022244292222" className="text-blue-600 hover:text-blue-700 font-semibold">
                    📞 0022244292222
                  </a>
                  <span className="hidden sm:inline text-gray-400">|</span>
                  <a href="mailto:info@scl-communication.mr" className="text-blue-600 hover:text-blue-700 font-semibold">
                    ✉️ info@scl-communication.mr
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}


import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { toast } from "sonner";
import { Wifi, Zap, Shield, Clock, CheckCircle2, Phone, Mail, Search, MapPin } from "lucide-react";

export default function Home() {
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    latitude: "",
    longitude: "",
    locationShared: "no",
    packageType: "200mbps" as "100mbps" | "200mbps" | "500mbps",
  });
  const [locationLoading, setLocationLoading] = useState(false);

  const createMutation = trpc.registrations.create.useMutation({
    onSuccess: () => {
      toast.success("تم إرسال طلبك بنجاح! سنتصل بك قريباً.");
      setFormData({
        fullName: "",
        phoneNumber: "",
        email: "",
        latitude: "",
        longitude: "",
        locationShared: "no",
        packageType: "200mbps",
      });
    },
    onError: (error) => {
      toast.error("حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى.");
    },
  });

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      toast.error("متصفحك لا يدعم تحديد الموقع");
      return;
    }

    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData({
          ...formData,
          latitude: position.coords.latitude.toString(),
          longitude: position.coords.longitude.toString(),
          locationShared: "yes",
        });
        setLocationLoading(false);
        toast.success("تم تحديد موقعك بنجاح");
      },
      (error) => {
        setLocationLoading(false);
        toast.error("فشل الحصول على الموقع. يرجى السماح بالوصول إلى الموقع.");
      }
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  const packages = [
    {
      name: "باقة 100 ميغابت",
      speed: "100",
      price: "1500",
      features: ["سرعة تحميل 100 ميغابت/ثانية", "سرعة رفع متماثلة", "مودم ألياف بصرية", "دعم فني على مدار الساعة"],
      value: "100mbps" as const,
    },
    {
      name: "باقة 200 ميغابت",
      speed: "200",
      price: "2500",
      features: ["سرعة تحميل 200 ميغابت/ثانية", "سرعة رفع متماثلة", "مودم ألياف بصرية", "دعم فني على مدار الساعة", "أولوية في الدعم"],
      value: "200mbps" as const,
      popular: true,
    },
    {
      name: "باقة 500 ميغابت",
      speed: "500",
      price: "5000",
      features: ["سرعة تحميل 500 ميغابت/ثانية", "سرعة رفع متماثلة", "مودم ألياف بصرية متقدم", "دعم فني مخصص", "أولوية قصوى في الدعم"],
      value: "500mbps" as const,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white" dir="rtl">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/scl-logo.png" alt="SCL Communication" className="h-12" />
            <span className="text-xl text-gray-400">×</span>
            <img src="/moov-mauritel-logo.webp" alt="Moov Mauritel" className="h-12" />
          </div>
          <nav className="hidden md:flex gap-6">
            <a href="#packages" className="text-gray-700 hover:text-blue-600 transition">الباقات</a>
            <a href="/track" className="text-gray-700 hover:text-blue-600 transition flex items-center gap-1">
              <Search className="w-4 h-4" />
              تتبع طلبك
            </a>
            <a href="/coverage" className="text-gray-700 hover:text-blue-600 transition flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              خريطة التغطية
            </a>
            <a href="#register" className="text-gray-700 hover:text-blue-600 transition">سجل الآن</a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-600 via-blue-700 to-orange-500 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            الإنترنت الفائق السرعة
            <br />
            <span className="text-orange-300">عبر الألياف البصرية</span>
          </h2>
          <p className="text-xl md:text-2xl mb-8 text-blue-100">
            سرعات تصل إلى 500 ميغابت/ثانية - اتصال مستقر - تغطية واسعة
          </p>
          <Button 
            size="lg" 
            className="bg-orange-500 hover:bg-orange-600 text-white text-lg px-8 py-6"
            onClick={() => document.getElementById('register')?.scrollIntoView({ behavior: 'smooth' })}
          >
            سجل الآن واحصل على الخدمة
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 px-4">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12 text-gray-900">لماذا الألياف البصرية من مووف موريتل؟</h3>
          <div className="flex items-center justify-center gap-6 mb-8">
            <img src="/scl-logo.png" alt="SCL Communication" className="h-20" />
            <div className="text-4xl text-orange-500 font-bold">×</div>
            <img src="/moov-mauritel-logo.webp" alt="Moov Mauritel" className="h-20" />
          </div>
          <p className="text-center text-gray-600 mb-8 max-w-3xl mx-auto">نحن وكيل معتمد لتسويق وبيع خدمات مووف موريتل للألياف البصرية، نتولى الجانب التجاري من التسجيل حتى استلام الخدمة</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center hover:shadow-lg transition">
              <CardHeader>
                <Zap className="w-12 h-12 mx-auto text-orange-500 mb-3" />
                <CardTitle>سرعة فائقة</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">سرعات تصل إلى 500 ميغابت/ثانية للتحميل والرفع</p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition">
              <CardHeader>
                <Shield className="w-12 h-12 mx-auto text-blue-600 mb-3" />
                <CardTitle>اتصال مستقر</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">تقنية الألياف البصرية توفر اتصالاً موثوقاً على مدار الساعة</p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition">
              <CardHeader>
                <Wifi className="w-12 h-12 mx-auto text-green-600 mb-3" />
                <CardTitle>تغطية واسعة</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">شبكة ألياف بصرية بطول 4000 كم تغطي جميع أنحاء موريتانيا</p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition">
              <CardHeader>
                <Clock className="w-12 h-12 mx-auto text-purple-600 mb-3" />
                <CardTitle>دعم فني 24/7</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">فريق دعم فني متاح على مدار الساعة لخدمتك</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section id="packages" className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold text-center mb-4 text-gray-900">اختر الباقة المناسبة لك</h3>
          <div className="bg-green-50 border-2 border-green-300 rounded-lg p-4 max-w-3xl mx-auto mb-8">
            <p className="text-center text-gray-800 mb-2">
              <span className="font-bold text-green-700">✨ التكلفة الإجمالية:</span> سعر الباقة الشهري + <strong>1,000 أوقية</strong> (مودم - دفعة واحدة)
            </p>
            <p className="text-center text-sm text-green-700 font-semibold">
              🎉 رسوم التركيب مجانية تماماً!
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {packages.map((pkg) => (
              <Card 
                key={pkg.value} 
                className={`relative hover:shadow-xl transition ${pkg.popular ? 'border-2 border-orange-500' : ''}`}
              >
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-orange-500 text-white px-4 py-1 rounded-full text-sm font-bold">
                    الأكثر شعبية
                  </div>
                )}
                <CardHeader className="text-center pb-8">
                  <CardTitle className="text-2xl mb-2">{pkg.name}</CardTitle>
                  <div className="text-5xl font-bold text-blue-600 mb-2">{pkg.speed}</div>
                  <div className="text-gray-500">ميغابت/ثانية</div>
                  <div className="mt-4">
                    <span className="text-3xl font-bold text-gray-900">{pkg.price}</span>
                    {pkg.price !== "حسب الطلب" && <span className="text-gray-600"> أوقية/شهر</span>}
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {pkg.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className="w-full mt-6 bg-blue-600 hover:bg-blue-700"
                    onClick={() => {
                      setFormData({ ...formData, packageType: pkg.value });
                      document.getElementById('register')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    اختر هذه الباقة
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Registration Form */}
      <section id="register" className="py-16 px-4">
        <div className="container mx-auto max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl text-center">سجل الآن واحصل على الخدمة</CardTitle>
              <CardDescription className="text-center text-lg">
                املأ النموذج وسنتصل بك في أقرب وقت لتركيب الخدمة
              </CardDescription>
              <div className="text-center mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800">
                  🎉 <strong>التكلفة الإجمالية:</strong> فقط سعر الباقة الشهري + 1,000 أوقية (مودم) • التركيب مجاني!
                </p>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="fullName">الاسم الكامل *</Label>
                  <Input
                    id="fullName"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="أدخل اسمك الكامل"
                  />
                </div>

                <div>
                  <Label htmlFor="phoneNumber">رقم الهاتف *</Label>
                  <Input
                    id="phoneNumber"
                    required
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    placeholder="مثال: 22244292222"
                  />
                </div>

                <div>
                  <Label htmlFor="email">البريد الإلكتروني</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="example@email.com"
                  />
                </div>

                <div className="space-y-3">
                  <Label>تحديد الموقع الجغرافي (اختياري)</Label>
                  <p className="text-sm text-gray-600">
                    ساعدنا في تحديد موقعك بدقة للتأكد من توفر تغطية الألياف البصرية في منطقتك
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleGetLocation}
                    disabled={locationLoading}
                    className="w-full"
                  >
                    {locationLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 ml-2"></div>
                        جاري الحصول على الموقع...
                      </>
                    ) : formData.locationShared === "yes" ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 ml-2 text-green-600" />
                        تم تحديد الموقع بنجاح
                      </>
                    ) : (
                      "اضغط لتحديد موقعك"
                    )}
                  </Button>
                  {formData.locationShared === "yes" && (
                    <p className="text-xs text-green-600">
                      ✓ تم حفظ موقعك الجغرافي
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="packageType">اختر الباقة *</Label>
                  <Select
                    value={formData.packageType}
                    onValueChange={(value: "100mbps" | "200mbps" | "500mbps") => 
                      setFormData({ ...formData, packageType: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="100mbps">باقة 100 ميغابت - 1500 أوقية/شهر</SelectItem>
                      <SelectItem value="200mbps">باقة 200 ميغابت - 2500 أوقية/شهر</SelectItem>
                      <SelectItem value="500mbps">باقة 500 ميغابت - حسب الطلب</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-orange-500 hover:bg-orange-600 text-lg py-6"
                  disabled={createMutation.isPending}
                >
                  {createMutation.isPending ? "جاري الإرسال..." : "إرسال الطلب"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 px-4 bg-blue-900 text-white">
        <div className="container mx-auto text-center">
          <h3 className="text-3xl font-bold mb-8">تواصل معنا</h3>
          <div className="flex flex-col md:flex-row justify-center items-center gap-8">
            <div className="flex items-center gap-3">
              <Phone className="w-6 h-6" />
              <a href="tel:0022244292222" className="text-xl hover:text-orange-300 transition">
                0022244292222
              </a>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="w-6 h-6" />
              <a href="mailto:info@scl-communication.mr" className="text-xl hover:text-orange-300 transition">
                info@scl-communication.mr
              </a>
            </div>
          </div>
          <div className="mt-8">
            <span className="flex items-center gap-3 text-gray-300">
              www.scl-communication.mr
            </span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 px-4">
        <div className="container mx-auto text-center">
          <p>© 2024 SCL Communication - جميع الحقوق محفوظة</p>
          <p className="mt-2 text-sm">وكيل معتمد لخدمات مووف موريتل للألياف البصرية</p>
        </div>
      </footer>
    </div>
  );
}


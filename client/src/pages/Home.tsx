import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { toast } from "sonner";
import { Wifi, Zap, Shield, Clock, CheckCircle2, MapPin } from "lucide-react";
import { checkCoverageStatus } from "@/data/coverageAreas";

export default function Home() {
  const { t, dir } = useLanguage();
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
  const [coverageStatus, setCoverageStatus] = useState<{
    status: 'available' | 'coming_soon' | 'not_available';
    message: string;
  } | null>(null);

  const createMutation = trpc.registrations.create.useMutation({
    onSuccess: () => {
      toast.success(t('successRegistration'));
      toast.info(t('successMessage'));
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
      toast.error(t('errorMessage'));
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
        toast.success(t('locationShared'));
        
        // التحقق من حالة التغطية
        const coverage = checkCoverageStatus(
          position.coords.latitude,
          position.coords.longitude
        );
        const { language } = useLanguage();
        setCoverageStatus({
          status: coverage.status,
          message: language === 'ar' ? coverage.message : coverage.messageFr,
        });
        
        // عرض رسالة حسب حالة التغطية
        if (coverage.status === 'available') {
          toast.success(language === 'ar' ? coverage.message : coverage.messageFr, { duration: 5000 });
        } else if (coverage.status === 'coming_soon') {
          toast.info(language === 'ar' ? coverage.message : coverage.messageFr, { duration: 5000 });
        } else {
          toast.warning(language === 'ar' ? coverage.message : coverage.messageFr, { duration: 5000 });
        }
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
      name: t('package100'),
      speed: "100",
      price: "1500",
      features: [
        t('speed') + " 100 " + t('mbps'),
        t('unlimitedData'),
        t('freeModem'),
        t('support247')
      ],
      value: "100mbps" as const,
    },
    {
      name: t('package200'),
      speed: "200",
      price: "2500",
      features: [
        t('speed') + " 200 " + t('mbps'),
        t('unlimitedData'),
        t('freeModem'),
        t('support247'),
        t('support')
      ],
      value: "200mbps" as const,
      popular: true,
    },
    {
      name: t('package500'),
      speed: "500",
      price: "5000",
      features: [
        t('speed') + " 500 " + t('mbps'),
        t('unlimitedData'),
        t('freeModem'),
        t('support247'),
        t('support')
      ],
      value: "500mbps" as const,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white" dir={dir}>
      <Header />

      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-600 via-blue-700 to-orange-500 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            {t('heroTitle')}
            <br />
            <span className="text-orange-300">{t('heroSubtitle')}</span>
          </h2>
          <p className="text-xl md:text-2xl mb-8 text-blue-100">
            {t('heroDescription')}
          </p>
          <Button 
            size="lg" 
            className="bg-orange-500 hover:bg-orange-600 text-white text-lg px-8 py-6"
            onClick={() => document.getElementById('register')?.scrollIntoView({ behavior: 'smooth' })}
          >
            {t('registerNow')}
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 px-4">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12 text-gray-900">{t('whyTitle')}</h3>
          <div className="flex items-center justify-center gap-6 mb-8">
            <img src="/scl-logo-medium.webp" srcSet="/scl-logo-small.webp 96w, /scl-logo-medium.webp 200w" sizes="200px" alt="SCL Communication" className="h-20" loading="lazy" width="200" height="133" />
            <div className="text-4xl text-orange-500 font-bold">×</div>
            <img src="/moov-mauritel-logo.webp" alt="Moov Mauritel" className="h-20" />
          </div>
          <p className="text-center text-gray-600 mb-8 max-w-3xl mx-auto">{t('whyDescription')}</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center hover:shadow-lg transition">
              <CardHeader>
                <Zap className="w-12 h-12 mx-auto text-orange-500 mb-3" />
                <CardTitle>{t('highSpeed')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{t('highSpeedDesc')}</p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition">
              <CardHeader>
                <Shield className="w-12 h-12 mx-auto text-blue-600 mb-3" />
                <CardTitle>{t('stableConnection')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{t('stableConnectionDesc')}</p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition">
              <CardHeader>
                <Wifi className="w-12 h-12 mx-auto text-green-600 mb-3" />
                <CardTitle>{t('wideNetwork')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{t('wideNetworkDesc')}</p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition">
              <CardHeader>
                <Clock className="w-12 h-12 mx-auto text-purple-600 mb-3" />
                <CardTitle>{t('support247')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{t('support247Desc')}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Special Offer Section */}
      <section className="py-12 px-4 bg-gradient-to-r from-blue-50 via-orange-50 to-blue-50">
        <div className="container mx-auto max-w-5xl">
          <Card className="border-4 border-blue-500 shadow-2xl bg-white">
            <CardHeader className="text-center bg-gradient-to-r from-blue-600 to-orange-500 text-white rounded-t-lg pb-6 md:pb-8">
              <CardTitle className="text-2xl md:text-4xl font-bold mb-2 md:mb-3">{t('modemPaymentTitle')}</CardTitle>
              <CardDescription className="text-white text-base md:text-xl font-semibold">
                {t('modemPaymentDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 md:p-8">
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-2 md:gap-3 p-3 md:p-4 bg-green-50 rounded-lg border-2 border-green-300">
                    <span className="text-xl md:text-2xl flex-shrink-0">✅</span>
                    <p className="text-sm md:text-base text-gray-800 font-medium">{t('modemPaymentBenefit1')}</p>
                  </div>
                  <div className="flex items-start gap-2 md:gap-3 p-3 md:p-4 bg-blue-50 rounded-lg border-2 border-blue-300">
                    <span className="text-xl md:text-2xl flex-shrink-0">✅</span>
                    <p className="text-sm md:text-base text-gray-800 font-medium">{t('modemPaymentBenefit2')}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-2 md:gap-3 p-3 md:p-4 bg-purple-50 rounded-lg border-2 border-purple-300">
                    <span className="text-xl md:text-2xl flex-shrink-0">✅</span>
                    <p className="text-sm md:text-base text-gray-800 font-medium">{t('modemPaymentBenefit3')}</p>
                  </div>
                  <div className="flex items-start gap-2 md:gap-3 p-3 md:p-4 bg-orange-50 rounded-lg border-2 border-orange-300">
                    <span className="text-xl md:text-2xl flex-shrink-0">✅</span>
                    <p className="text-sm md:text-base text-gray-800 font-medium">{t('modemPaymentBenefit4')}</p>
                  </div>
                </div>
              </div>
              <div className="text-center bg-gradient-to-r from-blue-100 to-orange-100 p-4 md:p-6 rounded-lg border-2 border-blue-400">
                <p className="text-base md:text-xl font-bold text-blue-900 mb-3 md:mb-4">{t('modemPaymentCTA')}</p>
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600 text-white text-lg md:text-xl px-8 md:px-12 py-5 md:py-7 shadow-lg transform hover:scale-105 transition w-full md:w-auto"
                  onClick={() => document.getElementById('register')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  🚀 {t('registerNow')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Packages Section */}
      <section id="packages" className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold text-center mb-4 text-gray-900">{t('packagesTitle')}</h3>
          <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-4 max-w-3xl mx-auto mb-8">
            <p className="text-center text-gray-800 mb-2">
              <span className="font-bold text-blue-700">💰 {t('costInfo')}</span>
            </p>
            <p className="text-center text-sm text-blue-700 font-semibold">
              🎉 {t('installationFree')}
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
                    {t('mostPopular')}
                  </div>
                )}
                <CardHeader className="text-center pb-8">
                  <CardTitle className="text-2xl mb-2">{pkg.name}</CardTitle>
                  <div className="text-5xl font-bold text-blue-600 mb-2">{pkg.speed}</div>
                  <div className="text-gray-500">{t('mbps')}</div>
                  <div className="mt-4">
                    <span className="text-3xl font-bold text-gray-900">{pkg.price}</span>
                    <span className="text-gray-600"> {t('perMonth')}</span>
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
                    {t('choosePackage')}
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
              <CardTitle className="text-2xl md:text-3xl text-center">{t('registerTitle')}</CardTitle>
              <CardDescription className="text-center text-base md:text-lg">
                {t('successMessage')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                <div>
                  <Label htmlFor="fullName">{t('fullName')}</Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder={t('fullNamePlaceholder')}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="phoneNumber">{t('phoneNumber')}</Label>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    placeholder={t('phonePlaceholder')}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="email">{t('email')}</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder={t('emailPlaceholder')}
                  />
                </div>

                <div>
                  <Label>{t('locationField')}</Label>
                  <p className="text-sm text-gray-600 mb-2">{t('locationHelp')}</p>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={handleGetLocation}
                    disabled={locationLoading || formData.locationShared === "yes"}
                  >
                    <MapPin className="w-4 h-4 mr-2" />
                    {formData.locationShared === "yes" ? t('locationShared') : t('getLocation')}
                  </Button>
                  
                  {/* عرض حالة التغطية */}
                  {coverageStatus && (
                    <div className={`mt-3 p-3 rounded-lg border-2 ${
                      coverageStatus.status === 'available'
                        ? 'bg-green-50 border-green-300'
                        : coverageStatus.status === 'coming_soon'
                        ? 'bg-yellow-50 border-yellow-300'
                        : 'bg-red-50 border-red-300'
                    }`}>
                      <p className={`text-sm font-semibold ${
                        coverageStatus.status === 'available'
                          ? 'text-green-700'
                          : coverageStatus.status === 'coming_soon'
                          ? 'text-yellow-700'
                          : 'text-red-700'
                      }`}>
                        {coverageStatus.message}
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="packageType">{t('packageRequired')}</Label>
                  <Select
                    value={formData.packageType}
                    onValueChange={(value: any) => setFormData({ ...formData, packageType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t('selectPackage')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="100mbps">{t('package100')}</SelectItem>
                      <SelectItem value="200mbps">{t('package200')}</SelectItem>
                      <SelectItem value="500mbps">{t('package500')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-orange-500 hover:bg-orange-600 text-base md:text-lg py-5 md:py-6"
                  disabled={createMutation.isPending}
                >
                  {createMutation.isPending ? t('submitting') : t('submitRegistration')}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
}


import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { CheckCircle2, Clock, Phone, User, Calendar, MapPin, Package, AlertCircle } from "lucide-react";

export default function TrackOrder() {
  const { t, dir } = useLanguage();
  const [trackingId, setTrackingId] = useState("");
  const [searchId, setSearchId] = useState("");
  
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
        label: t('pending'),
        color: "bg-yellow-100 text-yellow-800 border-yellow-300",
        icon: Clock,
      },
      contacted: {
        label: t('contacted'),
        color: "bg-blue-100 text-blue-800 border-blue-300",
        icon: Phone,
      },
      scheduled: {
        label: t('scheduled'),
        color: "bg-purple-100 text-purple-800 border-purple-300",
        icon: Calendar,
      },
      in_progress: {
        label: t('scheduled'),
        color: "bg-orange-100 text-orange-800 border-orange-300",
        icon: User,
      },
      completed: {
        label: t('completed'),
        color: "bg-green-100 text-green-800 border-green-300",
        icon: CheckCircle2,
      },
      cancelled: {
        label: t('cancelled'),
        color: "bg-red-100 text-red-800 border-red-300",
        icon: AlertCircle,
      },
    };
    return statusMap[status as keyof typeof statusMap] || statusMap.pending;
  };

  const getPackageLabel = (packageType: string) => {
    const packageMap = {
      "100mbps": `${t('package100')} - 1500 ${t('perMonth')}`,
      "200mbps": `${t('package200')} - 2500 ${t('perMonth')}`,
      "500mbps": `${t('package500')} - 5000 ${t('perMonth')}`,
    };
    return packageMap[packageType as keyof typeof packageMap] || packageType;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white" dir={dir}>
      <Header />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-3xl text-center">{t('trackOrderTitle')}</CardTitle>
              <CardDescription className="text-center text-lg">
                {t('trackOrderDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSearch} className="space-y-4">
                <div>
                  <Label htmlFor="trackingId">{t('trackingNumber')}</Label>
                  <Input
                    id="trackingId"
                    value={trackingId}
                    onChange={(e) => setTrackingId(e.target.value)}
                    placeholder={t('trackingPlaceholder')}
                    required
                  />
                </div>
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                  {isLoading ? t('tracking') : t('trackButton')}
                </Button>
              </form>
            </CardContent>
          </Card>

          {error && (
            <Card className="border-red-300 bg-red-50">
              <CardHeader>
                <CardTitle className="text-red-800 flex items-center gap-2">
                  <AlertCircle className="w-6 h-6" />
                  {t('orderNotFound')}
                </CardTitle>
                <CardDescription className="text-red-600">
                  {t('orderNotFoundDesc')}
                </CardDescription>
              </CardHeader>
            </Card>
          )}

          {registration && (
            <div className="space-y-6">
              <Card className="border-green-300 bg-green-50">
                <CardHeader>
                  <CardTitle className="text-green-800 flex items-center gap-2">
                    <CheckCircle2 className="w-6 h-6" />
                    {t('orderFound')}
                  </CardTitle>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{t('orderStatus')}</CardTitle>
                </CardHeader>
                <CardContent>
                  {(() => {
                    const statusInfo = getStatusInfo(registration.status);
                    const StatusIcon = statusInfo.icon;
                    return (
                      <div className="flex items-center gap-3">
                        <StatusIcon className="w-8 h-8" />
                        <Badge className={`${statusInfo.color} text-lg px-4 py-2`}>
                          {statusInfo.label}
                        </Badge>
                      </div>
                    );
                  })()}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{t('customerInfo')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <User className="w-5 h-5 text-gray-500" />
                    <span className="font-semibold">{t('name')}:</span>
                    <span>{registration.fullName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-5 h-5 text-gray-500" />
                    <span className="font-semibold">{t('phone')}:</span>
                    <span dir="ltr">{registration.phoneNumber}</span>
                  </div>
                  {registration.email && (
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{t('email')}:</span>
                      <span>{registration.email}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-gray-500" />
                    <span className="font-semibold">{t('registeredOn')}:</span>
                    <span>{new Date(registration.createdAt!).toLocaleDateString(dir === 'rtl' ? 'ar-MR' : 'fr-FR')}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{t('packageInfo')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Package className="w-5 h-5 text-gray-500" />
                    <span className="font-semibold">{t('packageColumn')}:</span>
                    <span>{getPackageLabel(registration.packageType)}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}


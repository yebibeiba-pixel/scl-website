import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { MapPin, CheckCircle2, Clock, ExternalLink } from "lucide-react";

export default function Coverage() {
  const { t, dir } = useLanguage();

  const coverageAreas = [
    { city: t('nouakchott'), status: "available" },
    { city: t('nouadhibou'), status: "available" },
    { city: t('rosso'), status: "available" },
    { city: t('kaedi'), status: "coming_soon" },
    { city: t('nema'), status: "coming_soon" },
    { city: t('atar'), status: "coming_soon" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white" dir={dir}>
      <Header />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{t('coverageTitle')}</h1>
            <p className="text-xl text-gray-600">{t('coverageDescription')}</p>
          </div>

          {/* Official Map Section */}
          <Card className="mb-8 border-2 border-blue-300 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-2xl text-blue-900 flex items-center gap-2">
                <MapPin className="w-6 h-6" />
                {t('officialMapTitle')}
              </CardTitle>
              <CardDescription className="text-blue-800 text-base">
                {t('officialMapDesc')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-6"
                onClick={() => window.open('https://www.mauritel.mr/couveture/fibre', '_blank')}
              >
                <ExternalLink className="w-5 h-5 mr-2" />
                {t('openOfficialMap')}
              </Button>
            </CardContent>
          </Card>

          {/* Coverage Areas */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{t('coverageAreasTitle')}</CardTitle>
              <CardDescription className="text-base">
                {t('coverageAreasDesc')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className={`px-4 py-3 ${dir === 'rtl' ? 'text-right' : 'text-left'} font-semibold text-gray-700`}>{t('cityName')}</th>
                      <th className={`px-4 py-3 ${dir === 'rtl' ? 'text-right' : 'text-left'} font-semibold text-gray-700`}>{t('availabilityStatus')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {coverageAreas.map((area, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-4 flex items-center gap-2">
                          <MapPin className="w-5 h-5 text-blue-600" />
                          <span className="font-medium text-gray-900">{area.city}</span>
                        </td>
                        <td className="px-4 py-4">
                          {area.status === "available" ? (
                            <Badge className="bg-green-100 text-green-800 border-green-300 flex items-center gap-1 w-fit">
                              <CheckCircle2 className="w-4 h-4" />
                              {t('available')}
                            </Badge>
                          ) : (
                            <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300 flex items-center gap-1 w-fit">
                              <Clock className="w-4 h-4" />
                              {t('comingSoon')}
                            </Badge>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* CTA Section */}
          <div className="mt-12 text-center">
            <Card className="bg-gradient-to-r from-blue-600 to-orange-500 text-white border-none">
              <CardHeader>
                <CardTitle className="text-3xl">{t('registerNow')}</CardTitle>
                <CardDescription className="text-blue-100 text-lg">
                  {t('successMessage')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-6"
                  onClick={() => window.location.href = '/#register'}
                >
                  {t('registerNow')}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}


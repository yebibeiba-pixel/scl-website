import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { getLoginUrl } from "@/const";
import { toast } from "sonner";
import { Users, Package, CheckCircle, Clock, XCircle, Phone, Download, Map } from "lucide-react";
import { RegistrationsMap } from "@/components/RegistrationsMap";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Admin() {
  const { user, loading, isAuthenticated } = useAuth();
  const { data: registrations, isLoading, refetch } = trpc.registrations.list.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  const { data: stats } = trpc.registrations.stats.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const updateStatusMutation = trpc.registrations.updateStatus.useMutation({
    onSuccess: () => {
      toast.success("تم تحديث الحالة بنجاح");
      refetch();
    },
    onError: () => {
      toast.error("حدث خطأ أثناء تحديث الحالة");
    },
  });

  const getStatusLabel = (status: string) => {
    const statusMap: Record<string, string> = {
      pending: "قيد الانتظار",
      contacted: "تم الاتصال",
      scheduled: "مجدول",
      in_progress: "جاري التركيب",
      completed: "مكتمل",
      cancelled: "ملغي",
    };
    return statusMap[status] || status;
  };

  const exportToCSV = () => {
    if (!registrations || registrations.length === 0) {
      toast.error("لا توجد بيانات للتصدير");
      return;
    }

    const headers = ["الاسم", "رقم الهاتف", "البريد الإلكتروني", "العنوان", "الباقة", "الحالة", "تاريخ التسجيل"];
    const rows = registrations.map(reg => [
      reg.fullName,
      reg.phoneNumber,
      reg.email || "",
      getPackageLabel(reg.packageType),
      getStatusLabel(reg.status),
      reg.createdAt ? new Date(reg.createdAt).toLocaleDateString('ar-MR') : ""
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `moov-registrations-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("تم تصدير التقرير بنجاح");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50" dir="rtl">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">لوحة التحكم</CardTitle>
            <CardDescription>يجب تسجيل الدخول للوصول إلى هذه الصفحة</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700"
              onClick={() => window.location.href = getLoginUrl()}
            >
              تسجيل الدخول
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    const statusMap = {
      pending: { label: "قيد الانتظار", variant: "secondary" as const, icon: Clock },
      contacted: { label: "تم الاتصال", variant: "default" as const, icon: Phone },
      scheduled: { label: "مجدول", variant: "default" as const, icon: Clock },
      in_progress: { label: "جاري التركيب", variant: "default" as const, icon: Clock },
      completed: { label: "مكتمل", variant: "default" as const, icon: CheckCircle },
      cancelled: { label: "ملغي", variant: "destructive" as const, icon: XCircle },
    };
    const config = statusMap[status as keyof typeof statusMap] || statusMap.pending;
    const Icon = config.icon;
    return (
      <Badge variant={config.variant} className="flex items-center gap-1 w-fit">
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    );
  };

  const getPackageLabel = (packageType: string) => {
    const packageMap = {
      "100mbps": "100 ميغابت",
      "200mbps": "200 ميغابت",
      "500mbps": "500 ميغابت",
    };
    return packageMap[packageType as keyof typeof packageMap] || packageType;
  };

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/moov-logo.jpg" alt="Moov Mauritel" className="h-12 w-auto" />
            <div>
              <h1 className="text-xl font-bold text-blue-900">لوحة التحكم</h1>
              <p className="text-sm text-gray-600">إدارة التسجيلات</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">مرحباً، {user?.name}</span>
            <Button variant="outline" size="sm" onClick={() => window.location.href = "/"}>
              العودة للموقع
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">إجمالي التسجيلات</CardTitle>
              <Users className="w-4 h-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{stats?.total || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">قيد الانتظار</CardTitle>
              <Clock className="w-4 h-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-600">{stats?.byStatus?.pending || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">مكتملة</CardTitle>
              <CheckCircle className="w-4 h-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{stats?.byStatus?.completed || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">الباقة الأكثر طلباً</CardTitle>
              <Package className="w-4 h-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {stats?.byPackage && Object.keys(stats.byPackage).length > 0
                  ? getPackageLabel(
                      Object.entries(stats.byPackage).sort((a, b) => b[1] - a[1])[0][0]
                    )
                  : "-"}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Registrations Table & Map */}
        <Tabs defaultValue="table" className="w-full">
          <Card>
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h2 className="text-xl font-bold">جميع التسجيلات</h2>
                <p className="text-sm text-gray-600">قائمة بجميع طلبات التسجيل في خدمة الألياف البصرية</p>
              </div>
              <div className="flex items-center gap-3">
                <TabsList>
                  <TabsTrigger value="table" className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    الجدول
                  </TabsTrigger>
                  <TabsTrigger value="map" className="flex items-center gap-2">
                    <Map className="w-4 h-4" />
                    الخريطة
                  </TabsTrigger>
                </TabsList>
                <Button
                  onClick={exportToCSV}
                  variant="outline"
                  className="flex items-center gap-2"
                  disabled={!registrations || registrations.length === 0}
                >
                  <Download className="w-4 h-4" />
                  تصدير CSV
                </Button>
              </div>
            </div>
            
            <TabsContent value="table" className="m-0">
              <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">جاري تحميل البيانات...</p>
              </div>
            ) : !registrations || registrations.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                لا توجد تسجيلات حتى الآن
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">الاسم</TableHead>
                      <TableHead className="text-right">رقم الهاتف</TableHead>
                      <TableHead className="text-right">البريد الإلكتروني</TableHead>
                      <TableHead className="text-right">العنوان</TableHead>
                      <TableHead className="text-right">الموقع</TableHead>
                      <TableHead className="text-right">الباقة</TableHead>
                      <TableHead className="text-right">العقد</TableHead>
                      <TableHead className="text-right">الحالة</TableHead>
                      <TableHead className="text-right">تاريخ التسجيل</TableHead>
                      <TableHead className="text-right">الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {registrations.map((reg) => (
                      <TableRow key={reg.id}>
                        <TableCell className="font-medium">{reg.fullName}</TableCell>
                        <TableCell>
                          <a href={`tel:${reg.phoneNumber}`} className="text-blue-600 hover:underline">
                            {reg.phoneNumber}
                          </a>
                        </TableCell>
                        <TableCell>
                          {reg.email ? (
                            <a href={`mailto:${reg.email}`} className="text-blue-600 hover:underline">
                              {reg.email}
                            </a>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {reg.latitude && reg.longitude ? (
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => {
                                  const mapTab = document.querySelector('[value="map"]') as HTMLButtonElement;
                                  if (mapTab) {
                                    mapTab.click();
                                    setTimeout(() => {
                                      const mapContainer = document.querySelector('.leaflet-container');
                                      if (mapContainer) {
                                        mapContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                      }
                                    }, 300);
                                  }
                                }}
                                className="inline-flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium rounded hover:from-blue-700 hover:to-purple-700 transition shadow-md"
                                title="عرض موقع العميل على الخريطة التفاعلية مع مناطق التغطية"
                              >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                                </svg>
                                عرض على الخريطة
                              </button>
                              <a
                                href={`https://www.mauritel.mr/couveture/fibre?change_language=ar#map=${reg.latitude},${reg.longitude},16z`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition"
                                title="فتح الموقع على خريطة موريتل لمعرفة حالة التغطية"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                </svg>
                                خريطة موريتل
                              </a>
                              <a
                                href={`https://www.google.com/maps?q=${reg.latitude},${reg.longitude}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-600 hover:text-blue-600 transition"
                                title="فتح على Google Maps"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                              </a>
                            </div>
                          ) : (
                            <span className="text-gray-400 text-sm">غير متاح</span>

                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{getPackageLabel(reg.packageType)}</Badge>
                        </TableCell>
                        <TableCell>
                          {reg.contractSigned === "yes" ? (
                            <div className="flex items-center gap-2">
                              <Badge className="bg-green-100 text-green-800 border-green-300">
                                موقع
                              </Badge>
                              {reg.signatureData && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    const win = window.open();
                                    if (win) {
                                      win.document.write(`<img src="${reg.signatureData}" />`);
                                    }
                                  }}
                                  title="عرض التوقيع"
                                >
                                  🔍
                                </Button>
                              )}
                            </div>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const url = `${window.location.origin}/contract?id=${reg.id}`;
                                navigator.clipboard.writeText(url);
                                toast.success("تم نسخ رابط العقد");
                              }}
                            >
                              نسخ رابط العقد
                            </Button>
                          )}
                        </TableCell>
                        <TableCell>{getStatusBadge(reg.status)}</TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {reg.createdAt ? new Date(reg.createdAt).toLocaleDateString('ar-MR') : '-'}
                        </TableCell>
                        <TableCell>
                          <Select
                            value={reg.status}
                            onValueChange={(value: "pending" | "contacted" | "completed" | "cancelled") =>
                              updateStatusMutation.mutate({ id: reg.id, status: value })
                            }
                          >
                            <SelectTrigger className="w-[140px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">قيد الانتظار</SelectItem>
                              <SelectItem value="contacted">تم الاتصال</SelectItem>
                              <SelectItem value="scheduled">مجدول</SelectItem>
                              <SelectItem value="in_progress">جاري التركيب</SelectItem>
                              <SelectItem value="completed">مكتمل</SelectItem>
                              <SelectItem value="cancelled">ملغي</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
              </CardContent>
            </TabsContent>
            
            <TabsContent value="map" className="m-0">
              <CardContent className="p-6">
                {isLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">جاري تحميل البيانات...</p>
                  </div>
                ) : !registrations || registrations.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    لا توجد تسجيلات حتى الآن
                  </div>
                ) : (
                  <div>
                    <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <h3 className="font-bold text-blue-900 mb-2">تعليمات الخريطة:</h3>
                      <ul className="text-sm text-blue-800 space-y-1">
                        <li>• <strong>المناطق الخضراء:</strong> خدمة الألياف متاحة الآن</li>
                        <li>• <strong>المناطق الصفراء:</strong> الخدمة قريباً</li>
                        <li>• <strong>المناطق الحمراء:</strong> الخدمة غير متاحة حالياً</li>
                        <li>• <strong>النقاط الحمراء:</strong> مواقع العملاء المسجلين</li>
                      </ul>
                    </div>
                    <RegistrationsMap registrations={registrations} />
                  </div>
                )}
              </CardContent>
            </TabsContent>
          </Card>
        </Tabs>
      </div>
    </div>
  );
}


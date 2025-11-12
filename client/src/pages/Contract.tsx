import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { trpc } from "@/lib/trpc";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { CheckCircle2, FileText, Pen } from "lucide-react";

export default function Contract() {
  const [, setLocation] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const registrationId = searchParams.get("id");
  
  const [agreed, setAgreed] = useState(false);
  const [isSigning, setIsSigning] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);

  const { data: registration, isLoading } = trpc.registrations.getById.useQuery(
    { id: registrationId || "" },
    { enabled: !!registrationId }
  );

  const signContractMutation = trpc.registrations.signContract.useMutation({
    onSuccess: () => {
      toast.success("تم توقيع العقد بنجاح!");
      setTimeout(() => {
        setLocation(`/track?id=${registrationId}`);
      }, 2000);
    },
    onError: () => {
      toast.error("حدث خطأ أثناء توقيع العقد");
    },
  });

  useEffect(() => {
    if (!registrationId) {
      toast.error("رقم التسجيل مفقود");
      setLocation("/");
    }
  }, [registrationId, setLocation]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    ctx.scale(2, 2);

    // Set drawing style
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let x, y;
    if ("touches" in e) {
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let x, y;
    if ("touches" in e) {
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }

    ctx.lineTo(x, y);
    ctx.stroke();
    setHasSignature(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
  };

  const handleSign = () => {
    if (!hasSignature) {
      toast.error("يرجى التوقيع أولاً");
      return;
    }

    if (!agreed) {
      toast.error("يرجى الموافقة على الشروط والأحكام");
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const signatureData = canvas.toDataURL("image/png");
    
    signContractMutation.mutate({
      id: registrationId!,
      signatureData,
    });
  };

  const getPackageLabel = (packageType: string) => {
    const packageMap = {
      "100mbps": "باقة 100 ميغابت/ثانية",
      "200mbps": "باقة 200 ميغابت/ثانية",
      "500mbps": "باقة 500 ميغابت/ثانية",
    };
    return packageMap[packageType as keyof typeof packageMap] || packageType;
  };

  const getPackagePrice = (packageType: string) => {
    const priceMap = {
      "100mbps": "1,500",
      "200mbps": "2,500",
      "500mbps": "حسب الطلب",
    };
    return priceMap[packageType as keyof typeof priceMap] || "";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!registration) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-red-600">لم يتم العثور على التسجيل</p>
            <Button onClick={() => setLocation("/")} className="mt-4">
              العودة للرئيسية
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (registration.contractSigned === "yes") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-white" dir="rtl">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-green-600 mb-2">تم توقيع العقد</h2>
            <p className="text-gray-600 mb-4">
              لقد قمت بتوقيع العقد بالفعل في {new Date(registration.contractSignedAt!).toLocaleDateString("ar-MR")}
            </p>
            <Button onClick={() => setLocation(`/track?id=${registrationId}`)} className="w-full">
              تتبع طلبك
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-8 px-4" dir="rtl">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            <img src="/scl-logo-medium.webp" srcSet="/scl-logo-small.webp 96w, /scl-logo-medium.webp 200w" sizes="200px" alt="SCL Communication" className="h-16" loading="lazy" width="200" height="133" />
            <span className="text-3xl text-gray-400">+</span>
            <img src="/moov-mauritel-logo.webp" alt="Moov Mauritel" className="h-16" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">عقد خدمة الإنترنت عبر الألياف البصرية</h1>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-2xl mx-auto mt-4">
            <p className="text-blue-900 font-semibold mb-2">⛔ عقد ملزم بين الطرفين</p>
            <p className="text-sm text-gray-700">
              هذا عقد رسمي بين <strong>مووف موريتل</strong> (مقدم الخدمة) و<strong>العميل</strong>، يحدد حقوق والتزامات كل طرف. تتولى <strong>SCL Communication</strong> الجانب التجاري كوسيط معتمد. بالتوقيع أدناه، توافق على جميع البنود وتلتزم بها.
            </p>
          </div>
        </div>

        {/* Contract Content */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              تفاصيل العقد
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Parties */}
            <div>
              <h3 className="font-bold text-lg mb-3">أطراف العقد:</h3>
              <div className="bg-orange-50 border-2 border-orange-300 rounded-lg p-4 mb-4">
                <p className="text-center text-orange-900 font-bold">
                  🤝 عقد بين طرفين: مووف موريتل (مقدم الخدمة) × العميل
                </p>
                <p className="text-center text-sm text-gray-700 mt-2">
                  ℹ️ SCL Communication تتولى الجانب التجاري كوسيط معتمد
                </p>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded">
                  <p className="font-semibold text-blue-900 mb-2">الطرف الأول (مقدم الخدمة):</p>
                  <p className="text-sm font-bold">مووف موريتل (Moov Mauritel)</p>
                  <p className="text-sm text-gray-600">شركة اتصالات مرخصة في موريتانيا</p>
                  <p className="text-sm text-gray-600 mt-2">📍 الوسيط التجاري: SCL Communication</p>
                  <p className="text-sm text-gray-600">الهاتف: 0022244292222</p>
                  <p className="text-sm text-gray-600">البريد: info@scl-communication.mr</p>
                </div>
                <div className="bg-gray-50 p-4 rounded">
                  <p className="font-semibold text-blue-900 mb-2">الطرف الثاني (العميل):</p>
                  <p className="text-sm"><strong>الاسم:</strong> {registration.fullName}</p>
                  <p className="text-sm"><strong>الهاتف:</strong> {registration.phoneNumber}</p>
                  {registration.email && <p className="text-sm"><strong>البريد:</strong> {registration.email}</p>}
                </div>
              </div>
            </div>

            {/* Service Details */}
            <div>
              <h3 className="font-bold text-lg mb-3">تفاصيل الخدمة:</h3>
              <div className="bg-blue-50 p-4 rounded space-y-2">
                <p><strong>الباقة المختارة:</strong> {getPackageLabel(registration.packageType)}</p>
                <p><strong>الاشتراك الشهري:</strong> {getPackagePrice(registration.packageType)} أوقية موريتانية</p>
                <p><strong>تكلفة المودم:</strong> 1,000 أوقية موريتانية (دفعة واحدة)</p>
                <p><strong>رسوم التركيب:</strong> مجانية</p>
                <p className="text-sm text-gray-600 mt-2">* الأسعار شاملة جميع الضرائب</p>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div>
              <h3 className="font-bold text-lg mb-3">الشروط والأحكام:</h3>
              <div className="bg-gray-50 p-4 rounded space-y-3 text-sm max-h-96 overflow-y-auto">
                <div>
                  <p className="font-semibold mb-1">1. مدة العقد:</p>
                  <p className="text-gray-700">يسري هذا العقد من تاريخ التوقيع ويستمر حتى إشعار أحد الطرفين برغبته في إنهائه قبل 30 يوماً على الأقل.</p>
                </div>
                
                <div>
                  <p className="font-semibold mb-1">2. التزامات مقدم الخدمة (SCL Communication):</p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 mr-4">
                    <li>توفير خدمة الإنترنت عبر الألياف البصرية بالسرعة المتفق عليها</li>
                    <li>تركيب المعدات اللازمة (المودم) في موقع العميل</li>
                    <li>تقديم الدعم الفني عند الحاجة</li>
                    <li>إصلاح الأعطال الفنية في أقرب وقت ممكن</li>
                  </ul>
                </div>

                <div>
                  <p className="font-semibold mb-1">3. التزامات العميل:</p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 mr-4">
                    <li>دفع الاشتراك الشهري في موعده المحدد</li>
                    <li>دفع تكلفة المودم (1,000 أوقية) عند التركيب</li>
                    <li>المحافظة على المعدات المقدمة من الشركة</li>
                    <li>عدم استخدام الخدمة لأغراض غير قانونية</li>
                    <li>إعادة المعدات عند إنهاء العقد</li>
                  </ul>
                </div>

                <div>
                  <p className="font-semibold mb-1">4. الدفع والفوترة:</p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 mr-4">
                    <li>يتم الدفع شهرياً مقدماً</li>
                    <li>في حالة التأخر عن الدفع لمدة 15 يوماً، يحق للشركة إيقاف الخدمة</li>
                    <li>تكلفة المودم غير قابلة للاسترداد</li>
                  </ul>
                </div>

                <div>
                  <p className="font-semibold mb-1">5. إنهاء العقد:</p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 mr-4">
                    <li>يحق لأي من الطرفين إنهاء العقد بإشعار مسبق 30 يوماً</li>
                    <li>يجب على العميل إعادة جميع المعدات عند إنهاء العقد</li>
                    <li>في حالة تلف المعدات، يتحمل العميل تكلفة الإصلاح أو الاستبدال</li>
                  </ul>
                </div>

                <div>
                  <p className="font-semibold mb-1">6. المسؤولية:</p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 mr-4">
                    <li>الشركة غير مسؤولة عن انقطاع الخدمة بسبب أعطال خارجة عن إرادتها</li>
                    <li>الشركة غير مسؤولة عن المحتوى الذي يتم تحميله أو مشاركته عبر الخدمة</li>
                  </ul>
                </div>

                <div>
                  <p className="font-semibold mb-1">7. حماية البيانات:</p>
                  <p className="text-gray-700">تلتزم الشركة بحماية بيانات العميل الشخصية وعدم مشاركتها مع أطراف ثالثة دون موافقة العميل.</p>
                </div>
              </div>
            </div>

            {/* Agreement Checkbox */}
            <div className="flex items-start gap-3 bg-yellow-50 p-4 rounded border border-yellow-200">
              <Checkbox
                id="agree"
                checked={agreed}
                onCheckedChange={(checked) => setAgreed(checked as boolean)}
                className="mt-1"
              />
              <label htmlFor="agree" className="text-sm cursor-pointer">
                أوافق على جميع الشروط والأحكام المذكورة أعلاه، وأقر بأنني قرأتها وفهمتها بالكامل. أتعهد بالالتزام بجميع البنود الواردة في هذا العقد.
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Signature Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Pen className="w-5 h-5" />
              التوقيع الإلكتروني
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              يرجى التوقيع في المربع أدناه باستخدام الماوس أو اللمس:
            </p>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg bg-white">
              <canvas
                ref={canvasRef}
                className="w-full h-48 cursor-crosshair touch-none"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
              />
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={clearSignature}
                className="flex-1"
                disabled={!hasSignature}
              >
                مسح التوقيع
              </Button>
              <Button
                onClick={handleSign}
                className="flex-1 bg-green-600 hover:bg-green-700"
                disabled={!agreed || !hasSignature || signContractMutation.isPending}
              >
                {signContractMutation.isPending ? "جاري التوقيع..." : "توقيع العقد"}
              </Button>
            </div>

            <p className="text-xs text-gray-500 text-center">
              بالتوقيع على هذا العقد، فإنك توافق على جميع الشروط والأحكام المذكورة أعلاه
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


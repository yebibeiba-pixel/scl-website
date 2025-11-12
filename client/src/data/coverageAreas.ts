// مناطق التغطية بالألياف البصرية في نواكشوط
// Coverage areas for fiber optic in Nouakchott

export interface CoverageArea {
  id: string;
  name: string;
  nameFr: string;
  status: 'available' | 'coming_soon' | 'not_available';
  coordinates: [number, number][];
  color: string;
}

export const coverageAreas: CoverageArea[] = [
  {
    id: 'tevragh_zeina',
    name: 'تفرغ زينة',
    nameFr: 'Tevragh Zeina',
    status: 'available',
    coordinates: [
      [18.0950, -15.9650],
      [18.0950, -15.9450],
      [18.1150, -15.9450],
      [18.1150, -15.9650],
    ],
    color: '#22c55e', // أخضر - متاح
  },
  {
    id: 'ksar',
    name: 'القصر',
    nameFr: 'Ksar',
    status: 'available',
    coordinates: [
      [18.0850, -15.9800],
      [18.0850, -15.9600],
      [18.1050, -15.9600],
      [18.1050, -15.9800],
    ],
    color: '#22c55e',
  },
  {
    id: 'ilot_k',
    name: 'إيلوت ك',
    nameFr: 'Îlot K',
    status: 'available',
    coordinates: [
      [18.0750, -15.9700],
      [18.0750, -15.9500],
      [18.0950, -15.9500],
      [18.0950, -15.9700],
    ],
    color: '#22c55e',
  },
  {
    id: 'sebkha',
    name: 'السبخة',
    nameFr: 'Sebkha',
    status: 'coming_soon',
    coordinates: [
      [18.0650, -15.9900],
      [18.0650, -15.9700],
      [18.0850, -15.9700],
      [18.0850, -15.9900],
    ],
    color: '#eab308', // أصفر - قريباً
  },
  {
    id: 'arafat',
    name: 'عرفات',
    nameFr: 'Arafat',
    status: 'coming_soon',
    coordinates: [
      [18.1150, -15.9800],
      [18.1150, -15.9600],
      [18.1350, -15.9600],
      [18.1350, -15.9800],
    ],
    color: '#eab308',
  },
  {
    id: 'dar_naim',
    name: 'دار النعيم',
    nameFr: 'Dar Naim',
    status: 'not_available',
    coordinates: [
      [18.0550, -16.0000],
      [18.0550, -15.9800],
      [18.0750, -15.9800],
      [18.0750, -16.0000],
    ],
    color: '#ef4444', // أحمر - غير متاح
  },
];

// دالة للتحقق من وجود نقطة داخل مضلع
export function isPointInPolygon(
  point: [number, number],
  polygon: [number, number][]
): boolean {
  const [lat, lng] = point;
  let inside = false;

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [lat1, lng1] = polygon[i];
    const [lat2, lng2] = polygon[j];

    const intersect =
      lng1 > lng &&
      lng2 <= lng &&
      (lng - lng2) * (lat1 - lat2) < (lat - lat2) * (lng1 - lng2);

    if (intersect) inside = !inside;
  }

  return inside;
}

// دالة للتحقق من حالة التغطية لموقع معين
export function checkCoverageStatus(
  latitude: number,
  longitude: number
): {
  status: 'available' | 'coming_soon' | 'not_available';
  area?: CoverageArea;
  message: string;
  messageFr: string;
} {
  const point: [number, number] = [latitude, longitude];

  for (const area of coverageAreas) {
    if (isPointInPolygon(point, area.coordinates)) {
      const messages = {
        available: {
          ar: `موقعك في منطقة ${area.name} - الخدمة متاحة الآن! 🎉`,
          fr: `Votre emplacement est dans ${area.nameFr} - Service disponible maintenant ! 🎉`,
        },
        coming_soon: {
          ar: `موقعك في منطقة ${area.name} - الخدمة قريباً! ⏳`,
          fr: `Votre emplacement est dans ${area.nameFr} - Service bientôt disponible ! ⏳`,
        },
        not_available: {
          ar: `موقعك في منطقة ${area.name} - الخدمة غير متاحة حالياً ❌`,
          fr: `Votre emplacement est dans ${area.nameFr} - Service non disponible actuellement ❌`,
        },
      };

      return {
        status: area.status,
        area,
        message: messages[area.status].ar,
        messageFr: messages[area.status].fr,
      };
    }
  }

  return {
    status: 'not_available',
    message: 'موقعك خارج مناطق التغطية الحالية',
    messageFr: 'Votre emplacement est en dehors des zones de couverture actuelles',
  };
}


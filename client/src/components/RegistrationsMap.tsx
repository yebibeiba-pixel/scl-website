import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polygon } from 'react-leaflet';
import { Icon, LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { coverageAreas } from '@/data/coverageAreas';

// Fix for default marker icons in React-Leaflet
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (Icon.Default.prototype as any)._getIconUrl;
Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

interface Registration {
  id: string | number;
  fullName: string;
  phoneNumber: string;
  email?: string | null;
  latitude?: string | null;
  longitude?: string | null;
  packageType: string;
  status: string;
  createdAt: string | Date | null;
}

interface RegistrationsMapProps {
  registrations: Registration[];
}

export function RegistrationsMap({ registrations }: RegistrationsMapProps) {
  // نواكشوط - الإحداثيات المركزية
  const nouakchottCenter: LatLngExpression = [18.0735, -15.9582];

  // تصفية التسجيلات التي لديها إحداثيات
  const registrationsWithLocation = registrations.filter(
    (reg) => reg.latitude && reg.longitude
  );

  return (
    <div className="w-full h-[600px] rounded-lg overflow-hidden shadow-lg border-2 border-gray-200">
      <MapContainer
        center={nouakchottCenter}
        zoom={12}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* رسم مناطق التغطية */}
        {coverageAreas.map((area) => (
          <Polygon
            key={area.id}
            positions={area.coordinates as LatLngExpression[]}
            pathOptions={{
              color: area.color,
              fillColor: area.color,
              fillOpacity: 0.3,
              weight: 2,
            }}
          >
            <Popup>
              <div className="text-center">
                <h3 className="font-bold text-lg">{area.name}</h3>
                <p className="text-sm text-gray-600">{area.nameFr}</p>
                <p className="text-sm font-semibold mt-2">
                  {area.status === 'available' && '✅ متاح الآن'}
                  {area.status === 'coming_soon' && '⏳ قريباً'}
                  {area.status === 'not_available' && '❌ غير متاح'}
                </p>
              </div>
            </Popup>
          </Polygon>
        ))}

        {/* عرض نقاط التسجيلات */}
        {registrationsWithLocation.map((reg) => {
          const lat = parseFloat(reg.latitude!);
          const lng = parseFloat(reg.longitude!);

          if (isNaN(lat) || isNaN(lng)) return null;

          return (
            <Marker key={reg.id} position={[lat, lng]}>
              <Popup>
                <div className="min-w-[200px]">
                  <h3 className="font-bold text-lg mb-2">{reg.fullName}</h3>
                  <div className="space-y-1 text-sm">
                    <p>
                      <strong>📞 الهاتف:</strong> {reg.phoneNumber}
                    </p>
                    {reg.email && (
                      <p>
                        <strong>📧 البريد:</strong> {reg.email}
                      </p>
                    )}
                    <p>
                      <strong>📦 الباقة:</strong>{' '}
                      {reg.packageType === '100mbps' && '100 ميغابت'}
                      {reg.packageType === '200mbps' && '200 ميغابت'}
                      {reg.packageType === '500mbps' && '500 ميغابت'}
                    </p>
                    <p>
                      <strong>📅 التاريخ:</strong>{' '}
                      {reg.createdAt ? new Date(reg.createdAt).toLocaleDateString('ar-MR') : '-'}
                    </p>
                    <p>
                      <strong>📍 الحالة:</strong>{' '}
                      <span
                        className={`font-semibold ${
                          reg.status === 'pending'
                            ? 'text-yellow-600'
                            : reg.status === 'contacted'
                            ? 'text-blue-600'
                            : reg.status === 'installed'
                            ? 'text-green-600'
                            : 'text-red-600'
                        }`}
                      >
                        {reg.status === 'pending' && 'قيد الانتظار'}
                        {reg.status === 'contacted' && 'تم الاتصال'}
                        {reg.status === 'installed' && 'تم التركيب'}
                        {reg.status === 'cancelled' && 'ملغي'}
                      </span>
                    </p>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}


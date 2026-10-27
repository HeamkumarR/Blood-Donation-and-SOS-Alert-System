import React, { useState, useEffect, useCallback } from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
  useMap,
} from '@vis.gl/react-google-maps';
import { Donor, BloodGroup, BloodBankCenter, SOSAlert } from '../types';
import {
  Navigation,
  Phone,
  Crosshair,
  ShieldCheck,
  Building2,
  AlertOctagon,
  Layers,
  Send,
  Compass,
  ArrowRight,
  Radio,
} from 'lucide-react';

interface GoogleMapsGPSProps {
  donors: Donor[];
  bloodBanks?: BloodBankCenter[];
  sosAlerts?: SOSAlert[];
  selectedGroup: BloodGroup | 'ALL';
  selectedDonor: Donor | null;
  onSelectDonor: (donor: Donor) => void;
  onRequestFromDonor?: (donor: Donor) => void;
}

const GOOGLE_MAPS_API_KEY =
  import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyDKFkCZiE6VhSB3Yf5H_snZo85JADwHywQ';

// Controller component to pan/zoom map programmatically
const MapController: React.FC<{
  center: { lat: number; lng: number };
  zoom: number;
}> = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    if (map) {
      map.panTo(center);
      map.setZoom(zoom);
    }
  }, [map, center, zoom]);
  return null;
};

// Polyline Route renderer
const RoutePolyline: React.FC<{
  origin: { lat: number; lng: number };
  destination: { lat: number; lng: number };
}> = ({ origin, destination }) => {
  const map = useMap();

  useEffect(() => {
    const googleMaps = (window as unknown as { google?: { maps?: { Polyline: new (opts: unknown) => { setMap: (m: unknown) => void } } } }).google?.maps;
    if (!map || !googleMaps) return;

    const line = new googleMaps.Polyline({
      path: [origin, destination],
      geodesic: true,
      strokeColor: '#e11d48',
      strokeOpacity: 0.9,
      strokeWeight: 4,
    });

    line.setMap(map);

    return () => {
      line.setMap(null);
    };
  }, [map, origin, destination]);

  return null;
};

export const TAMIL_NADU_REGIONS = [
  { name: 'Chennai Central', lat: 13.0827, lng: 80.2707, zoom: 14 },
  { name: 'Anna Nagar, Chennai', lat: 13.085, lng: 80.2101, zoom: 14 },
  { name: 'T. Nagar, Chennai', lat: 13.0418, lng: 80.2341, zoom: 14 },
  { name: 'Adyar, Chennai', lat: 13.0067, lng: 80.2573, zoom: 14 },
  { name: 'Tambaram, Chennai', lat: 12.9249, lng: 80.1165, zoom: 13 },
  { name: 'Coimbatore', lat: 11.0028, lng: 76.9669, zoom: 13 },
  { name: 'Madurai', lat: 9.9252, lng: 78.1198, zoom: 13 },
];

export const GoogleMapsGPS: React.FC<GoogleMapsGPSProps> = ({
  donors,
  bloodBanks = [],
  sosAlerts = [],
  selectedGroup,
  selectedDonor,
  onSelectDonor,
  onRequestFromDonor,
}) => {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number }>({
    lat: 13.0827,
    lng: 80.2707, // Chennai, Tamil Nadu
  });
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>({
    lat: 13.0827,
    lng: 80.2707,
  });
  const [mapZoom, setMapZoom] = useState<number>(13);
  const [mapTypeId, setMapTypeId] = useState<'roadmap' | 'satellite' | 'hybrid'>('roadmap');
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [gpsActive, setGpsActive] = useState<boolean>(false);
  const [selectedRegion, setSelectedRegion] = useState<string>('Chennai Central');

  // Jump to specific Tamil Nadu locality
  const handleSelectRegion = (regionName: string) => {
    const found = TAMIL_NADU_REGIONS.find(r => r.name === regionName);
    if (found) {
      setSelectedRegion(found.name);
      setMapCenter({ lat: found.lat, lng: found.lng });
      setMapZoom(found.zoom);
    }
  };

  // Active InfoWindow state
  const [activeMarkerInfo, setActiveMarkerInfo] = useState<{
    type: 'DONOR' | 'BANK' | 'SOS' | 'USER';
    donor?: Donor;
    bank?: BloodBankCenter;
    sos?: SOSAlert;
    position: { lat: number; lng: number };
  } | null>(null);

  // Filter donors by blood group
  const filteredDonors = donors.filter(
    d => selectedGroup === 'ALL' || d.bloodGroup === selectedGroup
  );

  // Acquire Real GPS coordinates via browser Geolocation API
  const handleGetLocation = useCallback(() => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      pos => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserLocation(coords);
        setMapCenter(coords);
        setMapZoom(14);
        setIsLocating(false);
        setGpsActive(true);
      },
      () => {
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }, []);

  // Sync center when donor is selected
  useEffect(() => {
    if (selectedDonor) {
      setMapCenter({ lat: selectedDonor.latitude, lng: selectedDonor.longitude });
      setMapZoom(15);
      setActiveMarkerInfo({
        type: 'DONOR',
        donor: selectedDonor,
        position: { lat: selectedDonor.latitude, lng: selectedDonor.longitude },
      });
    }
  }, [selectedDonor]);

  return (
    <div className="relative w-full h-[520px] rounded-2xl overflow-hidden border border-slate-200 shadow-md">
      <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
        <Map
          mapId="DEMO_MAP_ID"
          internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
          defaultCenter={mapCenter}
          defaultZoom={mapZoom}
          mapTypeId={mapTypeId}
          gestureHandling="greedy"
          disableDefaultUI={false}
          style={{ width: '100%', height: '100%' }}
        >
          <MapController center={mapCenter} zoom={mapZoom} />

          {/* User's Current GPS Location Marker */}
          <AdvancedMarker
            position={userLocation}
            title="Your Live GPS Position"
            onClick={() =>
              setActiveMarkerInfo({
                type: 'USER',
                position: userLocation,
              })
            }
          >
            <div className="relative flex items-center justify-center">
              <span className="absolute w-8 h-8 rounded-full bg-rose-500/30 animate-ping" />
              <div className="w-5 h-5 rounded-full bg-rose-600 border-2 border-white shadow-xl flex items-center justify-center">
                <Compass className="w-3 h-3 text-white" />
              </div>
            </div>
          </AdvancedMarker>

          {/* Draw Polyline if navigating to selected donor */}
          {selectedDonor && (
            <RoutePolyline
              origin={userLocation}
              destination={{
                lat: selectedDonor.latitude,
                lng: selectedDonor.longitude,
              }}
            />
          )}

          {/* Plotted Registered Donors */}
          {filteredDonors.map(donor => {
            const isSelected = selectedDonor?.id === donor.id;
            return (
              <AdvancedMarker
                key={donor.id}
                position={{ lat: donor.latitude, lng: donor.longitude }}
                title={`${donor.name} (${donor.bloodGroup})`}
                onClick={() => {
                  onSelectDonor(donor);
                  setActiveMarkerInfo({
                    type: 'DONOR',
                    donor,
                    position: { lat: donor.latitude, lng: donor.longitude },
                  });
                }}
              >
                <Pin
                  background={isSelected ? '#e11d48' : donor.available ? '#16a34a' : '#475569'}
                  glyphColor="#ffffff"
                  borderColor={isSelected ? '#ffffff' : donor.available ? '#22c55e' : '#334155'}
                  scale={isSelected ? 1.25 : 1.0}
                  glyphText={donor.bloodGroup}
                />
              </AdvancedMarker>
            );
          })}

          {/* Plotted Blood Bank Centers */}
          {bloodBanks.map(bank => (
            <AdvancedMarker
              key={bank.id}
              position={{ lat: bank.latitude, lng: bank.longitude }}
              title={bank.name}
              onClick={() =>
                setActiveMarkerInfo({
                  type: 'BANK',
                  bank,
                  position: { lat: bank.latitude, lng: bank.longitude },
                })
              }
            >
              <Pin
                background="#2563eb"
                glyphColor="#ffffff"
                borderColor="#1d4ed8"
                glyphText="+"
              />
            </AdvancedMarker>
          ))}

          {/* Plotted Active Emergency SOS Incidents */}
          {sosAlerts
            .filter(s => s.status === 'ACTIVE')
            .map(sos => (
              <AdvancedMarker
                key={sos.id}
                position={{ lat: sos.latitude, lng: sos.longitude }}
                title={`SOS: ${sos.bloodGroup} Needed`}
                onClick={() =>
                  setActiveMarkerInfo({
                    type: 'SOS',
                    sos,
                    position: { lat: sos.latitude, lng: sos.longitude },
                  })
                }
              >
                <div className="relative">
                  <span className="absolute -inset-1 rounded-full bg-rose-600 animate-ping opacity-75" />
                  <Pin
                    background="#b91c1c"
                    glyphColor="#ffffff"
                    borderColor="#7f1d1d"
                    glyphText="SOS"
                  />
                </div>
              </AdvancedMarker>
            ))}

          {/* Active InfoWindow */}
          {activeMarkerInfo && (
            <InfoWindow
              position={activeMarkerInfo.position}
              onCloseClick={() => setActiveMarkerInfo(null)}
            >
              <div className="p-2 min-w-[200px] text-xs space-y-1.5 text-slate-800">
                {activeMarkerInfo.type === 'USER' && (
                  <div>
                    <h4 className="font-bold text-slate-900 flex items-center gap-1">
                      <Compass className="w-3.5 h-3.5 text-rose-600" />
                      <span>Your GPS Coordinates</span>
                    </h4>
                    <p className="text-slate-500 font-mono text-[11px] mt-0.5">
                      Lat: {userLocation.lat.toFixed(4)}, Lng: {userLocation.lng.toFixed(4)}
                    </p>
                  </div>
                )}

                {activeMarkerInfo.type === 'DONOR' && activeMarkerInfo.donor && (
                  <div>
                    <div className="flex items-center justify-between gap-2 border-b pb-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-900">
                          {activeMarkerInfo.donor.name}
                        </span>
                        {activeMarkerInfo.donor.verified && (
                          <ShieldCheck className="w-3 h-3 text-emerald-600" />
                        )}
                      </div>
                      <span className="font-mono font-bold text-rose-600">
                        {activeMarkerInfo.donor.bloodGroup}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-mono mt-1">
                      {activeMarkerInfo.donor.distanceKm} km away · {activeMarkerInfo.donor.city}
                    </p>
                    <p className="text-[11px] text-emerald-700 font-medium">
                      {activeMarkerInfo.donor.available ? 'Ready for donation' : 'Currently resting'}
                    </p>
                    <div className="pt-2 flex items-center gap-1.5">
                      <a
                        href={`tel:${activeMarkerInfo.donor.phone}`}
                        className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded font-semibold text-[10px] flex items-center gap-1"
                      >
                        <Phone className="w-2.5 h-2.5" />
                        <span>Call</span>
                      </a>
                      {onRequestFromDonor && (
                        <button
                          onClick={() => onRequestFromDonor(activeMarkerInfo.donor!)}
                          className="px-2 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded font-semibold text-[10px]"
                        >
                          Request Blood
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {activeMarkerInfo.type === 'BANK' && activeMarkerInfo.bank && (
                  <div>
                    <h4 className="font-bold text-slate-900 flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-blue-600" />
                      <span>{activeMarkerInfo.bank.name}</span>
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {activeMarkerInfo.bank.address}
                    </p>
                    <p className="text-[11px] font-mono text-slate-700">
                      Hours: {activeMarkerInfo.bank.operatingHours}
                    </p>
                    <a
                      href={`tel:${activeMarkerInfo.bank.phone}`}
                      className="mt-1 inline-flex items-center gap-1 text-[11px] text-blue-600 font-semibold"
                    >
                      <Phone className="w-3 h-3" />
                      <span>{activeMarkerInfo.bank.phone}</span>
                    </a>
                  </div>
                )}

                {activeMarkerInfo.type === 'SOS' && activeMarkerInfo.sos && (
                  <div>
                    <h4 className="font-bold text-rose-700 flex items-center gap-1">
                      <AlertOctagon className="w-3.5 h-3.5" />
                      <span>ACTIVE EMERGENCY SOS</span>
                    </h4>
                    <p className="text-slate-800 font-semibold mt-0.5">
                      {activeMarkerInfo.sos.bloodGroup} Blood Required
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Location: {activeMarkerInfo.sos.location}
                    </p>
                    <p className="text-[10px] text-slate-400 font-mono">
                      {activeMarkerInfo.sos.respondersCount} Units Alerted
                    </p>
                  </div>
                )}
              </div>
            </InfoWindow>
          )}
        </Map>
      </APIProvider>

      {/* Floating GPS, Region Jumper and Style Controls on Map */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2 max-w-[220px]">
        {/* Tamil Nadu Region Jumper */}
        <div className="bg-white/95 backdrop-blur-md p-1.5 rounded-xl border border-slate-200 shadow-md">
          <label className="block text-[10px] font-bold text-slate-500 uppercase px-1 mb-0.5">
            Tamil Nadu Locality
          </label>
          <select
            value={selectedRegion}
            onChange={e => handleSelectRegion(e.target.value)}
            className="w-full text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-lg p-1.5 focus:outline-none focus:ring-1 focus:ring-rose-500"
          >
            {TAMIL_NADU_REGIONS.map(reg => (
              <option key={reg.name} value={reg.name}>
                {reg.name}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleGetLocation}
          disabled={isLocating}
          className={`px-3 py-2 rounded-xl text-xs font-semibold shadow-lg backdrop-blur-md flex items-center justify-center gap-1.5 transition-all ${
            gpsActive
              ? 'bg-rose-600 text-white shadow-rose-600/30'
              : 'bg-white/95 text-slate-800 border border-slate-200 hover:bg-white'
          }`}
        >
          <Crosshair className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
          <span>{isLocating ? 'Acquiring GPS...' : gpsActive ? 'GPS Locked' : 'Locate Me (GPS)'}</span>
        </button>

        <div className="bg-white/95 backdrop-blur-md p-1 rounded-xl border border-slate-200 shadow-md flex items-center justify-center gap-1">
          <button
            onClick={() => setMapTypeId('roadmap')}
            className={`flex-1 py-1 rounded-lg text-[11px] font-medium transition-colors ${
              mapTypeId === 'roadmap' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Street
          </button>
          <button
            onClick={() => setMapTypeId('satellite')}
            className={`flex-1 py-1 rounded-lg text-[11px] font-medium transition-colors ${
              mapTypeId === 'satellite' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Satellite
          </button>
        </div>
      </div>
    </div>
  );
};

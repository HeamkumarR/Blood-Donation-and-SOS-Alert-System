import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BloodGroup, BloodComponent, BloodBankCenter } from '../../types';
import {
  Search,
  Building2,
  Phone,
  MapPin,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Filter,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { NavigationTab } from '../../components/Sidebar';

interface BloodAvailabilitySearchProps {
  onNavigate: (tab: NavigationTab) => void;
}

export const BloodAvailabilitySearch: React.FC<BloodAvailabilitySearchProps> = ({ onNavigate }) => {
  const { bloodBanks, bloodStock } = useApp();

  const [selectedGroup, setSelectedGroup] = useState<BloodGroup | 'ALL'>('ALL');
  const [selectedComponent, setSelectedComponent] = useState<BloodComponent>('Whole Blood');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchCity, setSearchCity] = useState('');

  const bloodGroups: (BloodGroup | 'ALL')[] = [
    'ALL',
    'O-',
    'O+',
    'A-',
    'A+',
    'B-',
    'B+',
    'AB-',
    'AB+',
  ];

  const components: BloodComponent[] = [
    'Whole Blood',
    'Packed Red Blood Cells (PRBC)',
    'Platelet Concentrate (RDP)',
    'Fresh Frozen Plasma (FFP)',
    'Cryoprecipitate',
  ];

  const categories = ['ALL', 'Government', 'Red Cross', 'Charitable', 'Private'];

  const filteredBanks = bloodBanks.filter(bank => {
    const matchesCategory = selectedCategory === 'ALL' || bank.category === selectedCategory;
    const matchesCity =
      !searchCity ||
      bank.city.toLowerCase().includes(searchCity.toLowerCase()) ||
      bank.name.toLowerCase().includes(searchCity.toLowerCase());

    const hasGroupStock =
      selectedGroup === 'ALL' || (bank.componentAvailability[selectedGroup] ?? 0) > 0;

    return matchesCategory && matchesCity && hasGroupStock;
  });

  return (
    <div className="space-y-6">
      {/* Official Header modeled on eRaktKosh Portal */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-rose-700 uppercase tracking-wider mb-1">
            <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse" />
            <span>e-RaktKosh National Health Registry Sync</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">
            Real-Time Blood Availability Search
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Check real-time component availability across licensed Government, Red Cross, Charitable, and Private blood centers.
          </p>
        </div>

        <button
          onClick={() => onNavigate('user-map')}
          className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs self-start sm:self-auto"
        >
          <MapPin className="w-3.5 h-3.5 text-rose-400" />
          <span>View On Interactive Map</span>
        </button>
      </div>

      {/* Filter and Criteria Card */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        {/* Component Selector */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            1. Select Blood Component
          </label>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {components.map(comp => (
              <button
                key={comp}
                onClick={() => setSelectedComponent(comp)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors shrink-0 ${
                  selectedComponent === comp
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {comp}
              </button>
            ))}
          </div>
        </div>

        {/* Blood Group Selector */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            2. Select Blood Group
          </label>
          <div className="grid grid-cols-5 sm:grid-cols-9 gap-1.5">
            {bloodGroups.map(bg => (
              <button
                key={bg}
                onClick={() => setSelectedGroup(bg)}
                className={`py-2 rounded-lg text-xs font-mono font-bold transition-all text-center border ${
                  selectedGroup === bg
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs scale-102'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {bg}
              </button>
            ))}
          </div>
        </div>

        {/* City and Category Filter */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Search City / Facility Name
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchCity}
                onChange={e => setSearchCity(e.target.value)}
                placeholder="e.g. Metro City, District Hospital..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Blood Bank Category
            </label>
            <div className="flex items-center gap-1.5">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`flex-1 py-2 rounded-lg text-xs font-medium transition-colors ${
                    selectedCategory === cat
                      ? 'bg-rose-50 border border-rose-300 text-rose-900 font-semibold'
                      : 'bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Results List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-500 px-1">
          <span>
            Found <strong className="font-mono text-slate-900">{filteredBanks.length}</strong> verified blood centers with stock
          </span>
          <span className="font-mono">
            Component: <strong className="text-slate-900">{selectedComponent}</strong>
          </span>
        </div>

        {filteredBanks.map(bank => {
          const targetUnits =
            selectedGroup === 'ALL'
              ? Object.values(bank.componentAvailability).reduce((a, b) => a + b, 0)
              : bank.componentAvailability[selectedGroup] ?? 0;

          return (
            <div
              key={bank.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-slate-300 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center border border-slate-200 shrink-0">
                  <Building2 className="w-6 h-6 text-rose-600" />
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-400">
                      {bank.licensedNumber}
                    </span>
                    <span className="text-slate-300">·</span>
                    <h3 className="text-sm font-bold text-slate-900">
                      {bank.name}
                    </h3>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                      {bank.category}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{bank.address}, {bank.city}</span>
                    <span className="text-slate-300">·</span>
                    <span className="font-mono font-medium text-slate-700">
                      {bank.distanceKm} km away
                    </span>
                  </p>

                  <div className="mt-2.5 flex flex-wrap items-center gap-3 text-xs text-slate-600 font-mono">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{bank.operatingHours}</span>
                    </span>
                    <span className="text-slate-300">·</span>
                    <span className="text-emerald-700 font-semibold flex items-center gap-0.5">
                      <ShieldCheck className="w-3.5 h-3.5" /> Licensed Center
                    </span>
                  </div>
                </div>
              </div>

              {/* Stock breakdown & Call */}
              <div className="flex flex-row md:flex-col items-center md:items-end justify-between gap-3 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
                <div className="text-left md:text-right">
                  <span className="text-xs text-slate-500 block">
                    {selectedGroup === 'ALL' ? 'Total Available Units' : `Group ${selectedGroup} Units`}
                  </span>
                  <p className="text-2xl font-bold font-mono text-slate-900">
                    {targetUnits}{' '}
                    <span className="text-xs font-normal text-slate-500">units</span>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`tel:${bank.phone}`}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <Phone className="w-3.5 h-3.5 text-slate-600" />
                    <span>{bank.phone}</span>
                  </a>

                  <button
                    onClick={() => onNavigate('user-request-blood')}
                    className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 shadow-xs"
                  >
                    <span>Request Units</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {filteredBanks.length === 0 && (
          <div className="py-12 text-center bg-white rounded-2xl border border-slate-200 p-8">
            <Search className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <h3 className="text-sm font-semibold text-slate-900">
              No matching blood banks found
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Try adjusting the blood group or city filters to view regional reserves.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { User, UserRole } from '../../types';
import {
  Users as UsersIcon,
  Search,
  ShieldCheck,
  ShieldAlert,
  UserCheck,
  Shield,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  XCircle,
  Eye,
  ChevronLeft,
  ChevronRight,
  X,
  Calendar,
  AlertCircle,
} from 'lucide-react';

export const Users: React.FC = () => {
  const { users, currentUser, toggleUserVerification, toggleUserRole } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'ALL' | UserRole>('ALL');
  const [verificationFilter, setVerificationFilter] = useState<'ALL' | 'VERIFIED' | 'UNVERIFIED'>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Selected User Modal State
  const [viewingUser, setViewingUser] = useState<User | null>(null);

  // Demote/Promote Confirmation Modal
  const [confirmingRoleChange, setConfirmingRoleChange] = useState<{
    user: User;
    action: 'promote' | 'demote';
  } | null>(null);

  const filteredUsers = users.filter(u => {
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    const matchesVerification =
      verificationFilter === 'ALL' ||
      (verificationFilter === 'VERIFIED' ? u.verified : !u.verified);
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.phone.includes(searchQuery) ||
      u.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.bloodGroup.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRole && matchesVerification && matchesSearch;
  });

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage) || 1;
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleExecuteRoleChange = () => {
    if (!confirmingRoleChange) return;
    toggleUserRole(confirmingRoleChange.user.id);
    setConfirmingRoleChange(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">
            User Account Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Supervise registered platform accounts, verify identity credentials, and delegate administrative roles.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono font-medium text-slate-500 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-xs">
          <span>Total: {users.length} accounts</span>
          <span>·</span>
          <span className="text-emerald-700">{users.filter(u => u.verified).length} verified</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by name, email, city, or blood group..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>

        {/* Filter Badges */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
          {/* Verification filter */}
          <div className="flex items-center p-1 bg-slate-100 rounded-lg text-xs font-medium">
            {(['ALL', 'VERIFIED', 'UNVERIFIED'] as const).map(v => (
              <button
                key={v}
                onClick={() => {
                  setVerificationFilter(v);
                  setCurrentPage(1);
                }}
                className={`px-2.5 py-1 rounded-md transition-colors text-[11px] ${
                  verificationFilter === v
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {v === 'ALL' ? 'All' : v === 'VERIFIED' ? 'Verified' : 'Unverified'}
              </button>
            ))}
          </div>

          {/* Role tabs */}
          <div className="flex items-center p-1 bg-slate-100 rounded-lg text-xs font-medium">
            {(['ALL', 'USER', 'ADMIN'] as const).map(r => (
              <button
                key={r}
                onClick={() => {
                  setRoleFilter(r);
                  setCurrentPage(1);
                }}
                className={`px-3 py-1 rounded-md transition-colors text-[11px] ${
                  roleFilter === r
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">User & Contact</th>
                <th className="px-4 py-3">Blood Group</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Donor Status</th>
                <th className="px-4 py-3">Verification</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedUsers.map(user => (
                <tr key={user.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 font-mono font-bold text-xs flex items-center justify-center border border-slate-200 shrink-0">
                        {user.bloodGroup}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-slate-900">
                            {user.name}
                          </span>
                          {user.verified && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 font-mono">
                          {user.email} · {user.phone}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3.5">
                    <span className="font-mono font-bold text-slate-900">
                      {user.bloodGroup}
                    </span>
                  </td>

                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1 text-slate-700">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>{user.city}</span>
                    </div>
                  </td>

                  <td className="px-4 py-3.5">
                    <span
                      className={`font-mono text-[11px] font-semibold px-2 py-0.5 rounded border ${
                        user.role === 'ADMIN'
                          ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                          : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>

                  <td className="px-4 py-3.5">
                    <span
                      className={`text-[11px] font-medium ${
                        user.isDonor
                          ? user.donorAvailability
                            ? 'text-emerald-700'
                            : 'text-amber-700'
                          : 'text-slate-400'
                      }`}
                    >
                      {user.isDonor
                        ? user.donorAvailability
                          ? 'Active Donor'
                          : 'Donor (Resting)'
                        : 'Patient Only'}
                    </span>
                  </td>

                  <td className="px-4 py-3.5">
                    <button
                      onClick={() => toggleUserVerification(user.id)}
                      className={`px-2.5 py-1 rounded text-[11px] font-semibold flex items-center gap-1 border transition-colors ${
                        user.verified
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
                          : 'bg-slate-100 text-slate-500 border-slate-300 hover:bg-slate-200'
                      }`}
                    >
                      {user.verified ? (
                        <>
                          <CheckCircle2 className="w-3 h-3" /> Verified
                        </>
                      ) : (
                        'Unverified'
                      )}
                    </button>
                  </td>

                  <td className="px-4 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setViewingUser(user)}
                        title="View Full Profile Details"
                        className="p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {user.id !== currentUser.id && (
                        <button
                          onClick={() =>
                            setConfirmingRoleChange({
                              user,
                              action: user.role === 'ADMIN' ? 'demote' : 'promote',
                            })
                          }
                          className="px-2 py-1 text-[11px] font-medium text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-100 transition-colors"
                        >
                          {user.role === 'ADMIN' ? 'Demote' : 'Promote'}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}

              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    <p className="font-semibold text-slate-700">No users found</p>
                    <p className="text-xs text-slate-400 mt-1">
                      {users.length === 0
                        ? 'No accounts registered in the database yet.'
                        : 'No accounts match the current filter or search criteria.'}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredUsers.length > itemsPerPage && (
          <div className="px-4 py-3 border-t border-slate-200 bg-slate-50/50 flex items-center justify-between text-xs text-slate-600">
            <span>
              Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
              {Math.min(currentPage * itemsPerPage, filteredUsers.length)} of {filteredUsers.length} users
            </span>
            <div className="flex items-center gap-1">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                className="p-1 rounded border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-2 font-mono font-medium">
                Page {currentPage} of {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                className="p-1 rounded border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-40"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* User Profile View Modal (Sanitized, NO passwords, tokens, or credentials) */}
      {viewingUser && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-sm text-slate-700">
                  {viewingUser.bloodGroup}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{viewingUser.name}</h3>
                  <p className="text-xs text-slate-500 font-mono">{viewingUser.role} Account</p>
                </div>
              </div>
              <button
                onClick={() => setViewingUser(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Account ID:</span>
                  <span className="font-mono text-slate-700 font-semibold">{viewingUser.id}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Email Address:</span>
                  <span className="font-mono text-slate-800">{viewingUser.email}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Emergency Mobile:</span>
                  <span className="font-mono text-slate-800">{viewingUser.phone}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Blood Group:</span>
                  <span className="font-bold text-rose-700 font-mono text-sm">{viewingUser.bloodGroup}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">City / District:</span>
                  <span className="font-medium text-slate-800">{viewingUser.city}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Verification Status:</span>
                  <span className={`font-semibold ${viewingUser.verified ? 'text-emerald-700' : 'text-slate-500'}`}>
                    {viewingUser.verified ? 'Identity Verified' : 'Pending Verification'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Voluntary Donor:</span>
                  <span className="font-semibold text-slate-800">
                    {viewingUser.isDonor ? (viewingUser.donorAvailability ? 'Active Standby' : 'Resting') : 'No'}
                  </span>
                </div>
              </div>

              {viewingUser.emergencyContact && (
                <div className="p-3 bg-rose-50/60 rounded-xl border border-rose-200 space-y-1">
                  <p className="font-semibold text-rose-900">Emergency Contact</p>
                  <p className="text-slate-700">
                    {viewingUser.emergencyContact.name} ({viewingUser.emergencyContact.relationship}) ·{' '}
                    <span className="font-mono font-medium">{viewingUser.emergencyContact.phone}</span>
                  </p>
                </div>
              )}
            </div>

            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                onClick={() => setViewingUser(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialog for Role Modification */}
      {confirmingRoleChange && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200">
            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-3">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 text-center">
              Confirm Role Delegation
            </h3>
            <p className="text-xs text-slate-500 mt-2 text-center">
              Are you sure you want to {confirmingRoleChange.action} user{' '}
              <strong className="text-slate-800">{confirmingRoleChange.user.name}</strong> to{' '}
              <strong className="text-slate-800">
                {confirmingRoleChange.action === 'promote' ? 'ADMIN' : 'USER'}
              </strong>
              ?
            </p>
            <div className="mt-5 flex items-center gap-2">
              <button
                onClick={() => setConfirmingRoleChange(null)}
                className="w-1/2 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteRoleChange}
                className="w-1/2 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs"
              >
                Confirm Change
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

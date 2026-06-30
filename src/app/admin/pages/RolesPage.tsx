import { useState, useEffect, useMemo } from 'react';
import { Check, ShieldCheck, Plus, X, Trash2, Search } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import type { PermissionKey, Role, TeamMember } from '../types';

// ── Role Color Presets ─────────────────────────────────────────
const ROLE_PRESETS = [
  { name: 'Burgundy', value: '#8B4949' },
  { name: 'Indigo', value: '#6366F1' },
  { name: 'Amber', value: '#D4AF37' },
  { name: 'Sage Green', value: '#4A7C59' },
  { name: 'Violet', value: '#8B5CF6' },
  { name: 'Rose', value: '#EC4899' },
  { name: 'Teal', value: '#14B8A6' },
  { name: 'Ocean Blue', value: '#3B82F6' },
];

// ── Permission display labels ─────────────────────────────────
const PERMISSION_LABELS: Record<PermissionKey, string> = {
  products:     'Products',
  orders:       'Orders',
  leads:        'Leads Console',
  vendors:      'Partners',
  corporate:    'Corporate B2B',
  upload_files: 'Upload Files',
  contents:     'Contents',
  customers:    'Customers',
  payments:     'Payments',
  settings:     'Settings',
  promotions:   'Promotions',
  finance:      'Finance Ledger',
  marketing:    'Marketing Hub',
};

const ALL_PERMISSIONS: PermissionKey[] = [
  'products', 'orders', 'leads', 'vendors', 'corporate',
  'upload_files', 'contents', 'customers', 'payments',
  'settings', 'promotions', 'finance', 'marketing',
];

// ── Avatar Component ──────────────────────────────────────────
function Avatar({ name }: { name: string }) {
  const initials = name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
  const hue = name.charCodeAt(0) % 360;
  return (
    <div
      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 select-none"
      style={{ background: `linear-gradient(135deg, hsl(${hue},55%,40%), hsl(${(hue + 40) % 360},55%,55%))` }}
    >
      {initials}
    </div>
  );
}

// ── Role Card ─────────────────────────────────────────────────
interface RoleCardProps {
  role: Role;
  selected: boolean;
  membersCount: number;
  onSelect: () => void;
}

function RoleCard({ role, selected, membersCount, onSelect }: RoleCardProps) {
  const permCount = Object.values(role.permissions).filter(Boolean).length;

  return (
    <button
      onClick={onSelect}
      className={`admin-card text-left transition-all w-full ${
        selected ? 'ring-2 shadow-lg' : 'hover:shadow-md'
      }`}
      style={{
        borderLeft: `4px solid ${role.color}`,
        ringColor: selected ? role.color : undefined,
        boxShadow: selected ? `0 0 0 2px ${role.color}40` : undefined,
      } as React.CSSProperties}
    >
      <div className="flex items-start gap-3">
        <div
          className="w-3 h-3 rounded-full flex-shrink-0 mt-1"
          style={{ background: role.color }}
        />
        <div className="flex-1 min-w-0">
          <p className="font-bold text-[#1a1410] text-sm truncate">{role.name}</p>
          <p className="text-xs text-gray-400 mt-0.5">
            {membersCount} member{membersCount !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <span
          className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full"
          style={{ background: `${role.color}18`, color: role.color }}
        >
          <ShieldCheck size={11} />
          {permCount}/{ALL_PERMISSIONS.length} perms
        </span>
        <span
          className="text-xs font-medium px-2.5 py-1 rounded-lg transition-all"
          style={
            selected
              ? { background: role.color, color: '#fff' }
              : { background: '#f5f0e8', color: '#4a4a4a' }
          }
        >
          {selected ? 'Editing' : 'Edit'}
        </span>
      </div>
    </button>
  );
}

// ── Permission Toggle Row ─────────────────────────────────────
interface ToggleRowProps {
  label: string;
  enabled: boolean;
  accent: string;
  index: number;
  disabled?: boolean;
  onChange: (val: boolean) => void;
}

function ToggleRow({ label, enabled, accent, index, disabled, onChange }: ToggleRowProps) {
  return (
    <div
      className="flex items-center justify-between px-5 py-3.5"
      style={{
        background: index % 2 === 0 ? '#ffffff' : '#faf8f5',
        opacity: disabled ? 0.75 : 1
      }}
    >
      <span className="text-sm font-medium text-[#4a4a4a]">{label}</span>
      <div className="flex items-center gap-3">
        <span className="text-xs text-gray-405">
          {disabled ? 'Locked (Allowed)' : enabled ? 'Allowed' : 'Denied'}
        </span>
        <button
          className={`admin-toggle ${enabled ? 'active' : ''} ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
          style={enabled ? { background: accent } : undefined}
          onClick={() => {
            if (!disabled) onChange(!enabled);
          }}
          disabled={disabled}
          aria-label={`Toggle ${label}`}
        />
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────
export default function RolesPage() {
  const {
    state,
    updateRole,
    addRole,
    deleteRole,
    addTeamMember,
    updateTeamMember,
    deleteTeamMember,
    addActivityLog,
    rejectApplicant,
    hireApplicant,
    addJobOpening,
    deleteJobOpening
  } = useAdmin();
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(state.roles[0]?.id ?? null);
  const [savedFlash, setSavedFlash] = useState(false);

  // Tab State
  const [activeTab, setActiveTab] = useState<'permissions' | 'team' | 'applications'>('permissions');

  // Hire applicant modal state
  const [showHireModal, setShowHireModal] = useState(false);
  const [hiringApplicantId, setHiringApplicantId] = useState<string | null>(null);
  const [hiringApplicantName, setHiringApplicantName] = useState('');
  const [hiringApplicantEmail, setHiringApplicantEmail] = useState('');
  const [hiringRoleId, setHiringRoleId] = useState(state.roles[0]?.id || '');

  // Job Opening Modal State
  const [showAddOpeningModal, setShowAddOpeningModal] = useState(false);
  const [newJobTitle, setNewJobTitle] = useState('');
  const [newJobDept, setNewJobDept] = useState('Creative Design');
  const [newJobLocation, setNewJobLocation] = useState('Remote');
  const [newJobType, setNewJobType] = useState<'Full-Time' | 'Part-Time' | 'Contract' | 'Internship'>('Full-Time');
  const [newJobDesc, setNewJobDesc] = useState('');

  // Modal State (Role)
  const [showAddModal, setShowAddModal] = useState(false);
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleColor, setNewRoleColor] = useState('#8B4949');

  // Member State
  const [memberSearch, setMemberSearch] = useState('');
  const [memberRoleFilter, setMemberRoleFilter] = useState<'All' | string>('All');

  // Add Member Modal State
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberRoleId, setNewMemberRoleId] = useState(state.roles[0]?.id || '');
  const [newMemberStatus, setNewMemberStatus] = useState<'Active' | 'Inactive'>('Active');

  // Edit Member Modal State
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [editMemberRoleId, setEditMemberRoleId] = useState('');
  const [editMemberStatus, setEditMemberStatus] = useState<'Active' | 'Inactive'>('Active');

  // Select default role ID when loaded
  useEffect(() => {
    if (state.roles.length > 0 && !newMemberRoleId) {
      setNewMemberRoleId(state.roles[0].id);
    }
  }, [state.roles, newMemberRoleId]);

  const selectedRole = state.roles.find((r) => r.id === selectedRoleId) ?? null;

  // Auto-dismiss saved flash
  useEffect(() => {
    if (savedFlash) {
      const t = setTimeout(() => setSavedFlash(false), 2000);
      return () => clearTimeout(t);
    }
  }, [savedFlash]);

  function handleToggle(key: PermissionKey, val: boolean) {
    if (!selectedRole) return;
    updateRole(selectedRole.id, {
      permissions: { ...selectedRole.permissions, [key]: val },
    });
    addActivityLog('Role Updated', `${selectedRole.name}: ${PERMISSION_LABELS[key]} set to ${val ? 'Allowed' : 'Denied'}`);
    setSavedFlash(true);
  }

  function handleAddRole(e: React.FormEvent) {
    e.preventDefault();
    if (!newRoleName.trim()) return;

    const defaultPerms = ALL_PERMISSIONS.reduce((acc, key) => {
      acc[key] = false;
      return acc;
    }, {} as Record<PermissionKey, boolean>);

    const newRole: Role = {
      id: `role-${Date.now()}`,
      name: newRoleName.trim(),
      color: newRoleColor,
      permissions: defaultPerms,
      membersCount: 0,
    };

    addRole(newRole);
    setSelectedRoleId(newRole.id);
    setNewRoleName('');
    setNewRoleColor('#8B4949');
    setShowAddModal(false);
  }

  function handleAddMemberSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!newMemberName.trim() || !newMemberEmail.trim()) return;

    const newMember: TeamMember = {
      id: `m-${Date.now()}`,
      name: newMemberName.trim(),
      email: newMemberEmail.trim().toLowerCase(),
      roleId: newMemberRoleId,
      status: newMemberStatus,
      joinedAt: new Date().toISOString().split('T')[0],
    };

    addTeamMember(newMember);
    setNewMemberName('');
    setNewMemberEmail('');
    setNewMemberStatus('Active');
    setShowAddMemberModal(false);
  }

  function handleAddOpeningSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!newJobTitle.trim() || !newJobDesc.trim()) return;
    addJobOpening({
      title: newJobTitle.trim(),
      department: newJobDept,
      location: newJobLocation.trim(),
      type: newJobType,
      description: newJobDesc.trim()
    });
    setNewJobTitle('');
    setNewJobDesc('');
    setShowAddOpeningModal(false);
  }

  function handleEditMemberSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedMember) return;

    const oldRole = state.roles.find((r) => r.id === selectedMember.roleId);
    const newRole = state.roles.find((r) => r.id === editMemberRoleId);

    updateTeamMember(selectedMember.id, {
      roleId: editMemberRoleId,
      status: editMemberStatus,
    });

    if (selectedMember.roleId !== editMemberRoleId) {
      addActivityLog('Team Role Changed', `${selectedMember.name}: ${oldRole?.name || 'None'} → ${newRole?.name || 'None'}`);
    } else {
      addActivityLog('Team Member Updated', `${selectedMember.name} status set to ${editMemberStatus}`);
    }

    setSelectedMember(null);
  }

  function handleDeleteMemberClick(id: string) {
    if (confirm('Are you sure you want to remove this team member?')) {
      deleteTeamMember(id);
    }
  }

  function handleEditMemberClick(m: TeamMember) {
    setSelectedMember(m);
    setEditMemberRoleId(m.roleId);
    setEditMemberStatus(m.status);
  }

  const filteredTeam = useMemo(() => {
    return state.teamMembers.filter((m) => {
      const matchRole = memberRoleFilter === 'All' || m.roleId === memberRoleFilter;
      const q = memberSearch.toLowerCase();
      const matchSearch = !q || m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q);
      return matchRole && matchSearch;
    });
  }, [state.teamMembers, memberSearch, memberRoleFilter]);

  const roleActivityLogs = useMemo(() => {
    const targetActions = [
      'Role Created', 'Role Deleted', 'Role Updated',
      'Team Member Added', 'Team Member Removed', 'Team Role Changed', 'Team Member Updated'
    ];
    return state.activityLogs
      .filter((log) => targetActions.includes(log.action))
      .slice(0, 3);
  }, [state.activityLogs]);

  return (
    <div className="space-y-8 admin-animate-in">
      {/* Page Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1a1410]" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
            Roles & Permissions
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">Control what each role can access and manage team members</p>
        </div>
        {activeTab === 'permissions' ? (
          <button
            onClick={() => setShowAddModal(true)}
            className="admin-btn admin-btn-primary flex items-center gap-2 cursor-pointer shadow-sm hover:shadow"
          >
            <Plus size={15} />
            <span>Add New Role</span>
          </button>
        ) : activeTab === 'team' ? (
          <button
            onClick={() => setShowAddMemberModal(true)}
            className="admin-btn admin-btn-primary flex items-center gap-2 cursor-pointer shadow-sm hover:shadow"
          >
            <Plus size={15} />
            <span>Add Team Member</span>
          </button>
        ) : activeTab === 'applications' ? (
          <button
            onClick={() => setShowAddOpeningModal(true)}
            className="admin-btn admin-btn-primary flex items-center gap-2 cursor-pointer shadow-sm hover:shadow"
          >
            <Plus size={15} />
            <span>Add Job Opening</span>
          </button>
        ) : null}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-white border border-[#e5e5e5] rounded-xl p-1.5 w-fit flex-wrap">
        <button
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
            activeTab === 'permissions'
              ? 'bg-[#8B4949] text-white shadow-sm'
              : 'text-gray-500 hover:text-[#8B4949] hover:bg-[#f5f0e8]'
          }`}
          onClick={() => setActiveTab('permissions')}
        >
          Permissions Control
        </button>
        <button
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
            activeTab === 'team'
              ? 'bg-[#8B4949] text-white shadow-sm'
              : 'text-gray-500 hover:text-[#8B4949] hover:bg-[#f5f0e8]'
          }`}
          onClick={() => setActiveTab('team')}
        >
          Team Directory
        </button>
        <button
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
            activeTab === 'applications'
              ? 'bg-[#8B4949] text-white shadow-sm'
              : 'text-gray-500 hover:text-[#8B4949] hover:bg-[#f5f0e8]'
          }`}
          onClick={() => setActiveTab('applications')}
        >
          Job Applications ({state.jobApplications?.length ?? 0})
        </button>
      </div>

      {/* ── TAB 1: PERMISSIONS CONTROL ───────────────────────────── */}
      {activeTab === 'permissions' && (
        <>
          {/* Role Cards Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {state.roles.map((role) => {
              const membersCount = state.teamMembers.filter((m) => m.roleId === role.id).length;
              return (
                <RoleCard
                  key={role.id}
                  role={role}
                  selected={selectedRoleId === role.id}
                  membersCount={membersCount}
                  onSelect={() => setSelectedRoleId(role.id)}
                />
              );
            })}
          </div>

          {/* Permission Matrix */}
          {selectedRole && (
            <div className="admin-card p-0 overflow-hidden admin-animate-in">
              {/* Section Title */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#f0f0f0]">
                <div className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ background: selectedRole.color }}
                  />
                  <h2 className="font-bold text-[#1a1410]">{selectedRole.name} — Permissions</h2>
                </div>

                <div className="flex items-center gap-4">
                  {/* Saved indicator */}
                  <div
                    className="flex items-center gap-1.5 text-xs font-semibold transition-all duration-300"
                    style={{
                      color: '#4A7C59',
                      opacity: savedFlash ? 1 : 0,
                      transform: savedFlash ? 'translateY(0)' : 'translateY(4px)',
                    }}
                  >
                    <Check size={13} />
                    Saved
                  </div>

                  {/* Delete Role Button (only for custom roles) */}
                  {selectedRole.id !== 'role-1' && (
                    <button
                      className="text-xs font-bold text-red-500 hover:text-red-700 hover:bg-red-50 px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                      onClick={() => {
                        if (confirm(`Are you sure you want to delete the "${selectedRole.name}" role?`)) {
                          deleteRole(selectedRole.id);
                          setSelectedRoleId(state.roles[0]?.id ?? null);
                        }
                      }}
                    >
                      <Trash2 size={13} />
                      Delete Role
                    </button>
                  )}
                </div>
              </div>

              {/* Toggle Rows */}
              <div className="divide-y divide-[#f0f0f0]">
                {ALL_PERMISSIONS.map((key, index) => (
                  <ToggleRow
                    key={key}
                    label={PERMISSION_LABELS[key]}
                    enabled={selectedRole.permissions[key]}
                    accent={selectedRole.color}
                    index={index}
                    disabled={selectedRole.id === 'role-1'}
                    onChange={(val) => handleToggle(key, val)}
                  />
                ))}
              </div>

              {/* Footer hint */}
              <div className="px-6 py-3 bg-[#faf8f5] border-t border-[#f0f0f0]">
                <p className="text-xs text-gray-405 font-medium">
                  {selectedRole.id === 'role-1'
                    ? '🔒 Super Admin permissions are locked to full access to prevent system lockout.'
                    : 'Changes are saved instantly. Toggle permissions to grant or restrict access.'}
                </p>
              </div>
            </div>
          )}
        </>
      )}

      {/* ── TAB 2: TEAM DIRECTORY ─────────────────────────────────── */}
      {activeTab === 'team' && (
        <div className="space-y-6 admin-animate-in">
          {/* Filters */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="relative flex-1 min-w-[220px]">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                className="admin-input"
                style={{ paddingLeft: '2.5rem' }}
                placeholder="Search team members…"
                value={memberSearch}
                onChange={(e) => setMemberSearch(e.target.value)}
              />
            </div>
            {/* Roles Filter Sub-Tabs */}
            <div className="flex gap-1.5 bg-[#faf8f5] border border-[#e5e5e5] rounded-xl p-1 w-fit flex-wrap">
              <button
                key="All"
                onClick={() => setMemberRoleFilter('All')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  memberRoleFilter === 'All'
                    ? 'bg-[#8B4949] text-white shadow-sm'
                    : 'text-gray-400 hover:text-gray-700 hover:bg-[#f5f0e8]/50'
                }`}
              >
                All Roles
              </button>
              {state.roles.map((role) => {
                const isActive = memberRoleFilter === role.id;
                return (
                  <button
                    key={role.id}
                    onClick={() => setMemberRoleFilter(role.id)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border`}
                    style={
                      isActive
                        ? { background: role.color, color: '#fff', borderColor: role.color }
                        : { color: role.color, borderColor: `${role.color}20`, background: `${role.color}05` }
                    }
                  >
                    {role.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Table */}
          <div className="admin-card p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Member</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Joined</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTeam.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-10 text-gray-400">
                        No team members found
                      </td>
                    </tr>
                  ) : (
                    filteredTeam.map((m) => {
                      const role = state.roles.find((r) => r.id === m.roleId);
                      const activePermsList = role
                        ? Object.keys(role.permissions)
                            .filter((k) => role.permissions[k as PermissionKey])
                            .map((k) => PERMISSION_LABELS[k as PermissionKey])
                            .join(', ')
                        : '';
                      return (
                        <tr key={m.id}>
                          <td>
                            <div className="flex items-center gap-3">
                              <Avatar name={m.name} />
                              <span className="font-semibold text-[#1a1410]">{m.name}</span>
                            </div>
                          </td>
                          <td>
                            <span className="text-sm text-gray-500">{m.email}</span>
                          </td>
                          <td>
                            {role ? (
                              <span
                                className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full border border-current/10 cursor-help"
                                style={{ background: `${role.color}10`, color: role.color }}
                                title={`Access to: ${activePermsList || 'None'}`}
                              >
                                <span className="w-1.5 h-1.5 rounded-full" style={{ background: role.color }} />
                                {role.name}
                              </span>
                            ) : (
                              <span className="text-xs text-gray-450">No Role Assigned</span>
                            )}
                          </td>
                          <td>
                            <span className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full ${
                              m.status === 'Active' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'
                            }`}>
                              {m.status}
                            </span>
                          </td>
                          <td>
                            <span className="text-xs text-gray-400">
                              {new Date(m.joinedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                            </span>
                          </td>
                          <td className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleEditMemberClick(m)}
                                className="text-xs font-bold text-[#8B4949] hover:bg-[#8B4949]/5 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                              >
                                Edit Profile
                              </button>
                              {m.id !== 'm-1' && (
                                <button
                                  onClick={() => handleDeleteMemberClick(m.id)}
                                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-red-500 transition-colors cursor-pointer"
                                  title="Remove Member"
                                >
                                  <Trash2 size={14} />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Role & Team Audit Trail */}
      {roleActivityLogs.length > 0 && (
        <div className="admin-card p-6 bg-white border border-[#e5e5e5] rounded-xl space-y-4 admin-animate-in">
          <div>
            <h3 className="font-bold text-[#1a1410] text-sm tracking-tight">Recent Security & Role Activity</h3>
            <p className="text-xs text-gray-400 mt-0.5">Timeline of access control changes</p>
          </div>
          <div className="space-y-3">
            {roleActivityLogs.map((log) => (
              <div key={log.id} className="flex items-start justify-between text-xs py-1.5 border-b border-[#f0f0f0] last:border-b-0">
                <div className="flex items-center gap-2.5">
                  <span className={`w-2 h-2 rounded-full mt-1.5 ${
                    log.action.includes('Role') ? 'bg-[#8B4949]' : 'bg-blue-500'
                  }`} />
                  <div>
                    <span className="font-bold text-[#1a1410] mr-1.5">{log.action}</span>
                    <span className="text-gray-500">{log.detail}</span>
                  </div>
                </div>
                <span className="text-gray-455 whitespace-nowrap ml-4">{log.timestamp}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Role Modal */}
      {showAddModal && (
        <>
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 admin-animate-in"
            onClick={() => setShowAddModal(false)}
          />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-2xl shadow-2xl z-50 overflow-hidden admin-animate-in">
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#f0f0f0]">
              <h3 className="font-bold text-[#1a1410] text-lg">Create New Role</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleAddRole} className="p-6 space-y-5">
              <div>
                <label className="admin-label">Role Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Auditor, Regional Manager"
                  className="admin-input"
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value)}
                />
              </div>
              <div>
                <label className="admin-label">Accent Color</label>
                <div className="grid grid-cols-4 gap-2.5">
                  {ROLE_PRESETS.map((preset) => {
                    const isSelected = newRoleColor === preset.value;
                    return (
                      <button
                        key={preset.value}
                        type="button"
                        onClick={() => setNewRoleColor(preset.value)}
                        className={`h-10 rounded-xl transition-all relative flex items-center justify-center cursor-pointer border ${
                          isSelected ? 'border-[#1a1410] scale-[1.05] shadow-sm' : 'border-[#e5e5e5] hover:scale-[1.03]'
                        }`}
                        style={{ background: preset.value }}
                        title={preset.name}
                      >
                        {isSelected && <Check size={16} className="text-white drop-shadow-sm stroke-[3]" />}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#f0f0f0]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="admin-btn admin-btn-outline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="admin-btn admin-btn-primary"
                >
                  Create Role
                </button>
              </div>
            </form>
          </div>
        </>
      )}

      {/* Add Member Modal */}
      {showAddMemberModal && (
        <>
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 admin-animate-in"
            onClick={() => setShowAddMemberModal(false)}
          />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-2xl shadow-2xl z-50 overflow-hidden admin-animate-in">
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#f0f0f0]">
              <h3 className="font-bold text-[#1a1410] text-lg">Add Team Member</h3>
              <button
                onClick={() => setShowAddMemberModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleAddMemberSubmit} className="p-6 space-y-5">
              <div>
                <label className="admin-label">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Haris Sen"
                  className="admin-input"
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                />
              </div>
              <div>
                <label className="admin-label">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. haris@eventique.in"
                  className="admin-input"
                  value={newMemberEmail}
                  onChange={(e) => setNewMemberEmail(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="admin-label">Assign Role</label>
                  <select
                    className="admin-select"
                    value={newMemberRoleId}
                    onChange={(e) => setNewMemberRoleId(e.target.value)}
                  >
                    {state.roles.map((r) => (
                      <option key={r.id} value={r.id}>{r.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="admin-label">Status</label>
                  <select
                    className="admin-select"
                    value={newMemberStatus}
                    onChange={(e) => setNewMemberStatus(e.target.value as 'Active' | 'Inactive')}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#f0f0f0]">
                <button
                  type="button"
                  onClick={() => setShowAddMemberModal(false)}
                  className="admin-btn admin-btn-outline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="admin-btn admin-btn-primary"
                >
                  Add Member
                </button>
              </div>
            </form>
          </div>
        </>
      )}

      {/* Edit Member Modal */}
      {selectedMember && (
        <>
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 admin-animate-in"
            onClick={() => setSelectedMember(null)}
          />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-2xl shadow-2xl z-50 overflow-hidden admin-animate-in">
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#f0f0f0]">
              <h3 className="font-bold text-[#1a1410] text-lg">Edit Team Member</h3>
              <button
                onClick={() => setSelectedMember(null)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleEditMemberSubmit} className="p-6 space-y-5">
              <div className="bg-[#faf8f5] p-4 rounded-xl space-y-1 border border-[#e5e5e5]/50">
                <p className="text-sm font-semibold text-[#1a1410]">{selectedMember.name}</p>
                <p className="text-xs text-gray-400">{selectedMember.email}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="admin-label">Role</label>
                  <select
                    className="admin-select"
                    value={editMemberRoleId}
                    onChange={(e) => setEditMemberRoleId(e.target.value)}
                  >
                    {state.roles.map((r) => (
                      <option key={r.id} value={r.id}>{r.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="admin-label">Status</label>
                  <select
                    className="admin-select"
                    value={editMemberStatus}
                    onChange={(e) => setEditMemberStatus(e.target.value as 'Active' | 'Inactive')}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#f0f0f0]">
                <button
                  type="button"
                  onClick={() => setSelectedMember(null)}
                  className="admin-btn admin-btn-outline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="admin-btn admin-btn-primary"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </>
      )}

      {/* ── TAB 3: JOB APPLICATIONS ────────────────────────────── */}
      {activeTab === 'applications' && (
        <div className="space-y-6">
          {/* Section 1: Active Job Openings */}
          <div className="space-y-3">
            <div className="flex justify-between items-center bg-white px-6 py-4 rounded-2xl border border-[#f0ece4] shadow-sm">
              <div>
                <h3 className="text-base font-bold text-[#1a1410]">Active Job Openings</h3>
                <p className="text-xs text-gray-400">Listings visible on the careers page portal</p>
              </div>
            </div>

            {!state.jobOpenings || state.jobOpenings.length === 0 ? (
              <div className="admin-card text-center py-8 text-gray-400 text-xs">
                No active job openings listed.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {state.jobOpenings.map(opening => (
                  <div key={opening.id} className="admin-card border border-[#f0ece4]/80 flex flex-col justify-between hover:border-[#8B4949]/30 transition-all">
                    <div>
                      <div className="flex justify-between items-start">
                        <span className="text-[9px] font-bold text-indigo-750 bg-indigo-50 px-2 py-0.5 rounded-full uppercase tracking-wider">{opening.department}</span>
                        <button
                          onClick={() => {
                            if (confirm(`Are you sure you want to delete the job opening for ${opening.title}?`)) {
                              deleteJobOpening(opening.id);
                            }
                          }}
                          className="p-1 text-gray-400 hover:text-red-650 hover:bg-red-50 rounded-lg transition-colors"
                          title="Remove opening"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                      <h4 className="font-extrabold text-sm text-[#1a1410] mt-2.5">{opening.title}</h4>
                      <p className="text-[11px] text-gray-500 mt-1 line-clamp-3 leading-relaxed">{opening.description}</p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between text-[10px] text-gray-400 font-bold">
                      <span>📍 {opening.location}</span>
                      <span>⏱️ {opening.type}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 2: Submitted Applications */}
          <div className="space-y-3 pt-2">
            <div className="admin-card">
              <h3 className="text-base font-bold text-[#1a1410] mb-1">Received Applications</h3>
              <p className="text-xs text-gray-400">Review, reject or hire candidates applying from the careers portal</p>
            </div>

          <div className="admin-card !p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Candidate</th>
                    <th>Position Details</th>
                    <th>Experience Details</th>
                    <th>Documents & Portfolio</th>
                    <th>Status</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {!state.jobApplications || state.jobApplications.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-12 text-gray-450 text-sm">No job applications submitted.</td>
                    </tr>
                  ) : (
                    state.jobApplications.map(app => (
                      <tr key={app.id} className="hover:bg-[#faf8f5]/50 transition-colors">
                        <td>
                          <p className="font-extrabold text-[#1a1410] text-sm">{app.name}</p>
                          <span className="text-xs text-gray-500">{app.email}</span>
                          <p className="text-[10px] text-gray-450 font-medium">{app.phone}</p>
                        </td>
                        <td>
                          <p className="font-bold text-xs text-[#1a1410]">{app.position}</p>
                          <span className="text-[10px] text-gray-450">{app.appliedAt}</span>
                        </td>
                        <td>
                          <p className="text-xs font-semibold text-[#1a1410]">{app.experience}</p>
                        </td>
                        <td>
                          <div className="flex flex-col gap-1 text-xs">
                            {app.resumeUrl ? (
                              <a href={app.resumeUrl} target="_blank" rel="noreferrer" className="text-[#8B4949] font-bold hover:underline flex items-center gap-0.5">
                                📄 View Resume
                              </a>
                            ) : (
                              <span className="text-gray-400">No Resume</span>
                            )}
                            {app.portfolioUrl ? (
                              <a href={app.portfolioUrl} target="_blank" rel="noreferrer" className="text-[#D4AF37] font-bold hover:underline flex items-center gap-1">
                                🌐 View Portfolio
                              </a>
                            ) : (
                              <span className="text-gray-400">No Portfolio</span>
                            )}
                          </div>
                        </td>
                        <td>
                          <span className={`admin-badge text-[10px] font-bold py-1 px-2.5 rounded-full ${
                            app.status === 'Approved' ? 'bg-green-50 text-green-700' :
                            app.status === 'Rejected' ? 'bg-red-50 text-red-700' :
                            'bg-amber-50 text-amber-700'
                          }`}>
                            {app.status === 'Approved' ? 'Hired' : app.status}
                          </span>
                        </td>
                        <td className="text-right">
                          {app.status === 'Pending' && (
                            <div className="inline-flex gap-2 justify-end">
                              <button
                                onClick={() => {
                                  setHiringApplicantId(app.id);
                                  setHiringApplicantName(app.name);
                                  setHiringApplicantEmail(app.email);
                                  setHiringRoleId(state.roles[0]?.id || '');
                                  setShowHireModal(true);
                                }}
                                className="px-3 py-1 bg-[#8B4949] hover:bg-[#723b3b] text-white font-bold rounded-lg text-[10px] transition-colors"
                              >
                                Hire Candidate
                              </button>
                              <button
                                onClick={() => rejectApplicant(app.id)}
                                className="px-3 py-1 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-lg text-[10px] transition-colors border border-red-200/50"
                              >
                                Reject
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
          </div>
        </div>
      )}

      {/* ── MODAL: Hire Candidate ── */}
      {showHireModal && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 animate-fade-in">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowHireModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 admin-scale-in border border-[#f0ece4]">
            <button onClick={() => setShowHireModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <X size={16} />
            </button>
            <h3 className="text-lg font-bold text-[#1a1410] mb-2">Hire & Add to Team</h3>
            <p className="text-xs text-gray-400 mb-4">Assign a role and onboard <strong>{hiringApplicantName}</strong> to the organization:</p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (hiringApplicantId) {
                  hireApplicant(hiringApplicantId, hiringRoleId);
                  setShowHireModal(false);
                  setHiringApplicantId(null);
                }
              }}
              className="space-y-4"
            >
              <div>
                <label className="admin-label">Email Address</label>
                <input type="email" readOnly value={hiringApplicantEmail} className="admin-input bg-gray-50 text-gray-500 font-bold" />
              </div>
              <div>
                <label className="admin-label">Assign Role *</label>
                <select value={hiringRoleId} onChange={(e) => setHiringRoleId(e.target.value)} className="admin-input font-bold">
                  {state.roles.map(r => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowHireModal(false)} className="flex-1 py-2.5 border border-[#e5e5e5] rounded-xl text-gray-500 font-bold text-xs hover:bg-[#faf8f5]">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 bg-green-600 text-white rounded-xl font-bold text-xs hover:bg-green-700">Appoint & Welcome</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* ── MODAL: Add Job Opening ── */}
      {showAddOpeningModal && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 animate-fade-in">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowAddOpeningModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 admin-scale-in border border-[#f0ece4]">
            <button onClick={() => setShowAddOpeningModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <X size={16} />
            </button>
            <h3 className="text-lg font-bold text-[#1a1410] mb-2">Create Job Posting</h3>
            <p className="text-xs text-gray-400 mb-4">Post a new job opening visible on the public careers page:</p>
            <form onSubmit={handleAddOpeningSubmit} className="space-y-4">
              <div>
                <label className="admin-label">Job Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Senior Frontend Developer"
                  value={newJobTitle}
                  onChange={(e) => setNewJobTitle(e.target.value)}
                  className="admin-input font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="admin-label">Department *</label>
                  <select
                    value={newJobDept}
                    onChange={(e) => setNewJobDept(e.target.value)}
                    className="admin-select font-semibold"
                  >
                    <option value="Creative Design">Creative Design</option>
                    <option value="Technology">Technology</option>
                    <option value="Operations & Client Services">Operations & Client Services</option>
                    <option value="Marketing & Content">Marketing & Content</option>
                  </select>
                </div>
                <div>
                  <label className="admin-label">Job Type *</label>
                  <select
                    value={newJobType}
                    onChange={(e) => setNewJobType(e.target.value as any)}
                    className="admin-select font-semibold"
                  >
                    <option value="Full-Time">Full-Time</option>
                    <option value="Part-Time">Part-Time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="admin-label">Location *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Remote / New Delhi"
                  value={newJobLocation}
                  onChange={(e) => setNewJobLocation(e.target.value)}
                  className="admin-input font-semibold"
                />
              </div>

              <div>
                <label className="admin-label">Job Description *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Enter role responsibilities, skill expectations..."
                  value={newJobDesc}
                  onChange={(e) => setNewJobDesc(e.target.value)}
                  className="admin-textarea font-semibold text-xs"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddOpeningModal(false)}
                  className="flex-1 py-2.5 border border-[#e5e5e5] rounded-xl text-gray-500 font-bold text-xs hover:bg-[#faf8f5]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#8B4949] text-white rounded-xl font-bold text-xs hover:bg-[#723b3b]"
                >
                  Publish Opening
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

import { useEffect, useState } from 'react';
import ApiClient from '../services/api';

const api = ApiClient.getInstance();

type Permission = { id: string; key: string; resource: string; action: string; description?: string };
type User = { id: string; name: string; email: string };

export default function PermissionsPage() {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [selectedPermission, setSelectedPermission] = useState<string | null>(null);
  const [userPerms, setUserPerms] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => { void load(); }, []);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const [p, u] = await Promise.all([
        api.get<Permission[]>('/permissions').catch(() => [] as Permission[]),
        api.get<User[]>('/users').catch(() => [] as User[]),
      ]);
      setPermissions(p ?? []);
      setUsers(u ?? []);
    } catch (err) {
      setError('Unable to load permissions or users');
    } finally {
      setLoading(false);
    }
  }

  async function loadUserPermissions(userId: string) {
    setError(null);
    setUserPerms([]);
    if (!userId) return;
    setLoading(true);
    try {
      const res = await api.get<{ permission: Permission }[]>(`/permissions/user/${userId}`);
      setUserPerms(res.map((r) => r.permission));
    } catch (err) {
      setError('Unable to load user permissions');
    } finally {
      setLoading(false);
    }
  }

  async function assign() {
    if (!selectedUser || !selectedPermission) return setError('Select user and permission');
    setActionLoading(true);
    setError(null);
    setNotice(null);
    try {
      await api.post('/permissions/assign', { userId: selectedUser, permissionKey: selectedPermission });
      setNotice('Permission assigned');
      await loadUserPermissions(selectedUser);
    } catch (err) {
      setError('Unable to assign permission');
    } finally {
      setActionLoading(false);
    }
  }

  async function revoke(key: string) {
    if (!selectedUser) return setError('Select a user first');
    setActionLoading(true);
    setError(null);
    setNotice(null);
    try {
      await api.post('/permissions/revoke', { userId: selectedUser, permissionKey: key });
      setNotice('Permission revoked');
      await loadUserPermissions(selectedUser);
    } catch (err) {
      setError('Unable to revoke permission');
    } finally {
      setActionLoading(false);
    }
  }

  async function populateDefaults() {
    setActionLoading(true);
    setError(null);
    try {
      const defaults = [
        { key: 'leads.create', resource: 'leads', action: 'create', description: 'Create leads' },
        { key: 'leads.update', resource: 'leads', action: 'update', description: 'Update leads' },
        { key: 'customers.create', resource: 'customers', action: 'create', description: 'Create customers' },
        { key: 'customers.update', resource: 'customers', action: 'update', description: 'Update customers' },
        { key: 'negotiations.manage', resource: 'negotiations', action: 'manage', description: 'Manage negotiations' },
        { key: 'permissions.manage', resource: 'permissions', action: 'manage', description: 'Manage permissions' },
      ];

      for (const p of defaults) {
        try {
          await api.post('/permissions', p);
        } catch {
          // ignore individual errors
        }
      }

      await load();
      setNotice('Default permissions populated');
    } catch (err) {
      setError('Unable to populate default permissions');
    } finally {
      setActionLoading(false);
    }
  }

  return (
    <div className="panel">
      <div className="panel-head">
        <div>
          <h3>Permissions</h3>
          <div className="muted">Select user and permission</div>
        </div>
        <div>
          <button className="primary-action" onClick={() => void populateDefaults()} disabled={actionLoading}>
            {actionLoading ? 'Working…' : 'Populate default permissions'}
          </button>
        </div>
      </div>

      {loading ? <div>Loading...</div> : null}
      {error ? <div className="form-error">{error}</div> : null}
      {notice ? <div className="form-notice">{notice}</div> : null}

      <div className="panel-list">
        <div className="content-grid">
          <div>
            <h4>All permissions</h4>
            {permissions.length === 0 ? <div className="muted">No permissions found</div> : null}
            <ul>
              {permissions.map((p) => <li key={p.id}><strong>{p.key}</strong> — {p.description}</li>)}
            </ul>
          </div>

          <div>
            <h4>Assign to user</h4>
            <div className="crud-form">
              <div>
                <label>User</label>
                <select value={selectedUser ?? ''} onChange={(e) => { setSelectedUser(e.target.value); void loadUserPermissions(e.target.value); }}>
                  <option value="">Select user</option>
                  {users.map((u) => <option key={u.id} value={u.id}>{u.name} ({u.email})</option>)}
                </select>
              </div>
              <div>
                <label>Permission</label>
                <select value={selectedPermission ?? ''} onChange={(e) => setSelectedPermission(e.target.value)}>
                  <option value="">Select permission</option>
                  {permissions.map((p) => <option key={p.key} value={p.key}>{p.key}</option>)}
                </select>
              </div>
              <div style={{ alignSelf: 'end' }}>
                <button className="primary-action" onClick={() => void assign()} disabled={actionLoading}>{actionLoading ? 'Working…' : 'Assign'}</button>
              </div>
            </div>

            <h5 style={{ marginTop: 16 }}>User permissions</h5>
            {userPerms.length === 0 ? <div className="muted">No permissions assigned</div> : null}
            <ul>
              {userPerms.map((p) => <li key={p.id}>{p.key} <button className="ghost-filter" onClick={() => void revoke(p.key)} disabled={actionLoading}>{actionLoading ? '…' : 'Revoke'}</button></li>)}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

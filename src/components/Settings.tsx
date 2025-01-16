import React, { useState, useEffect } from 'react';
import { Save, Key, AlertCircle, Users, Activity } from 'lucide-react';
import { getUserSettings, saveUserSettings } from '../services/settings';
import { getOrganization, getOrganizationMembers, updateOrganization, inviteMember, updateMemberRole, removeMember } from '../services/organizations';
import type { Organization, OrganizationMember } from '../services/organizations';

interface SettingsProps {
  userId: string;
}

export function Settings({ userId }: SettingsProps) {
  const [googleApiKey, setGoogleApiKey] = useState('');
  const [searchEngineId, setSearchEngineId] = useState('');
  const [organizationName, setOrganizationName] = useState('');
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [members, setMembers] = useState<OrganizationMember[]>([]);
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [activeTab, setActiveTab] = useState<'api' | 'organization' | 'usage'>('api');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadSettings();
    loadOrganizationDetails();
  }, []);

  const loadSettings = async () => {
    try {
      const data = await getUserSettings(userId);
      if (data) {
        setGoogleApiKey(data.google_api_key || '');
        setSearchEngineId(data.search_engine_id || '');
      }
    } catch (err) {
      console.error('Error loading settings:', err);
    }
  };

  const loadOrganizationDetails = async () => {
    try {
      const org = await getOrganization(userId);
      if (org) {
        setOrganization(org);
        setOrganizationName(org.name);
        
        const orgMembers = await getOrganizationMembers(org.id);
        setMembers(orgMembers);
      }
    } catch (err) {
      console.error('Error loading organization details:', err);
    }
  };

  const handleInviteMember = async () => {
    if (!newMemberEmail || !organization) return;
    setMessage(null);

    try {
      await inviteMember(organization.id, newMemberEmail);
      
      setNewMemberEmail('');
      loadOrganizationDetails();
      setMessage({ type: 'success', text: 'Invitation sent successfully!' });
    } catch (err) {
      console.error('Failed to invite member:', err);
      setMessage({ 
        type: 'error', 
        text: err instanceof Error ? err.message : 'Failed to send invitation. Please try again.'
      });
    }
  };

  const handleUpdateMemberRole = async (memberId: string, newRole: 'admin' | 'member') => {
    try {
      const success = await updateMemberRole(memberId, newRole);
      if (!success) throw new Error('Failed to update member role');
      
      loadOrganizationDetails();
    } catch (err) {
      setMessage({ 
        type: 'error', 
        text: 'Failed to update member role. Please try again.' 
      });
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    try {
      const success = await removeMember(memberId);
      if (!success) throw new Error('Failed to remove member');
      
      loadOrganizationDetails();
    } catch (err) {
      setMessage({ 
        type: 'error', 
        text: 'Failed to remove member. Please try again.' 
      });
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    let success = false;

    try {
      const result = await saveUserSettings(userId, {
        google_api_key: googleApiKey,
        search_engine_id: searchEngineId,
      });

      if (!result) {
        throw new Error('Failed to save settings');
      }

      success = true;
      setMessage({ type: 'success', text: 'Settings saved successfully!' });
    } catch (err) {
      console.error('Failed to save settings:', err);
      setMessage({ 
        type: 'error', 
        text: err instanceof Error ? err.message : 'Failed to save settings. Please try again.'
      });
    } finally {
      setSaving(false);
      if (!success) {
        // Reset form if save failed
        loadSettings();
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('api')}
            className={`pb-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'api'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Key className="w-5 h-5 inline mr-2" />
            API Settings
          </button>
          <button
            onClick={() => setActiveTab('organization')}
            className={`pb-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'organization'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Users className="w-5 h-5 inline mr-2" />
            Organization
          </button>
          <button
            onClick={() => setActiveTab('usage')}
            className={`pb-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'usage'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Activity className="w-5 h-5 inline mr-2" />
            Usage
          </button>
        </nav>
      </div>

      {activeTab === 'api' && (
        <form onSubmit={handleSaveSettings} className="space-y-6">
          <h3 className="text-lg font-medium text-gray-900">API Configuration</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Google API Key
            </label>
            <div className="relative">
              <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="password"
                value={googleApiKey}
                onChange={(e) => setGoogleApiKey(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your Google API key"
              />
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Used for Google Search and PageSpeed Insights API
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search Engine ID (cx)
            </label>
            <div className="relative">
              <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="password"
                value={searchEngineId}
                onChange={(e) => setSearchEngineId(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your Search Engine ID"
              />
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Your Google Custom Search Engine ID
            </p>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400"
          >
            <Save className="w-5 h-5 mr-2" />
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </form>
      )}

      {activeTab === 'organization' && (
        <div className="space-y-8">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Organization Details</h3>
            <div className="flex items-center space-x-4">
              <input
                type="text"
                value={organizationName}
                onChange={(e) => setOrganizationName(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Organization Name"
              />
              <button
                onClick={async () => {
                  if (!organization) return;
                  const updated = await updateOrganization(organization.id, organizationName);
                  if (updated) {
                    setMessage({ type: 'success', text: 'Organization name updated!' });
                  }
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Update
              </button>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Team Members</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="email"
                  value={newMemberEmail}
                  onChange={(e) => setNewMemberEmail(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter email to invite"
                />
                <button
                  onClick={handleInviteMember}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Invite
                </button>
              </div>

              <div className="bg-white shadow overflow-hidden rounded-md">
                <ul className="divide-y divide-gray-200">
                  {members.map((member) => (
                    <li key={member.id} className="px-6 py-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{member.user?.email}</p>
                          <p className="text-sm text-gray-500">
                            Joined {new Date(member.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <select
                            value={member.role}
                            onChange={(e) => handleUpdateMemberRole(member.id, e.target.value as 'admin' | 'member')}
                            className="text-sm rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="member">Member</option>
                            <option value="admin">Admin</option>
                          </select>
                          <button
                            onClick={() => handleRemoveMember(member.id)}
                            className="p-1 text-red-600 hover:text-red-900"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'usage' && (
        <div className="space-y-6">
          <h3 className="text-lg font-medium text-gray-900">API Usage</h3>
          <div className="bg-white shadow overflow-hidden rounded-md">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Google Search API</p>
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Used: 150 queries</span>
                      <span>Limit: 1000 queries/day</span>
                    </div>
                    <div className="mt-1 h-2 bg-gray-200 rounded-full">
                      <div
                        className="h-2 bg-blue-600 rounded-full"
                        style={{ width: '15%' }}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500">PageSpeed API</p>
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Used: 750 queries</span>
                      <span>Limit: 2500 queries/day</span>
                    </div>
                    <div className="mt-1 h-2 bg-gray-200 rounded-full">
                      <div
                        className="h-2 bg-blue-600 rounded-full"
                        style={{ width: '30%' }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {message && (
        <div className={`mt-6 p-4 rounded-md ${
          message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
        }`}>
          <div className="flex">
            <AlertCircle className="w-5 h-5 mr-2" />
            <span>{message.text}</span>
          </div>
        </div>
      )}
    </div>
  );
}
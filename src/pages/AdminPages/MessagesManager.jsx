import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { getToken } from '../../utils/auth';
import Loading from '../../components/Loading';

const MessagesManager = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
  const [deleting, setDeleting] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [branchFilter, setBranchFilter] = useState('all');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const fetchMessages = async () => {
    try {
      const res = await fetch(`${API_URL}/api/messages`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await res.json();
      
      if (data.success) {
        setMessages(data.messages || []);
      } else {
        setError('Failed to load messages');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  // ✅ Filter messages by branch
  const filteredMessages = branchFilter === 'all' 
    ? messages 
    : messages.filter(msg => msg.branch === branchFilter);

  const closeModal = () => {
    setSelectedMessage(null);
  };

  const toggleSelect = (id) => {
    setSelectedIds(prev =>
      prev.includes(id)
        ? prev.filter(msgId => msgId !== id)
        : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredMessages.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredMessages.map(m => m._id));
    }
  };

  const markAsRead = async (id) => {
    try {
      await fetch(`${API_URL}/api/messages/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ status: 'read' }),
      });
      fetchMessages();
      if (selectedMessage?._id === id) {
        const updatedMsg = messages.find(m => m._id === id);
        if (updatedMsg) {
          setSelectedMessage({ ...updatedMsg, status: 'read' });
        }
      }
    } catch (err) {
      console.error('Failed to mark as read');
    }
  };

  const deleteMessage = async (id) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;
    try {
      await fetch(`${API_URL}/api/messages/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      fetchMessages();
      setSelectedIds(prev => prev.filter(msgId => msgId !== id));
      if (selectedMessage?._id === id) closeModal();
    } catch (err) {
      setError('Failed to delete message');
    }
  };

  const bulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!window.confirm(`Delete ${selectedIds.length} selected message(s)?`)) return;
    
    setDeleting(true);
    try {
      const res = await fetch(`${API_URL}/api/messages/bulk`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ ids: selectedIds }),
      });
      const data = await res.json();
      if (data.success) {
        fetchMessages();
        setSelectedIds([]);
        closeModal();
      } else {
        setError(data.message || 'Bulk delete failed');
      }
    } catch (err) {
      setError('Bulk delete failed');
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-LK', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const truncateMessage = (msg, maxLength = 80) => {
    if (msg.length <= maxLength) return msg;
    return msg.substring(0, maxLength) + '...';
  };

  // ✅ Get unique branches for filter
  const uniqueBranches = [...new Set(messages.map(msg => msg.branch))].sort();

  return (
    <AdminLayout title="Messages Inbox">
      {/* Header with Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold text-white">Customer Messages</h2>
        
        <div className="flex items-center gap-4">
          {/* Branch Filter */}
          <div className="flex items-center gap-2">
            <label className="text-gray-400 text-sm whitespace-nowrap">Filter by Branch:</label>
            <select
              value={branchFilter}
              onChange={(e) => setBranchFilter(e.target.value)}
              className="bg-black border border-gray-700 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:border-gold"
            >
              <option value="all">All Branches</option>
              {uniqueBranches.map(branch => (
                <option key={branch} value={branch}>{branch}</option>
              ))}
            </select>
          </div>

          {/* Bulk Delete Button */}
          {selectedIds.length > 0 && (
            <button
              onClick={bulkDelete}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors disabled:opacity-60 text-sm"
            >
              {deleting ? 'Deleting...' : `Delete (${selectedIds.length})`}
            </button>
          )}
        </div>
      </div>

      {error && <p className="text-red-400 mb-4">{error}</p>}

      {loading ? (
        <div className="text-center py-12">
          <Loading message="Loading messages..." />
        </div>
      ) : filteredMessages.length === 0 ? (
        <div className="text-center py-12 bg-gray-900/50 border border-gray-800 rounded-xl">
          <p className="text-gray-500">
            {branchFilter === 'all' 
              ? 'No messages received yet.' 
              : `No messages from ${branchFilter} branch.`}
          </p>
        </div>
      ) : (
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden">
          {/* Header Row */}
          <div className="grid grid-cols-[40px,180px,180px,1fr,120px] gap-4 p-4 bg-black/30 border-b border-gray-800 font-medium text-gray-400 text-sm">
            <label className="flex items-center justify-center">
              <input
                type="checkbox"
                checked={selectedIds.length === filteredMessages.length && filteredMessages.length > 0}
                onChange={toggleSelectAll}
                className="w-4 h-4 text-gold bg-gray-700 border-gray-600 rounded focus:ring-gold"
              />
            </label>
            <span>From</span>
            <span>Branch</span>
            <span>Message Preview</span>
            <span>Status</span>
          </div>

          {/* Messages List */}
          <div className="divide-y divide-gray-800 max-h-[70vh] overflow-y-auto">
            {filteredMessages.map((msg) => (
              <div
                key={msg._id}
                className={`p-4 hover:bg-gray-800/30 transition-colors cursor-pointer ${
                  msg.status === 'unread' ? 'bg-gold/5 border-l-2 border-gold' : ''
                }`}
                // ✅ ONLY open modal when clicking non-checkbox area
                onClick={() => setSelectedMessage(msg)}
              >
                <div className="grid grid-cols-[40px,180px,180px,1fr,120px] gap-4 items-start">
                  {/* Checkbox - STOP PROPAGATION */}
                  <div className="flex items-center justify-center">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(msg._id)}
                      onChange={(e) => {
                        e.stopPropagation(); // ✅ Prevents opening modal
                        toggleSelect(msg._id);
                      }}
                      onClick={(e) => e.stopPropagation()} // ✅ Also stop click
                      className="w-4 h-4 text-gold bg-gray-700 border-gray-600 rounded focus:ring-gold"
                    />
                  </div>

                  {/* From */}
                  <div className="truncate">
                    <p className="font-medium text-white truncate">{msg.name}</p>
                    <p className="text-sm text-gray-400 truncate">{msg.email}</p>
                    {msg.phone && <p className="text-xs text-gray-500 truncate">📞 {msg.phone}</p>}
                  </div>

                  {/* Branch */}
                  <div className="text-gray-300 truncate">
                    {msg.branch}
                  </div>

                  {/* Message Preview */}
                  <div className="min-w-0">
                    <p className="text-gray-300 line-clamp-2 break-words">
                      {truncateMessage(msg.message)}
                    </p>
                    <p className="text-xs text-gold mt-1">Click to view full message</p>
                  </div>

                  {/* Status */}
                  <div className="flex items-center justify-end">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                        msg.status === 'unread'
                          ? 'bg-red-900/50 text-red-300'
                          : 'bg-green-900/50 text-green-300'
                      }`}
                    >
                      {msg.status === 'unread' ? 'Unread' : 'Read'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Message Details Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-6 border-b border-gray-800">
              <h3 className="text-xl font-bold text-white">Message Details</h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-white text-2xl"
                aria-label="Close"
              >
                &times;
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              <div className="space-y-4">
                <div>
                  <label className="text-gray-400 text-sm">From</label>
                  <p className="text-white text-lg">{selectedMessage.name}</p>
                </div>
                
                <div>
                  <label className="text-gray-400 text-sm">Email</label>
                  <p className="text-gray-300 break-words">{selectedMessage.email}</p>
                </div>
                
                {selectedMessage.phone && (
                  <div>
                    <label className="text-gray-400 text-sm">Phone</label>
                    <p className="text-gray-300">{selectedMessage.phone}</p>
                  </div>
                )}
                
                <div>
                  <label className="text-gray-400 text-sm">Branch</label>
                  <p className="text-gray-300">{selectedMessage.branch}</p>
                </div>
                
                <div>
                  <label className="text-gray-400 text-sm">Date</label>
                  <p className="text-gray-300">{formatDate(selectedMessage.createdAt)}</p>
                </div>
                
                <div>
                  <label className="text-gray-400 text-sm">Message</label>
                  <div className="mt-2 bg-black/30 rounded-lg p-4 border border-gray-800">
                    <p className="text-white whitespace-pre-wrap break-words">{selectedMessage.message}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-800 flex justify-end space-x-3">
              {selectedMessage.status === 'unread' && (
                <button
                  onClick={() => markAsRead(selectedMessage._id)}
                  className="px-4 py-2 bg-gold text-black rounded-lg hover:bg-gold/90 font-medium"
                >
                  Mark as Read
                </button>
              )}
              <button
                onClick={() => deleteMessage(selectedMessage._id)}
                className="px-4 py-2 bg-red-900 text-red-300 rounded-lg hover:bg-red-800 font-medium"
              >
                Delete Message
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default MessagesManager;
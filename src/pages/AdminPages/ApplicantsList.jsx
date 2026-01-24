// src/pages/AdminPages/ApplicantsList.jsx
import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { getToken } from '../../utils/auth';

const ApplicantsList = () => {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [hasReferenceFilter, setHasReferenceFilter] = useState('all'); // ✅ NEW FILTER
  const [searchQuery, setSearchQuery] = useState(''); // ✅ NEW SEARCH

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const fetchApplicants = async () => {
    try {
      const res = await fetch(`${API_URL}/api/admin/applications`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      const data = await res.json();
      
      if (data.success) {
        setApplicants(data.data || []);
      } else {
        setError(data.message || 'Failed to load applicants');
      }
    } catch (err) {
      setError('Network error');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, []);

  const updateApplicantStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`${API_URL}/api/admin/applications/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      const data = await res.json();
      
      if (data.success) {
        setApplicants(prev => 
          prev.map(applicant => 
            applicant._id === id ? { ...applicant, status: newStatus } : applicant
          )
        );
        
        if (selectedApplicant && selectedApplicant._id === id) {
          setSelectedApplicant({ ...selectedApplicant, status: newStatus });
        }
      } else {
        setError(data.message || 'Failed to update status');
      }
    } catch (err) {
      setError('Network error');
      console.error(err);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'bg-yellow-900/30 text-yellow-300',
      reviewing: 'bg-blue-900/30 text-blue-300',
      shortlisted: 'bg-green-900/30 text-green-300',
      rejected: 'bg-red-900/30 text-red-300',
      hired: 'bg-purple-900/30 text-purple-300'
    };
    return badges[status] || 'bg-gray-800 text-gray-300';
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // ✅ Enhanced filtering with search and reference filter
  const filteredApplicants = applicants.filter(applicant => {
    // Status filter
    const matchesStatus = statusFilter === 'all' || applicant.status === statusFilter;
    
    // Reference filter
    const hasReference = applicant.referenceName || applicant.referenceEmail || applicant.referenceWorkplace;
    const matchesReference = hasReferenceFilter === 'all' || 
      (hasReferenceFilter === 'yes' && hasReference) || 
      (hasReferenceFilter === 'no' && !hasReference);
    
    // Search filter
    const searchLower = searchQuery.toLowerCase().trim();
    const matchesSearch = !searchLower || 
      applicant.fullName.toLowerCase().includes(searchLower) ||
      applicant.applicationCode.toLowerCase().includes(searchLower);

    return matchesStatus && matchesReference && matchesSearch;
  });

  if (loading) {
    return (
      <AdminLayout title="Job Applicants">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gold"></div>
          <p className="mt-4 text-gray-400">Loading applicants...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Job Applicants">
      {/* ✅ SEARCH & FILTER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <h2 className="text-2xl font-bold text-white">All Job Applicants</h2>
        
        <div className="flex flex-wrap gap-3 w-full sm:w-auto">
          {/* ✅ Search Input */}
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search by name or code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-gold"
            />
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-gold"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="reviewing">Reviewing</option>
            <option value="shortlisted">Shortlisted</option>
            <option value="rejected">Rejected</option>
            <option value="hired">Hired</option>
          </select>

          {/* ✅ Has Reference Filter */}
          <select
            value={hasReferenceFilter}
            onChange={(e) => setHasReferenceFilter(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-gold"
          >
            <option value="all">All References</option>
            <option value="yes">With Reference</option>
            <option value="no">No Reference</option>
          </select>

          <div className="text-gray-400 whitespace-nowrap">
            Total: {filteredApplicants.length} applicants
          </div>
        </div>
      </div>

      {error && <p className="text-red-400 mb-4">{error}</p>}

      {filteredApplicants.length === 0 ? (
        <div className="text-center py-12 bg-gray-900/50 border border-gray-800 rounded-xl">
          <p className="text-gray-500">No applicants match your search and filters</p>
        </div>
      ) : (
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
            <table className="w-full min-w-full">
              <thead className="sticky top-0 z-10 bg-gray-900/90 backdrop-blur border-b border-gray-800">
                <tr>
                  <th className="text-left py-4 px-6 text-gray-400 font-medium text-sm uppercase">Applicant</th>
                  <th className="text-left py-4 px-6 text-gray-400 font-medium text-sm uppercase">Contact</th>
                  <th className="text-left py-4 px-6 text-gray-400 font-medium text-sm uppercase">Position</th>
                  <th className="text-left py-4 px-6 text-gray-400 font-medium text-sm uppercase">Application Code</th>
                  <th className="text-left py-4 px-6 text-gray-400 font-medium text-sm uppercase">Status</th>
                  <th className="text-left py-4 px-6 text-gray-400 font-medium text-sm uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredApplicants.map((applicant) => (
                  <tr key={applicant._id} className="border-b border-gray-800 hover:bg-gray-800/30">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gold text-black rounded-full flex items-center justify-center font-bold text-sm">
                          {applicant.fullName?.charAt(0) || 'A'}
                        </div>
                        <div>
                          <div className="font-semibold text-white">{applicant.fullName}</div>
                          <div className="text-gray-400 text-sm">{applicant.city}, {applicant.country}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-white text-sm">{applicant.applicantEmail}</div>
                      {applicant.referenceEmail && (
                        <div className="text-gray-400 text-xs mt-1">Ref: {applicant.referenceEmail}</div>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-white">{applicant.positionTitle}</div>
                      <div className="text-gray-400 text-sm">
                        Applied: {formatDate(applicant.createdAt)}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="bg-gray-800/50 text-gold px-2 py-1 rounded text-xs font-mono">
                        {applicant.applicationCode}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadge(applicant.status)}`}>
                        {applicant.status.charAt(0).toUpperCase() + applicant.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <button
                        onClick={() => setSelectedApplicant(applicant)}
                        className="text-gold hover:text-yellow-300 text-sm font-medium"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Applicant Detail Modal */}
      {selectedApplicant && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-800 flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">Applicant Details</h3>
              <button
                onClick={() => setSelectedApplicant(null)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Application Information */}
              <div className="bg-gray-800/30 p-4 rounded-xl">
                <h4 className="text-lg font-semibold text-white mb-4">Application Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex justify-between pb-2 border-b border-gray-700">
                    <span className="text-gray-400">Application Code</span>
                    <span className="text-gold font-mono">{selectedApplicant.applicationCode}</span>
                  </div>
                  <div className="flex justify-between pb-2 border-b border-gray-700">
                    <span className="text-gray-400">Applied On</span>
                    <span className="text-white">{formatDate(selectedApplicant.createdAt)}</span>
                  </div>
                  <div className="flex justify-between pb-2 border-b border-gray-700">
                    <span className="text-gray-400">Last Updated</span>
                    <span className="text-white">{formatDate(selectedApplicant.updatedAt)}</span>
                  </div>
                  <div className="flex justify-between pb-2 border-b border-gray-700">
                    <span className="text-gray-400">Status</span>
                    <span className={`font-medium ${getStatusBadge(selectedApplicant.status).split(' ')[1]}`}>
                      {selectedApplicant.status.charAt(0).toUpperCase() + selectedApplicant.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Personal Information */}
              <div className="bg-gray-800/30 p-4 rounded-xl">
                <h4 className="text-lg font-semibold text-white mb-4">Personal Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex justify-between pb-2 border-b border-gray-700">
                    <span className="text-gray-400">Full Name</span>
                    <span className="text-white">{selectedApplicant.fullName}</span>
                  </div>
                  <div className="flex justify-between pb-2 border-b border-gray-700">
                    <span className="text-gray-400">Email</span>
                    <span className="text-white">{selectedApplicant.applicantEmail}</span>
                  </div>
                  <div className="flex justify-between pb-2 border-b border-gray-700">
                    <span className="text-gray-400">Age</span>
                    <span className="text-white">{selectedApplicant.age || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between pb-2 border-b border-gray-700">
                    <span className="text-gray-400">Gender</span>
                    <span className="text-white">{selectedApplicant.gender}</span>
                  </div>
                  <div className="flex justify-between pb-2 border-b border-gray-700">
                    <span className="text-gray-400">Date of Birth</span>
                    <span className="text-white">{new Date(selectedApplicant.dob).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between pb-2 border-b border-gray-700">
                    <span className="text-gray-400">Country</span>
                    <span className="text-white">{selectedApplicant.country}</span>
                  </div>
                  <div className="flex justify-between pb-2 border-b border-gray-700">
                    <span className="text-gray-400">City</span>
                    <span className="text-white">{selectedApplicant.city}</span>
                  </div>
                  <div className="flex justify-between pb-2 border-b border-gray-700">
                    <span className="text-gray-400">Mobile</span>
                    <span className="text-white">{selectedApplicant.mobileNumber || 'Not provided'}</span>
                  </div>
                  <div className="flex justify-between pb-2 border-b border-gray-700 md:col-span-2">
                    <span className="text-gray-400">Address</span>
                    <span className="text-white">{selectedApplicant.address || 'Not provided'}</span>
                  </div>
                </div>
              </div>

              {/* Work Details */}
              <div className="bg-gray-800/30 p-4 rounded-xl">
                <h4 className="text-lg font-semibold text-white mb-4">Work Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex justify-between pb-2 border-b border-gray-700">
                    <span className="text-gray-400">Position Applied</span>
                    <span className="text-white">{selectedApplicant.positionTitle}</span>
                  </div>
                  <div className="flex justify-between pb-2 border-b border-gray-700">
                    <span className="text-gray-400">Years Experience</span>
                    <span className="text-white">{selectedApplicant.yearsExperience}</span>
                  </div>
                  <div className="flex justify-between pb-2 border-b border-gray-700">
                    <span className="text-gray-400">Available 9-5</span>
                    <span className={`font-medium ${selectedApplicant.canWork9to5 ? 'text-green-400' : 'text-red-400'}`}>
                      {selectedApplicant.canWork9to5 ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div className="flex justify-between pb-2 border-b border-gray-700">
                    <span className="text-gray-400">Legal Work Status</span>
                    <span className={`font-medium ${selectedApplicant.canWorkLegally ? 'text-green-400' : 'text-red-400'}`}>
                      {selectedApplicant.canWorkLegally ? 'Authorized' : 'Needs Permit'}
                    </span>
                  </div>
                  <div className="flex justify-between pb-2 border-b border-gray-700 md:col-span-2">
                    <span className="text-gray-400">Interested Branch</span>
                    <span className="text-white">{selectedApplicant.interestedBranch}</span>
                  </div>
                </div>
              </div>

              {/* Reference Information */}
              {(selectedApplicant.referenceName || selectedApplicant.referenceEmail || selectedApplicant.referenceWorkplace) && (
                <div className="bg-gray-800/30 p-4 rounded-xl">
                  <h4 className="text-lg font-semibold text-white mb-4">Reference Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedApplicant.referenceName && (
                      <div className="flex justify-between pb-2 border-b border-gray-700">
                        <span className="text-gray-400">Reference Name</span>
                        <span className="text-white">{selectedApplicant.referenceName}</span>
                      </div>
                    )}
                    {selectedApplicant.referenceEmail && (
                      <div className="flex justify-between pb-2 border-b border-gray-700">
                        <span className="text-gray-400">Reference Email</span>
                        <span className="text-white">{selectedApplicant.referenceEmail}</span>
                      </div>
                    )}
                    {selectedApplicant.referenceWorkplace && (
                      <div className="flex justify-between pb-2 border-b border-gray-700 md:col-span-2">
                        <span className="text-gray-400">Reference Workplace</span>
                        <span className="text-white">{selectedApplicant.referenceWorkplace}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* CV/Resume */}
              <div className="bg-gray-800/30 p-4 rounded-xl">
                <h4 className="text-lg font-semibold text-white mb-4">CV/Resume</h4>
                {selectedApplicant.cvFilePath ? (
                  <div>
                    <a
                      href={`${API_URL}/${selectedApplicant.cvFilePath}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gold hover:text-yellow-300"
                    >
                      Download CV File
                    </a>
                  </div>
                ) : selectedApplicant.cvGoogleDriveLink ? (
                  <div>
                    <a
                      href={selectedApplicant.cvGoogleDriveLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gold hover:text-yellow-300"
                    >
                      View Google Drive CV
                    </a>
                  </div>
                ) : (
                  <div className="text-gray-400">No CV provided</div>
                )}
              </div>

              {/* Status Actions */}
              <div className="bg-gray-800/30 p-4 rounded-xl">
                <h4 className="text-lg font-semibold text-white mb-4">Application Status</h4>
                <div className="flex flex-wrap gap-2">
                  {['pending', 'reviewing', 'shortlisted', 'rejected', 'hired'].map((status) => (
                    <button
                      key={status}
                      onClick={() => updateApplicantStatus(selectedApplicant._id, status)}
                      disabled={selectedApplicant.status === status}
                      className={`px-3 py-1 rounded text-xs font-medium ${
                        selectedApplicant.status === status
                          ? `${getStatusBadge(status)} opacity-70`
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default ApplicantsList;
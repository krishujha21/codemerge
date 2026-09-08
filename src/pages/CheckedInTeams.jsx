import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';
import { Download, Users, CheckCircle } from 'lucide-react';
import * as XLSX from 'xlsx';

const CheckedInTeams = () => {
  const { data: teams = [], isLoading } = useQuery({
    queryKey: ['teams', 'checked-in'],
    queryFn: async () => {
      const res = await api.get('/api/teams').catch(() => ({ data: [] }));
      // Filter for only checked-in teams
      return res.data.filter(team => team.checkedIn);
    },
  });

  const handleExportExcel = () => {
    if (teams.length === 0) return;
    
    // Create Excel friendly data format
    const excelData = teams.map((team, index) => ({
      'S.No': index + 1,
      'Team Name': team.name,
      'Domain': team.domain,
      'Leader Name': team.leaderName,
      'Leader Phone': team.leaderPhone || 'N/A',
      'Total Members': team.members?.length || 0,
      'Check-In Time': team.checkInTime ? new Date(team.checkInTime).toLocaleString() : 'N/A',
      'Members Info': team.members?.map(m => `${m.name} (${m.regNo})`).join(', ') || 'N/A'
    }));

    // Create worksheet and workbook
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Checked-In Teams");

    // Configure column widths for better formatting
    const wscols = [
      {wch: 5},  // S.No
      {wch: 25}, // Team Name
      {wch: 30}, // Domain
      {wch: 20}, // Leader Name
      {wch: 15}, // Leader Phone
      {wch: 15}, // Total Members
      {wch: 20}, // Check-In Time
      {wch: 60}  // Members Info
    ];
    worksheet['!cols'] = wscols;

    // Generate Excel file and trigger download
    XLSX.writeFile(workbook, `CodeMerge_CheckedIn_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-10 bg-surface rounded w-full max-w-md animate-pulse mb-8"></div>
        <div className="h-64 bg-surface rounded-xl animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center">
            <CheckCircle className="w-6 h-6 mr-3 text-green-500" />
            Checked-In Teams ({teams.length})
          </h1>
          <p className="text-slate-400 text-sm mt-1">List of teams physically present at the venue</p>
        </div>
        <button
          onClick={handleExportExcel}
          className="flex items-center px-4 py-2 bg-green-600/20 border border-green-500/50 rounded-lg text-green-400 hover:bg-green-600/30 transition-colors print:hidden"
        >
          <Download className="w-4 h-4 mr-2" />
          Export Excel Sheet
        </button>
      </div>

      {teams.length === 0 ? (
        <div className="text-center py-12 bg-surface rounded-xl border border-border">
          <Users className="w-12 h-12 text-slate-500 mx-auto mb-4" />
          <p className="text-slate-400">No teams have checked in yet.</p>
        </div>
      ) : (
        <div className="bg-surface rounded-xl border border-border overflow-hidden print:border-none print:shadow-none">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-background/50 text-slate-400 uppercase text-xs">
                <tr>
                  <th className="px-6 py-4 font-medium">#</th>
                  <th className="px-6 py-4 font-medium">Team Name</th>
                  <th className="px-6 py-4 font-medium">Domain</th>
                  <th className="px-6 py-4 font-medium">Leader</th>
                  <th className="px-6 py-4 font-medium">Check-In Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-slate-300">
                {teams.map((team, index) => (
                  <tr key={team._id || index} className="hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-slate-500">{index + 1}</td>
                    <td className="px-6 py-4 font-medium text-slate-200">{team.name}</td>
                    <td className="px-6 py-4">
                      <span className="text-xs px-2 py-1 rounded bg-slate-800 text-slate-300 border border-border">
                        {team.domain}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{team.leaderName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-green-400">
                      {team.checkInTime ? new Date(team.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckedInTeams;

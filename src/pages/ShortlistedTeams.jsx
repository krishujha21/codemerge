import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';
import { Download, Users } from 'lucide-react';

const ShortlistedTeams = () => {
  const { data: teams = [], isLoading } = useQuery({
    queryKey: ['teams', 'shortlisted'],
    queryFn: async () => {
      const res = await api.get('/api/teams?shortlisted=true').catch(() => ({ data: [] }));
      return res.data;
    },
  });

  const handlePrint = () => {
    window.print();
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
          <h1 className="text-2xl font-bold text-slate-100">30 Teams Shortlisted for CodeMerge 2025</h1>
          <p className="text-slate-400 text-sm mt-1">Official list of teams participating in Round 1 & 2</p>
        </div>
        <button
          onClick={handlePrint}
          className="flex items-center px-4 py-2 bg-surface border border-border rounded-lg text-slate-200 hover:bg-slate-800 transition-colors print:hidden"
        >
          <Download className="w-4 h-4 mr-2" />
          Export / Print List
        </button>
      </div>

      {teams.length === 0 ? (
        <div className="text-center py-12 bg-surface rounded-xl border border-border">
          <Users className="w-12 h-12 text-slate-500 mx-auto mb-4" />
          <p className="text-slate-400">No teams have been marked as shortlisted yet.</p>
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
                  <th className="px-6 py-4 font-medium">Members</th>
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
                    <td className="px-6 py-4 whitespace-nowrap">{team.members?.length || 0}</td>
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

export default ShortlistedTeams;

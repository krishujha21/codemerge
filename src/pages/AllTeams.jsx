import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';
import { Search, Filter, Edit2, ChevronDown, ChevronUp, Mail, Phone, Hash } from 'lucide-react';
import toast from 'react-hot-toast';

const domainColors = {
  'AI for HealthTech/Fintech/EdTech': 'bg-violet-500/10 text-violet-400 border-violet-500/20',
  'AI for Safety & Security': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  'AI for Sustainability': 'bg-green-500/10 text-green-400 border-green-500/20',
  'AI + IoT': 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
};

const AllTeams = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [domainFilter, setDomainFilter] = useState('');
  const [expandedTeam, setExpandedTeam] = useState(null);

  const { data: teams = [], isLoading } = useQuery({
    queryKey: ['teams'],
    queryFn: async () => {
      const res = await api.get('/api/teams').catch(() => ({ data: [] }));
      return res.data;
    },
  });

  const filteredTeams = teams.filter((team) => {
    const matchesSearch =
      team.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      team.leaderName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      team.members?.some(
        (m) =>
          m.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          m.regNo?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    const matchesDomain = domainFilter ? team.domain === domainFilter : true;
    return matchesSearch && matchesDomain;
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-10 bg-surface rounded w-full max-w-md animate-pulse"></div>
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 bg-surface rounded-xl animate-pulse"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-slate-100">All Teams</h1>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 bg-surface p-4 rounded-xl border border-border">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
          <input
            type="text"
            placeholder="Search teams, members, reg no..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:border-primary text-slate-200"
          />
        </div>
        <div className="relative w-full sm:w-64">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
          <select
            value={domainFilter}
            onChange={(e) => setDomainFilter(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:border-primary text-slate-200 appearance-none"
          >
            <option value="">All Domains</option>
            {Object.keys(domainColors).map((domain) => (
              <option key={domain} value={domain}>{domain}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {filteredTeams.length === 0 ? (
          <div className="text-center py-12 bg-surface rounded-xl border border-border">
            <Users className="w-12 h-12 text-slate-500 mx-auto mb-4" />
            <p className="text-slate-400">No teams found matching your criteria.</p>
          </div>
        ) : (
          filteredTeams.map((team) => (
            <div key={team._id || team.id} className="bg-surface rounded-xl border border-border overflow-hidden transition-all hover:border-slate-600">
              <div 
                className="p-4 sm:p-6 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                onClick={() => setExpandedTeam(expandedTeam === team._id ? null : team._id)}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-slate-100">{team.name}</h3>
                    <span className={`text-xs px-2.5 py-1 rounded-full border ${domainColors[team.domain] || 'bg-slate-800 text-slate-300'}`}>
                      {team.domain}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-400">
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-1.5 text-slate-500" />
                      Leader: <span className="text-slate-300 ml-1">{team.leaderName}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 mr-1.5 text-slate-500" />
                      {team.leaderPhone || 'N/A'}
                    </div>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-1.5 text-slate-500" />
                      {team.members?.length || 0} Members
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 self-end sm:self-center">
                  <button 
                    onClick={(e) => { e.stopPropagation(); toast('Edit modal coming soon'); }}
                    className="p-2 text-slate-400 hover:text-primary bg-background rounded-lg border border-border hover:border-primary/50 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  {expandedTeam === team._id ? (
                    <ChevronUp className="w-5 h-5 text-slate-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-500" />
                  )}
                </div>
              </div>

              {/* Expanded Members View */}
              {expandedTeam === team._id && (
                <div className="border-t border-border bg-background/50 p-4 sm:p-6">
                  <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Team Members</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {team.members?.map((member, idx) => (
                      <div key={member._id || idx} className="bg-surface p-4 rounded-lg border border-border/50 relative group">
                        <button 
                          onClick={() => toast('Inline edit coming soon')}
                          className="absolute top-3 right-3 text-slate-500 opacity-0 group-hover:opacity-100 hover:text-primary transition-all"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-medium text-slate-200">{member.name}</span>
                          {member.role === 'Leader' && (
                            <span className="text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded">Leader</span>
                          )}
                        </div>
                        <div className="space-y-1.5 text-sm text-slate-400">
                          <div className="flex items-center">
                            <Hash className="w-3.5 h-3.5 mr-2 text-slate-500" />
                            {member.regNo}
                          </div>
                          <div className="flex items-center">
                            <Mail className="w-3.5 h-3.5 mr-2 text-slate-500" />
                            <span className="truncate">{member.email || 'N/A'}</span>
                          </div>
                          <div className="text-xs mt-2 pt-2 border-t border-border/50">
                            {member.department} {member.section ? `• Sec ${member.section}` : ''}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// Also import Users and User from lucide-react above
import { User } from 'lucide-react';

export default AllTeams;

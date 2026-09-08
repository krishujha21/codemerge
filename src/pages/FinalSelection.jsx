import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';
import { Trophy, Search, Star, MoveRight, X, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const FinalSelection = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Fetch eligible teams (all teams basically, or filtered by backend)
  const { data: eligibleTeams = [], isLoading: isLoadingEligible } = useQuery({
    queryKey: ['teams', 'eligible'],
    queryFn: async () => {
      const res = await api.get('/api/teams').catch(() => ({ data: [] }));
      return res.data;
    },
  });

  // Fetch finalists
  const { data: finalists = [], isLoading: isLoadingFinalists } = useQuery({
    queryKey: ['finals'],
    queryFn: async () => {
      const res = await api.get('/api/finals').catch(() => ({ data: [] }));
      return res.data;
    },
  });

  const selectMutation = useMutation({
    mutationFn: async (teamId) => {
      return api.post('/api/finals/select', { teamId, rank: finalists.length + 1 });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['finals'] });
      toast.success('Team selected for finals!');
    },
    onError: () => toast.error('Failed to select team')
  });

  const removeMutation = useMutation({
    mutationFn: async (teamId) => {
      return api.delete(`/api/finals/${teamId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['finals'] });
      toast.success('Team removed from finals');
    }
  });

  const finalistTeamIds = finalists.map(f => f.teamId || f.team?._id);
  
  const availableTeams = eligibleTeams.filter(t => !finalistTeamIds.includes(t._id || t.id));
  
  const filteredAvailable = availableTeams.filter(t => 
    t.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isFull = finalists.length >= 10;

  if (isLoadingEligible || isLoadingFinalists) {
    return <div className="animate-pulse flex gap-6 h-96">
      <div className="w-1/2 bg-surface rounded-xl"></div>
      <div className="w-1/2 bg-surface rounded-xl"></div>
    </div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center">
            <Trophy className="w-6 h-6 mr-3 text-amber-500" />
            Final Selection (Top 10)
          </h1>
          <p className="text-slate-400 mt-1">Select the top 10 teams advancing to Day 3 Finals</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-12rem)]">
        {/* Left: Eligible Teams */}
        <div className="w-full lg:w-1/2 flex flex-col bg-surface border border-border rounded-xl overflow-hidden">
          <div className="p-4 border-b border-border bg-background/50">
            <h2 className="text-lg font-semibold text-slate-200 mb-4">Eligible Teams</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
              <input
                type="text"
                placeholder="Search teams..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:border-primary text-sm text-slate-200"
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {filteredAvailable.map(team => (
              <div key={team._id || team.id} className="flex items-center justify-between p-4 bg-background border border-border rounded-lg hover:border-slate-600 transition-colors">
                <div>
                  <h3 className="font-medium text-slate-200">{team.name}</h3>
                  <p className="text-xs text-slate-400 mt-1">{team.domain}</p>
                </div>
                <button
                  onClick={() => selectMutation.mutate(team._id || team.id)}
                  disabled={isFull || selectMutation.isPending}
                  className="px-3 py-1.5 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  Select <MoveRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            ))}
            {filteredAvailable.length === 0 && (
              <div className="text-center py-8 text-slate-500 text-sm">
                No eligible teams found
              </div>
            )}
          </div>
        </div>

        {/* Right: Selected Finalists */}
        <div className="w-full lg:w-1/2 flex flex-col bg-surface border border-border rounded-xl overflow-hidden shadow-lg shadow-amber-500/5">
          <div className="p-4 border-b border-border bg-gradient-to-r from-amber-500/10 to-transparent">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-amber-500 flex items-center">
                <Star className="w-5 h-5 mr-2" />
                Selected Finalists
              </h2>
              <div className={`px-3 py-1 rounded-full text-sm font-bold ${
                isFull ? 'bg-green-500/20 text-green-400' : 'bg-slate-800 text-slate-300'
              }`}>
                {finalists.length} / 10 Slots
              </div>
            </div>
            {isFull && (
              <div className="mt-3 flex items-center text-xs text-green-400 bg-green-500/10 p-2 rounded border border-green-500/20">
                <AlertCircle className="w-4 h-4 mr-2" />
                Maximum finalists selected. You can reorder or finalize now.
              </div>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {finalists.map((finalist, idx) => {
              const team = finalist.team || eligibleTeams.find(t => (t._id || t.id) === finalist.teamId) || {};
              return (
                <div key={finalist._id || finalist.teamId} className="flex items-center justify-between p-4 bg-slate-800/50 border border-border rounded-lg relative overflow-hidden group">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500"></div>
                  <div className="flex items-center gap-4">
                    <div className="text-2xl font-black text-slate-700 w-8 text-center select-none">
                      {idx + 1}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-100 flex items-center gap-2">
                        {team.name || 'Unknown Team'}
                        <span className="text-[10px] bg-amber-500/20 text-amber-500 px-1.5 py-0.5 rounded border border-amber-500/30">FINALIST</span>
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">{team.domain}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeMutation.mutate(finalist.teamId || team._id)}
                    className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                    title="Remove from finals"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
            
            {/* Empty Slots */}
            {Array.from({ length: Math.max(0, 10 - finalists.length) }).map((_, i) => (
              <div key={`empty-${i}`} className="flex items-center p-4 bg-background border border-dashed border-border rounded-lg opacity-50">
                <div className="text-xl font-bold text-slate-700 w-8 text-center mr-4">
                  {finalists.length + i + 1}
                </div>
                <div className="text-sm text-slate-500 font-medium">Empty Slot</div>
              </div>
            ))}
          </div>
          
          <div className="p-4 border-t border-border bg-background">
            <button
              disabled={finalists.length === 0}
              className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold rounded-lg shadow-lg shadow-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Lock Selection & Finalize
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinalSelection;

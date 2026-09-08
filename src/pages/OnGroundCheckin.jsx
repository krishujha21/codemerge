import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';
import { Search, MapPin, CheckCircle, Clock, UserCheck } from 'lucide-react';
import toast from 'react-hot-toast';

const OnGroundCheckin = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all'); // all, checked-in, pending
  const [selectedTeamId, setSelectedTeamId] = useState(null);

  const { data: teams = [], isLoading } = useQuery({
    queryKey: ['teams'],
    queryFn: async () => {
      const res = await api.get('/api/teams').catch(() => ({ data: [] }));
      return res.data;
    },
  });

  const checkInMutation = useMutation({
    mutationFn: async ({ teamId, checkedIn }) => {
      return api.patch(`/api/teams/${teamId}/checkin`, { checkedIn });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      toast.success('Check-in status updated');
    },
    onError: () => {
      toast.error('Failed to update check-in status');
    }
  });

  const memberCheckInMutation = useMutation({
    mutationFn: async ({ teamId, memberId, present }) => {
      // Assuming a similar endpoint for member physical check-in if required,
      // or it might just be the team-level one depending on exact backend impl.
      // We will simulate it by updating the member object locally via API.
      return api.patch(`/api/teams/${teamId}/members/${memberId}`, { physicallyPresent: present });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
    },
    onError: () => {
      toast.error('Failed to update member presence');
    }
  });

  const filteredTeams = teams.filter((team) => {
    const matchesSearch = team.name?.toLowerCase().includes(searchTerm.toLowerCase());
    if (filter === 'checked-in') return matchesSearch && team.checkedIn;
    if (filter === 'pending') return matchesSearch && !team.checkedIn;
    return matchesSearch;
  });

  const selectedTeam = teams.find((t) => (t._id || t.id) === selectedTeamId);

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-8rem)] gap-6">
        <div className="w-1/3 bg-surface rounded-xl border border-border animate-pulse"></div>
        <div className="flex-1 bg-surface rounded-xl border border-border animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-6rem)] gap-6 -m-4 sm:-m-6 lg:-m-8 p-4 sm:p-6 lg:p-8 bg-background">
      {/* Left Panel: Teams List */}
      <div className="w-full lg:w-1/3 flex flex-col bg-surface border border-border rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-border space-y-4 bg-background/50">
          <h2 className="text-lg font-bold text-slate-100 flex items-center">
            <MapPin className="w-5 h-5 mr-2 text-primary" />
            Venue Check-In
          </h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
            <input
              type="text"
              placeholder="Search teams..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:border-primary text-slate-200 text-sm"
            />
          </div>
          <div className="flex gap-2">
            {['all', 'checked-in', 'pending'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`flex-1 py-1.5 px-3 text-xs font-medium rounded-md capitalize transition-colors ${
                  filter === f
                    ? 'bg-primary text-white'
                    : 'bg-background text-slate-400 hover:text-slate-200 border border-border'
                }`}
              >
                {f.replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredTeams.map((team) => (
            <div
              key={team._id || team.id}
              onClick={() => setSelectedTeamId(team._id || team.id)}
              className={`p-4 border-b border-border/50 cursor-pointer transition-colors ${
                selectedTeamId === (team._id || team.id)
                  ? 'bg-primary/10 border-l-4 border-l-primary'
                  : 'hover:bg-slate-800/50 border-l-4 border-l-transparent'
              }`}
            >
              <div className="flex justify-between items-start mb-1">
                <h3 className={`font-semibold ${selectedTeamId === (team._id || team.id) ? 'text-primary' : 'text-slate-200'}`}>
                  {team.name}
                </h3>
                {team.checkedIn ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <Clock className="w-4 h-4 text-amber-500" />
                )}
              </div>
              <div className="text-xs text-slate-400">
                {team.members?.length || 0} Members • {team.domain}
              </div>
            </div>
          ))}
          {filteredTeams.length === 0 && (
            <div className="p-8 text-center text-slate-500 text-sm">
              No teams found
            </div>
          )}
        </div>
      </div>

      {/* Right Panel: Team Details & Check-In */}
      <div className="flex-1 flex flex-col bg-surface border border-border rounded-xl overflow-hidden shadow-sm">
        {selectedTeam ? (
          <>
            <div className="p-6 border-b border-border bg-background/30">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-100">{selectedTeam.name}</h2>
                  <p className="text-slate-400 text-sm mt-1">{selectedTeam.domain}</p>
                </div>
                <button
                  onClick={() => checkInMutation.mutate({ teamId: selectedTeam._id || selectedTeam.id, checkedIn: !selectedTeam.checkedIn })}
                  disabled={checkInMutation.isPending}
                  className={`px-6 py-3 rounded-xl font-bold flex items-center transition-all ${
                    selectedTeam.checkedIn
                      ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30 border border-green-500/50'
                      : 'bg-primary text-white hover:bg-indigo-600 shadow-lg shadow-primary/25'
                  }`}
                >
                  {selectedTeam.checkedIn ? (
                    <>
                      <CheckCircle className="w-5 h-5 mr-2" />
                      TEAM CHECKED IN
                    </>
                  ) : (
                    <>
                      <MapPin className="w-5 h-5 mr-2" />
                      MARK TEAM CHECKED IN
                    </>
                  )}
                </button>
              </div>
              
              {selectedTeam.checkedIn && selectedTeam.checkInTime && (
                <div className="text-sm text-green-400 flex items-center bg-green-500/10 inline-flex px-3 py-1.5 rounded-lg border border-green-500/20">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Checked in at {new Date(selectedTeam.checkInTime).toLocaleTimeString()}
                </div>
              )}
            </div>

            <div className="p-6 flex-1 overflow-y-auto">
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4 flex items-center">
                <UserCheck className="w-4 h-4 mr-2" />
                Physical Presence Verification
              </h3>
              
              <div className="space-y-3">
                {selectedTeam.members?.map((member) => (
                  <div key={member._id} className="flex items-center justify-between p-4 bg-background rounded-xl border border-border hover:border-slate-600 transition-colors">
                    <div>
                      <div className="font-medium text-slate-200 mb-1">{member.name}</div>
                      <div className="text-sm text-slate-400">
                        {member.regNo} • {member.department} {member.section && `Sec ${member.section}`}
                      </div>
                    </div>
                    <label className="flex items-center cursor-pointer">
                      <div className="relative">
                        <input 
                          type="checkbox" 
                          className="sr-only"
                          checked={member.physicallyPresent || false}
                          onChange={(e) => memberCheckInMutation.mutate({ 
                            teamId: selectedTeam._id || selectedTeam.id, 
                            memberId: member._id, 
                            present: e.target.checked 
                          })}
                        />
                        <div className={`block w-14 h-8 rounded-full transition-colors ${member.physicallyPresent ? 'bg-green-500' : 'bg-slate-700'}`}></div>
                        <div className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${member.physicallyPresent ? 'transform translate-x-6' : ''}`}></div>
                      </div>
                      <span className={`ml-3 text-sm font-medium ${member.physicallyPresent ? 'text-green-400' : 'text-slate-500'}`}>
                        {member.physicallyPresent ? 'Present' : 'Absent'}
                      </span>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-500">
            <MapPin className="w-16 h-16 mb-4 opacity-50" />
            <p className="text-lg">Select a team from the left to manage check-in</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OnGroundCheckin;

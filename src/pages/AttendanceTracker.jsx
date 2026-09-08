import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import { CalendarDays, Search, Users, ChevronDown, ChevronUp, Check } from 'lucide-react';
import toast from 'react-hot-toast';

const AttendanceTracker = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentDay = parseInt(searchParams.get('day') || '1', 10);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedTeam, setExpandedTeam] = useState(null);
  const queryClient = useQueryClient();

  // For Day 3, we probably want to fetch finalists and their attendance
  // For now, we'll just use the day param.
  const { data: attendanceData = [], isLoading } = useQuery({
    queryKey: ['attendance', currentDay],
    queryFn: async () => {
      const res = await api.get(`/api/attendance/${currentDay}`).catch(() => ({ data: [] }));
      return res.data;
    },
  });

  const memberAttendanceMutation = useMutation({
    mutationFn: async ({ teamId, memberId, present }) => {
      return api.patch(`/api/attendance/${currentDay}/${teamId}/member/${memberId}`, { present });
    },
    onMutate: async ({ teamId, memberId, present }) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: ['attendance', currentDay] });
      const previousData = queryClient.getQueryData(['attendance', currentDay]);
      
      queryClient.setQueryData(['attendance', currentDay], (old) => {
        if (!old) return old;
        return old.map(team => {
          if (team.teamId === teamId || team._id === teamId) {
            return {
              ...team,
              members: team.members.map(m => 
                m.memberId === memberId || m._id === memberId 
                  ? { ...m, present } 
                  : m
              )
            };
          }
          return team;
        });
      });
      return { previousData };
    },
    onError: (err, newTodo, context) => {
      queryClient.setQueryData(['attendance', currentDay], context.previousData);
      toast.error('Failed to mark attendance');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance', currentDay] });
    },
  });

  const bulkAttendanceMutation = useMutation({
    mutationFn: async ({ teamId, present }) => {
      // In a real scenario, this would send an array of updates
      return api.patch(`/api/attendance/${currentDay}/${teamId}/bulk`, { presentAll: present });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance', currentDay] });
      toast.success(`Marked all members as ${present ? 'present' : 'absent'}`);
    }
  });

  const setDay = (day) => {
    setSearchParams({ day: day.toString() });
  };

  const filteredData = attendanceData.filter(team => {
    if (!searchTerm) return true;
    return team.teamName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
           team.members?.some(m => 
             m.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
             m.regNo?.toLowerCase().includes(searchTerm.toLowerCase())
           );
  });

  const totalMembersPresent = attendanceData.reduce((acc, team) => {
    return acc + (team.members?.filter(m => m.present)?.length || 0);
  }, 0);

  const totalMembers = attendanceData.reduce((acc, team) => {
    return acc + (team.members?.length || 0);
  }, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center">
            <CalendarDays className="w-6 h-6 mr-3 text-primary" />
            Attendance Tracker
          </h1>
          <p className="text-slate-400 mt-1">Mark daily attendance for participating teams</p>
        </div>
        <div className="bg-surface border border-border px-4 py-2 rounded-lg flex items-center">
          <span className="text-2xl font-bold text-primary mr-2">{totalMembersPresent}</span>
          <span className="text-slate-400">/ {totalMembers || '?'} Present</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-surface border border-border p-1 rounded-xl w-full max-w-md">
        {[1, 2, 3].map(day => (
          <button
            key={day}
            onClick={() => setDay(day)}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
              currentDay === day
                ? 'bg-primary text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            Day {day} {day === 3 ? '(Finals)' : ''}
          </button>
        ))}
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
        <input
          type="text"
          placeholder="Search team or member..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-surface border border-border rounded-lg focus:outline-none focus:border-primary text-slate-200"
        />
      </div>

      {isLoading ? (
        <div className="space-y-4 animate-pulse">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-16 bg-surface rounded-xl border border-border"></div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredData.length === 0 ? (
            <div className="text-center py-12 bg-surface rounded-xl border border-border">
              <Users className="w-12 h-12 text-slate-500 mx-auto mb-4" />
              <p className="text-slate-400">No teams found for Day {currentDay}</p>
            </div>
          ) : (
            filteredData.map(team => {
              const presentCount = team.members?.filter(m => m.present).length || 0;
              const totalCount = team.members?.length || 0;
              const isAllPresent = presentCount === totalCount && totalCount > 0;

              return (
                <div key={team.teamId || team._id} className="bg-surface rounded-xl border border-border overflow-hidden">
                  <div 
                    className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-800/50 transition-colors"
                    onClick={() => setExpandedTeam(expandedTeam === (team.teamId || team._id) ? null : (team.teamId || team._id))}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${
                        isAllPresent ? 'bg-green-500/10 border-green-500/30 text-green-500' : 
                        presentCount > 0 ? 'bg-amber-500/10 border-amber-500/30 text-amber-500' : 
                        'bg-slate-800 border-border text-slate-500'
                      }`}>
                        {isAllPresent ? <Check className="w-5 h-5" /> : <Users className="w-5 h-5" />}
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-200">{team.teamName}</h3>
                        <p className="text-sm text-slate-400">{presentCount} of {totalCount} present</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          bulkAttendanceMutation.mutate({ teamId: team.teamId || team._id, present: !isAllPresent });
                        }}
                        className={`hidden sm:block px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                          isAllPresent 
                            ? 'bg-slate-800 border-border text-slate-400 hover:text-white' 
                            : 'bg-primary/10 border-primary/30 text-primary hover:bg-primary/20'
                        }`}
                      >
                        {isAllPresent ? 'Mark All Absent' : 'Mark All Present'}
                      </button>
                      {expandedTeam === (team.teamId || team._id) ? (
                        <ChevronUp className="w-5 h-5 text-slate-500" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-slate-500" />
                      )}
                    </div>
                  </div>

                  {expandedTeam === (team.teamId || team._id) && (
                    <div className="border-t border-border bg-background p-4 space-y-2">
                      <div className="sm:hidden mb-4">
                        <button 
                          onClick={() => bulkAttendanceMutation.mutate({ teamId: team.teamId || team._id, present: !isAllPresent })}
                          className="w-full px-4 py-2 text-sm font-medium rounded-lg border bg-surface border-border text-slate-300"
                        >
                          {isAllPresent ? 'Mark All Absent' : 'Mark All Present'}
                        </button>
                      </div>
                      
                      {team.members?.map(member => (
                        <div key={member.memberId || member._id} className="flex items-center justify-between p-3 bg-surface rounded-lg border border-border">
                          <div>
                            <p className="font-medium text-slate-200 text-sm">{member.name}</p>
                            <p className="text-xs text-slate-400">{member.regNo}</p>
                          </div>
                          <button
                            onClick={() => memberAttendanceMutation.mutate({ 
                              teamId: team.teamId || team._id, 
                              memberId: member.memberId || member._id, 
                              present: !member.present 
                            })}
                            className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                              member.present
                                ? 'bg-green-500 text-white shadow-lg shadow-green-500/20'
                                : 'bg-slate-800 border border-border text-slate-500 hover:bg-slate-700'
                            }`}
                          >
                            <Check className={`w-5 h-5 ${member.present ? 'opacity-100' : 'opacity-0'}`} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export default AttendanceTracker;

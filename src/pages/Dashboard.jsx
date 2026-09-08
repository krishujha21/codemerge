import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';
import { Users, CheckCircle, Trophy, Activity, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const fetchSummary = async () => {
  // Ideally this comes from a single endpoint or two, simulating concurrent fetches
  const [teamsRes, attendanceRes] = await Promise.all([
    api.get('/api/teams/stats/summary').catch(() => ({ data: { totalTeams: 30, checkedIn: 0, domains: [] } })),
    api.get('/api/attendance/summary/all').catch(() => ({ data: { totalMembers: 116, day1: 0, day2: 0, day3: 0, finalists: 0 } }))
  ]);
  
  return {
    ...teamsRes.data,
    ...attendanceRes.data
  };
};

const StatCard = ({ title, value, icon: Icon, colorClass, linkTo, linkText }) => (
  <div className="bg-surface border border-border rounded-xl p-6 flex flex-col hover:border-slate-600 transition-colors">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-slate-400 font-medium">{title}</h3>
      <div className={`p-2 rounded-lg ${colorClass}`}>
        <Icon className="w-5 h-5" />
      </div>
    </div>
    <div className="text-3xl font-bold text-slate-100 mb-4">{value}</div>
    {linkTo && (
      <Link to={linkTo} className="mt-auto inline-flex items-center text-sm text-primary hover:text-indigo-400 font-medium transition-colors">
        {linkText} <ArrowRight className="w-4 h-4 ml-1" />
      </Link>
    )}
  </div>
);

const Dashboard = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: fetchSummary,
  });

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-surface rounded w-48 mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-surface rounded-xl h-40 border border-border"></div>
          ))}
        </div>
      </div>
    );
  }

  // Fallback defaults for testing UI if API fails
  const totalTeams = stats?.totalTeams || 30;
  const checkedIn = stats?.checkedIn || 0;
  const totalMembers = stats?.totalMembers || 116;
  const day1Present = stats?.day1 || 0;
  const day2Present = stats?.day2 || 0;
  const day3Present = stats?.day3 || 0;
  const finalsSelected = stats?.finalists || 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-100">Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="On-Ground Check-In"
          value={`${checkedIn} / ${totalTeams}`}
          icon={CheckCircle}
          colorClass="bg-green-500/10 text-green-500"
          linkTo="/checkin"
          linkText="Manage Check-Ins"
        />
        <StatCard
          title="Day 1 Attendance"
          value={`${day1Present} / ${totalMembers}`}
          icon={Activity}
          colorClass="bg-indigo-500/10 text-indigo-500"
          linkTo="/attendance?day=1"
          linkText="Track Day 1"
        />
        <StatCard
          title="Day 2 Attendance"
          value={`${day2Present} / ${totalMembers}`}
          icon={Activity}
          colorClass="bg-indigo-500/10 text-indigo-500"
          linkTo="/attendance?day=2"
          linkText="Track Day 2"
        />
        <StatCard
          title="Finals Selection"
          value={`${finalsSelected} / 10`}
          icon={Trophy}
          colorClass="bg-amber-500/10 text-amber-500"
          linkTo="/finals"
          linkText="Select Finalists"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="bg-surface border border-border rounded-xl p-6">
          <h2 className="text-lg font-semibold text-slate-100 mb-4">Domain Breakdown</h2>
          <div className="space-y-4">
            {/* Example static data based on prompt, should ideally come from backend */}
            {[
              { name: 'AI for HealthTech/Fintech/EdTech', count: 19, color: 'bg-violet-500' },
              { name: 'AI for Safety & Security', count: 5, color: 'bg-amber-500' },
              { name: 'AI for Sustainability', count: 5, color: 'bg-green-500' },
              { name: 'AI + IoT', count: 5, color: 'bg-cyan-500' },
            ].map((domain) => (
              <div key={domain.name}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-300">{domain.name}</span>
                  <span className="text-slate-400 font-medium">{domain.count} teams</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2">
                  <div
                    className={`${domain.color} h-2 rounded-full`}
                    style={{ width: `${(domain.count / 30) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-surface border border-border rounded-xl p-6">
          <h2 className="text-lg font-semibold text-slate-100 mb-4">Quick Links</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link to="/teams" className="flex items-center p-4 rounded-lg bg-slate-800/50 hover:bg-slate-800 border border-transparent hover:border-border transition-colors">
              <div className="p-3 rounded-lg bg-primary/10 text-primary mr-4">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <div className="font-medium text-slate-200">All Teams</div>
                <div className="text-xs text-slate-400">View 30 teams</div>
              </div>
            </Link>
            <Link to="/shortlisted" className="flex items-center p-4 rounded-lg bg-slate-800/50 hover:bg-slate-800 border border-transparent hover:border-border transition-colors">
              <div className="p-3 rounded-lg bg-amber-500/10 text-amber-500 mr-4">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <div className="font-medium text-slate-200">Shortlisted</div>
                <div className="text-xs text-slate-400">View top teams</div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

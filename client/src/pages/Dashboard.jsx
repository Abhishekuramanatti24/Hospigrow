// pages/Dashboard.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiBookOpen,
  FiCheckCircle,
  FiLayers,
  FiZap,
  FiClipboard,
  FiAward,
} from 'react-icons/fi';

import { useAuth } from '../context/AuthContext';
import { dashboardService } from '../services/dashboard.service';

import Loader from '../components/Loader';
import DashboardCard from '../components/DashboardCard';
import ProgressCard from '../components/ProgressCard';
import ContinueLearningCard from '../components/ContinueLearningCard';
import SubjectCard from '../components/SubjectCard';
import AssignmentItem from '../components/AssignmentItem';
import QuizScoreItem from '../components/QuizScoreItem';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const fetchDashboard = async () => {
      try {
        const data = await dashboardService.getDashboard();
        if (isMounted) setDashboard(data);
      } catch (err) {
        if (isMounted) setError('Could not load your dashboard. Please try refreshing.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchDashboard();
    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return <Loader fullScreen label="Loading your dashboard..." />;
  }

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      {/* Welcome Banner */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          Welcome back, {user?.name?.split(' ')[0]}
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          {user?.course} · {user?.semester} — here's how your learning is going.
        </p>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3">
          {error}
        </div>
      )}

      {dashboard && (
        <>
          {/* Continue Learning + Overall Progress */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <ContinueLearningCard
              data={dashboard.continueLearning}
              onContinue={(cl) => navigate(`/subjects/${cl.subjectId}`)}
            />
            <ProgressCard percent={dashboard.overallProgress} stats={dashboard.quickStats} />
          </div>

          {/* Quick Statistics */}
          <div>
            <h2 className="text-sm font-semibold text-slate-700 mb-3">Quick Statistics</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <DashboardCard
                icon={<FiCheckCircle size={20} />}
                label="Topics Completed"
                value={dashboard.quickStats.completedTopics}
                accent="green"
              />
              <DashboardCard
                icon={<FiLayers size={20} />}
                label="Chapters Completed"
                value={dashboard.quickStats.completedChapters}
                accent="brand"
              />
              <DashboardCard
                icon={<FiBookOpen size={20} />}
                label="Subjects Enrolled"
                value={dashboard.quickStats.totalSubjects}
                accent="accent"
              />
              <DashboardCard
                icon={<FiZap size={20} />}
                label="Day Streak"
                value={dashboard.quickStats.studyStreakDays}
                accent="amber"
              />
            </div>
          </div>

          {/* Recent Subjects */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-slate-700">Recent Subjects</h2>
              <button
                onClick={() => navigate('/subjects')}
                className="text-xs font-medium text-brand-600 hover:text-brand-700"
              >
                View All
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {dashboard.recentSubjects.map((subject) => (
                <SubjectCard
                  key={subject.id}
                  subject={subject}
                  onContinue={(s) => navigate(`/subjects/${s.id}`)}
                />
              ))}
            </div>
          </div>

          {/* Upcoming Assignments + Recent Quiz Scores */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="bg-white rounded-xl card-shadow p-5">
              <div className="flex items-center gap-2 mb-1">
                <FiClipboard className="text-brand-600" size={18} />
                <h2 className="text-sm font-semibold text-slate-700">Upcoming Assignments</h2>
              </div>
              {dashboard.upcomingAssignments.length === 0 ? (
                <p className="text-sm text-slate-400 py-6 text-center">
                  No upcoming assignments. You're all caught up!
                </p>
              ) : (
                <div className="mt-2">
                  {dashboard.upcomingAssignments.map((assignment) => (
                    <AssignmentItem key={assignment.id} assignment={assignment} />
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl card-shadow p-5">
              <div className="flex items-center gap-2 mb-1">
                <FiAward className="text-brand-600" size={18} />
                <h2 className="text-sm font-semibold text-slate-700">Recent Quiz Scores</h2>
              </div>
              {dashboard.recentQuizScores.length === 0 ? (
                <p className="text-sm text-slate-400 py-6 text-center">No quiz attempts yet.</p>
              ) : (
                <div className="mt-2">
                  {dashboard.recentQuizScores.map((quiz) => (
                    <QuizScoreItem key={quiz.id} quiz={quiz} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </main>
  );
}

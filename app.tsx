import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Gamepad2, Users, Trophy, Calendar, ExternalLink, Circle, UserPlus, UserX } from 'lucide-react';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

interface Team {
  id: string;
  name: string;
  logo_url: string | null;
}

interface Player {
  id: string;
  nickname: string;
  real_name: string | null;
  avatar_url: string | null;
  role: string | null;
  team_id: string | null;
  teams: Team | null;
}

interface Match {
  id: string;
  team1_id: string;
  team2_id: string;
  team1_score: number;
  team2_score: number;
  match_date: string;
  status: 'upcoming' | 'live' | 'completed';
  team1: Team;
  team2: Team;
}

function App() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'teams' | 'players' | 'matches'>('matches');

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    const [teamsRes, playersRes, matchesRes] = await Promise.all([
      supabase.from('teams').select('*'),
      supabase.from('players').select('*, teams(*)'),
      supabase.from('matches').select('*, team1:teams!matches_team1_id_fkey(*), team2:teams!matches_team2_id_fkey(*)').order('match_date', { ascending: true }),
    ]);

    if (teamsRes.data) setTeams(teamsRes.data);
    if (playersRes.data) setPlayers(playersRes.data as Player[]);
    if (matchesRes.data) setMatches(matchesRes.data as Match[]);
    setLoading(false);
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'live':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-500/20 text-red-400 rounded-full text-xs font-medium">
            <Circle className="w-2 h-2 fill-red-500 animate-pulse" />
            LIVE
          </span>
        );
      case 'upcoming':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-medium">
            <Calendar className="w-3 h-3" />
            Скоро
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-xs font-medium">
            <Trophy className="w-3 h-3" />
            Завершен
          </span>
        );
      default:
        return null;
    }
  };

  const getTeamInitials = (name: string) => {
    return name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-900/80 border-b border-slate-800/50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-teal-600 rounded-xl flex items-center justify-center">
              <Gamepad2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">NBOCS2</h1>
              <p className="text-xs text-slate-400">Counter-Strike 2 Organization</p>
            </div>
          </div>

          <a
            href="https://discord.gg/7eq6Nwjsxj"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-[#5865F2] hover:bg-[#4752C4] text-white rounded-lg transition-all duration-200 font-medium text-sm"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.127c.126-.094.252-.192.374-.292a.074.074 0 0 1 .078-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.122.1.248.198.374.292a.077.077 0 0 1-.006.127 12.295 12.295 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.835 19.835 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.086-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.201 0 2.176 1.086 2.157 2.419 0 1.333-.956 2.419-2.157 2.419zm7.975 0c-1.183 0-2.157-1.086-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.202 0 2.176 1.086 2.157 2.419 0 1.333-.955 2.419-2.157 2.419z"/>
            </svg>
            Discord
            <ExternalLink className="w-3.5 h-3.5 opacity-70" />
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-8 p-1 bg-slate-800/50 rounded-xl w-fit">
          <button
            onClick={() => setActiveTab('matches')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all duration-200 font-medium text-sm ${
              activeTab === 'matches'
                ? 'bg-gradient-to-r from-cyan-500 to-teal-600 text-white shadow-lg shadow-cyan-500/25'
                : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <Trophy className="w-4 h-4" />
            Матчи
          </button>
          <button
            onClick={() => setActiveTab('teams')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all duration-200 font-medium text-sm ${
              activeTab === 'teams'
                ? 'bg-gradient-to-r from-cyan-500 to-teal-600 text-white shadow-lg shadow-cyan-500/25'
                : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <Users className="w-4 h-4" />
            Команды
          </button>
          <button
            onClick={() => setActiveTab('players')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all duration-200 font-medium text-sm ${
              activeTab === 'players'
                ? 'bg-gradient-to-r from-cyan-500 to-teal-600 text-white shadow-lg shadow-cyan-500/25'
                : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <Gamepad2 className="w-4 h-4" />
            Игроки
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-10 h-10 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* Matches Tab */}
            {activeTab === 'matches' && (
              matches.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-16 h-16 bg-slate-800/50 rounded-2xl flex items-center justify-center mb-4">
                    <Trophy className="w-8 h-8 text-slate-500" />
                  </div>
                  <h3 className="text-lg font-medium text-white mb-2">Нет матчей</h3>
                  <p className="text-slate-400 text-sm">Матчи пока не добавлены</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {matches.map((match) => (
                    <div
                      key={match.id}
                      className="bg-slate-800/50 rounded-2xl p-5 border border-slate-700/50 hover:border-slate-600/50 transition-all duration-200"
                    >
                      <div className="flex items-center justify-between gap-4">
                        {/* Team 1 */}
                        <div className="flex-1 flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-slate-700 to-slate-600 rounded-xl flex items-center justify-center text-white font-bold text-sm">
                            {getTeamInitials(match.team1.name)}
                          </div>
                          <span className="font-semibold text-white">{match.team1.name}</span>
                        </div>

                        {/* Score / VS */}
                        <div className="flex flex-col items-center px-4">
                          {match.status === 'completed' ? (
                            <div className="flex items-center gap-3">
                              <span className={`text-2xl font-bold ${match.team1_score > match.team2_score ? 'text-emerald-400' : 'text-slate-400'}`}>
                                {match.team1_score}
                              </span>
                              <span className="text-slate-500">:</span>
                              <span className={`text-2xl font-bold ${match.team2_score > match.team1_score ? 'text-emerald-400' : 'text-slate-400'}`}>
                                {match.team2_score}
                              </span>
                            </div>
                          ) : match.status === 'live' ? (
                            <div className="flex items-center gap-3">
                              <span className="text-2xl font-bold text-white">{match.team1_score}</span>
                              <span className="text-slate-500">:</span>
                              <span className="text-2xl font-bold text-white">{match.team2_score}</span>
                            </div>
                          ) : (
                            <span className="text-slate-500 font-medium text-lg">VS</span>
                          )}
                          <div className="mt-1">
                            {getStatusBadge(match.status)}
                          </div>
                        </div>

                        {/* Team 2 */}
                        <div className="flex-1 flex items-center gap-3 justify-end">
                          <span className="font-semibold text-white">{match.team2.name}</span>
                          <div className="w-12 h-12 bg-gradient-to-br from-slate-700 to-slate-600 rounded-xl flex items-center justify-center text-white font-bold text-sm">
                            {getTeamInitials(match.team2.name)}
                          </div>
                        </div>
                      </div>

                      {match.status !== 'live' && (
                        <div className="mt-4 pt-4 border-t border-slate-700/50 flex items-center justify-center gap-2 text-slate-400 text-sm">
                          <Calendar className="w-4 h-4" />
                          {formatDate(match.match_date)}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )
            )}

            {/* Teams Tab */}
            {activeTab === 'teams' && (
              teams.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-16 h-16 bg-slate-800/50 rounded-2xl flex items-center justify-center mb-4">
                    <Users className="w-8 h-8 text-slate-500" />
                  </div>
                  <h3 className="text-lg font-medium text-white mb-2">Нет команд</h3>
                  <p className="text-slate-400 text-sm">Команды пока не добавлены</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {teams.map((team) => (
                    <div
                      key={team.id}
                      className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50 hover:border-cyan-500/50 transition-all duration-200 group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-cyan-500/20 to-teal-500/20 rounded-xl flex items-center justify-center group-hover:from-cyan-500/30 group-hover:to-teal-500/30 transition-all duration-200">
                          <span className="text-white font-bold text-lg">{getTeamInitials(team.name)}</span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-white text-lg">{team.name}</h3>
                          <p className="text-sm text-slate-400">
                            {players.filter(p => p.team_id === team.id).length} игроков
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}

            {/* Players Tab */}
            {activeTab === 'players' && (
              players.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-16 h-16 bg-slate-800/50 rounded-2xl flex items-center justify-center mb-4">
                    <UserX className="w-8 h-8 text-slate-500" />
                  </div>
                  <h3 className="text-lg font-medium text-white mb-2">Нет игроков</h3>
                  <p className="text-slate-400 text-sm">Игроки пока не добавлены</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {players.map((player) => (
                    <div
                      key={player.id}
                      className="bg-slate-800/50 rounded-2xl p-5 border border-slate-700/50 hover:border-cyan-500/50 transition-all duration-200"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {player.nickname.substring(0, 2).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-white truncate">{player.nickname}</h3>
                          <p className="text-sm text-slate-400 truncate">{player.real_name || 'Неизвестно'}</p>
                        </div>
                        {player.role && (
                          <span className="px-2.5 py-1 bg-slate-700/50 text-slate-300 rounded-lg text-xs font-medium">
                            {player.role}
                          </span>
                        )}
                      </div>
                      {player.teams && (
                        <div className="mt-3 pt-3 border-t border-slate-700/50 flex items-center gap-2 text-sm text-slate-400">
                          <Users className="w-4 h-4" />
                          {player.teams.name}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/50 mt-16">
        <div className="max-w-6xl mx-auto px-4 py-6 text-center">
          <p className="text-slate-500 text-sm">NBOCS2 - Counter-Strike 2 Organization</p>
        </div>
      </footer>
    </div>
  );
}

export default App;

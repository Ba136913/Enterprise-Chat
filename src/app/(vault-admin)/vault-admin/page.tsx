'use client';

import { useState, useEffect } from 'react';
import { getAllUsers, monitorActiveConnections } from '@/actions/vault';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Shield, Users, Activity, Eye } from 'lucide-react';

export default function VaultDashboard() {
  const [users, setUsers] = useState<any[]>([]);
  const [stats, setStats] = useState({ status: 'Connecting...', connections: '0' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await getAllUsers();
        setUsers(userData);
        const activeStats = await monitorActiveConnections();
        setStats(activeStats as any);
      } catch (err) {
        console.error('Vault Access Denied');
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-8 font-mono">
      <header className="flex items-center justify-between mb-12 border-b border-slate-800 pb-6">
        <div className="flex items-center gap-3">
          <Shield className="w-8 h-8 text-red-500" />
          <h1 className="text-3xl font-black uppercase tracking-tighter">The Vault <span className="text-red-500">v1.0</span></h1>
        </div>
        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-slate-400">System: {stats.status}</span>
          </div>
          <span className="bg-red-500/10 text-red-500 px-3 py-1 rounded-full border border-red-500/20 font-bold">
            GOD MODE ACTIVE
          </span>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-slate-900 border-slate-800 text-slate-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-400 uppercase tracking-widest">Total Users</CardTitle>
            <Users className="w-4 h-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{users.length}</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800 text-slate-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-400 uppercase tracking-widest">Active Links</CardTitle>
            <Activity className="w-4 h-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{stats.connections}</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800 text-slate-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-400 uppercase tracking-widest">Privacy Level</CardTitle>
            <Eye className="w-4 h-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-red-500">ZERO</div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-slate-900 border-slate-800 text-slate-200">
        <CardHeader>
          <CardTitle className="text-xl uppercase tracking-widest">User Directory (Raw Data)</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-slate-800 hover:bg-transparent">
                <TableHead className="text-slate-400 uppercase text-xs">ID</TableHead>
                <TableHead className="text-slate-400 uppercase text-xs">Username</TableHead>
                <TableHead className="text-slate-400 uppercase text-xs">Phone</TableHead>
                <TableHead className="text-slate-400 uppercase text-xs">Created At</TableHead>
                <TableHead className="text-slate-400 uppercase text-xs">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id} className="border-slate-800 hover:bg-slate-800/50">
                  <TableCell className="text-xs text-slate-500">{user.id}</TableCell>
                  <TableCell className="font-bold text-blue-400">@{user.username}</TableCell>
                  <TableCell>{user.phone_number}</TableCell>
                  <TableCell className="text-slate-500">{new Date(user.created_at).toLocaleString()}</TableCell>
                  <TableCell>
                    <button className="text-red-500 hover:underline text-xs font-bold uppercase tracking-tighter">
                      Spy History
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

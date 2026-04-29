import React from "react";
import { AppShell } from "@/components/AppShell";
import { useGetMe, useGetAdminStats, useListAdminUsers } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ShieldAlert, Users, FileText, TrendingUp, CreditCard } from "lucide-react";

export default function Admin() {
  const { data: me, isLoading: meLoading } = useGetMe();
  const { data: stats, isLoading: statsLoading } = useGetAdminStats();
  const { data: users, isLoading: usersLoading } = useListAdminUsers();

  if (meLoading) return <AppShell><div className="p-8 text-center">Loading...</div></AppShell>;

  if (!me?.isAdmin) {
    return (
      <AppShell>
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center max-w-md mx-auto">
          <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mb-6">
            <ShieldAlert className="w-10 h-10 text-destructive" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Restricted Access</h1>
          <p className="text-muted-foreground">
            You don't have authorization to view the admin dashboard. This area is restricted to staff only.
          </p>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">Platform statistics and user management.</p>
        </div>

        {statsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-pulse">
            {[1, 2, 3, 4, 5, 6].map(i => <Card key={i}><CardContent className="h-24" /></Card>)}
          </div>
        ) : stats ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <StatCard title="Total Users" value={stats.totalUsers} icon={Users} />
            <StatCard title="Total Translations" value={stats.totalTranslations} icon={FileText} />
            <StatCard title="Pro Users" value={stats.proUsers} icon={CreditCard} subValue={`${stats.freeUsers} free users`} />
            <StatCard title="7-Day Signups" value={stats.signupsLast7Days} icon={TrendingUp} />
            <StatCard title="7-Day Translations" value={stats.translationsLast7Days} icon={TrendingUp} />
            <Card className="bg-primary text-primary-foreground border-none">
              <CardContent className="p-6 flex flex-col justify-center h-full">
                <div className="text-primary-foreground/80 font-medium mb-1">Conversion Rate</div>
                <div className="text-3xl font-bold">
                  {stats.totalUsers > 0 ? Math.round((stats.proUsers / stats.totalUsers) * 100) : 0}%
                </div>
              </CardContent>
            </Card>
          </div>
        ) : null}

        <Card>
          <CardHeader>
            <CardTitle>Recent Users</CardTitle>
          </CardHeader>
          <CardContent>
            {usersLoading ? (
              <div className="h-64 animate-pulse bg-muted rounded-md" />
            ) : users && users.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead>Email</TableHead>
                      <TableHead>Tier</TableHead>
                      <TableHead className="text-right">Translations</TableHead>
                      <TableHead className="text-right">Joined</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map(user => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.email}</TableCell>
                        <TableCell>
                          {user.subscriptionTier === 'pro' ? (
                            <Badge className="bg-primary text-primary-foreground">Pro</Badge>
                          ) : (
                            <Badge variant="secondary">Free</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right font-mono">{user.translationsUsed}</TableCell>
                        <TableCell className="text-right text-muted-foreground">
                          {format(new Date(user.createdAt), "MMM d, yyyy")}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">No users found.</div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}

function StatCard({ title, value, icon: Icon, subValue }: any) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between space-y-0 pb-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <Icon className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="text-3xl font-bold">{value}</div>
        {subValue && <p className="text-xs text-muted-foreground mt-1">{subValue}</p>}
      </CardContent>
    </Card>
  );
}

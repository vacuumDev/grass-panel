'use client'
import React, { useEffect, useState } from 'react';
import { Container, Typography, CircularProgress, Paper, Box, Grid } from '@mui/material';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
    const router = useRouter();
    const [servers, setServers] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard`, { credentials: 'include' });
            if (res.ok) {
                const data = await res.json();
                setServers(data); // API возвращает массив серверов
            } else {
                router.push('/');
            }
            setLoading(false);
        };
        fetchData();
    }, [router]);

    if (loading) {
        return (
            <Container sx={{ textAlign: 'center', mt: 8 }}>
                <CircularProgress />
            </Container>
        );
    }

    // Общие итоги
    const totalAccounts = servers.reduce((acc, server) => acc + (server.data.totalAccounts || 0), 0);
    const totalPoints = servers.reduce((acc, server) => acc + (server.data.totalPoints || 0), 0);
    const workingThreads = servers.reduce((acc, server) => acc + (server.data.threads.working || 0), 0);
    const totalThreads = servers.reduce((acc, server) => acc + (server.data.threads.total || 0), 0);
    const totalPointsChange = servers.reduce((acc, server) => acc + (server.data.totalChange24h || 0), 0);


    // Агрегация аккаунтов по странам
    const aggregatedAccounts = servers.reduce((acc, srv) => {
        Object.entries(srv.data.countries).forEach(([country, cnt]) => {
            acc[country] = (acc[country] || 0) + cnt;
        });
        return acc;
    }, {});

    // Агрегация потоков по странам: working и total
    const aggregatedThreadsWorking = servers.reduce((acc, srv) => {
        Object.entries(srv.data.threadsByCountry).forEach(([country, stats]) => {
            acc[country] = (acc[country] || 0) + stats.working;
        });
        return acc;
    }, {});

    const aggregatedThreadsTotal = servers.reduce((acc, srv) => {
        Object.entries(srv.data.threadsByCountry).forEach(([country, stats]) => {
            acc[country] = (acc[country] || 0) + stats.total;
        });
        return acc;
    }, {});

    // Собираем единый список стран
    const allCountries = Array.from(new Set([
        ...Object.keys(aggregatedAccounts),
        ...Object.keys(aggregatedThreadsWorking),
        ...Object.keys(aggregatedThreadsTotal),
    ]));

    // Формируем и сортируем по убыванию числа аккаунтов
    const sortedCountries = allCountries
        .map(country => ({
            country,
            accounts: aggregatedAccounts[country] || 0,
            threadsWorking: aggregatedThreadsWorking[country] || 0,
            threadsTotal: aggregatedThreadsTotal[country] || 0,
        }))
        .sort((a, b) => b.accounts - a.accounts);

    return (
        <Container sx={{ mt: 4 }} maxWidth="2xl">
            <Typography variant="h4" gutterBottom>
                Dashboard
            </Typography>
            <Typography variant="h6" gutterBottom>
                Общая статистика по всем серверам
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {servers && servers.map((server, index) => (
                    <Paper
                        key={index}
                        sx={{
                            p: 2,
                            cursor: 'pointer',
                            transition: 'box-shadow 0.3s',
                            '&:hover': { boxShadow: 6 },
                        }}
                        onClick={() => router.push(`/dashboard/${server.ip}`)}
                    >
                        <Grid container spacing={1}>
                            <Grid item xs={2}>
                                <Typography variant="subtitle2" color="textSecondary">
                                    IP
                                </Typography>
                            </Grid>
                            <Grid item xs={2}>
                                <Typography variant="subtitle2" color="textSecondary">
                                    Status
                                </Typography>
                            </Grid>
                            <Grid item xs={1}>
                                <Typography variant="subtitle2" color="textSecondary">
                                    Points
                                </Typography>
                            </Grid>
                            <Grid item xs={1}>
                                <Typography variant="subtitle2" color="textSecondary">
                                    24h Change
                                </Typography>
                            </Grid>
                            <Grid item xs={2}>
                                <Typography variant="subtitle2" color="textSecondary">
                                    Threads
                                </Typography>
                            </Grid>
                            <Grid item xs={2}>
                                <Typography variant="subtitle2" color="textSecondary">
                                    CPU
                                </Typography>
                            </Grid>
                            <Grid item xs={2}>
                                <Typography variant="subtitle2" color="textSecondary">
                                    Memory
                                </Typography>
                            </Grid>

                            <Grid item xs={2}>
                                <Typography variant="body1">
                                    {server.ip}
                                </Typography>
                            </Grid>
                            <Grid item xs={2}>
                                <Typography variant="body1">
                                    {server.data.status === 'working' ? '🟢 Running' : '🔴 Stopped'}
                                </Typography>
                            </Grid>
                            <Grid item xs={1}>
                                <Typography variant="body1">
                                    {server.data.totalPoints}
                                </Typography>
                            </Grid>
                            <Grid item xs={1}>
                                <Typography variant="body1">
                                    +{server.data.totalChange24h}
                                </Typography>
                            </Grid>
                            <Grid item xs={2}>
                                <Typography variant="body1">
                                    {server.data.threads.working}/{server.data.threads.total}
                                </Typography>
                            </Grid>
                            <Grid item xs={2}>
                                <Typography variant="body1">
                                    {server.data.cpu.averageUsage}% ({server.data.cpu.numCores} cores)
                                </Typography>
                            </Grid>
                            <Grid item xs={2}>
                                <Typography variant="body1">
                                    {server.data.memory.used}GB / {server.data.memory.total}GB ({server.data.memory.usedPercentage}%)
                                </Typography>
                            </Grid>
                        </Grid>
                    </Paper>
                ))}
            </Box>

            {/* Общие итоговые данные */}
            <Paper sx={{ p: 2, mt: 4 }}>
                <Grid container spacing={2}>
                    <Grid item xs={3}>
                        <Typography variant="subtitle1">
                            Total Accounts
                        </Typography>
                    </Grid>
                    <Grid item xs={3}>
                        <Typography variant="subtitle1">
                            Total Points
                        </Typography>
                    </Grid>
                    <Grid item xs={3}>
                        <Typography variant="subtitle1">
                            Total Threads
                        </Typography>
                    </Grid>
                    <Grid item xs={3}>
                        <Typography variant="subtitle1">
                            Points 24h Change
                        </Typography>
                    </Grid>
                    <Grid item xs={3}>
                        <Typography variant="body1">
                            {totalAccounts}
                        </Typography>
                    </Grid>
                    <Grid item xs={3}>
                        <Typography variant="body1">
                            {totalPoints}
                        </Typography>
                    </Grid>
                    <Grid item xs={3}>
                        <Typography variant="body1">
                            {workingThreads}/{totalThreads}
                        </Typography>
                    </Grid>
                    <Grid item xs={3}>
                        <Typography variant="body1">
                            {totalPointsChange}
                        </Typography>
                    </Grid>
                </Grid>
            </Paper>

            {/* Суммарная статистика по странам */}
            <Paper sx={{ p: 2, mt: 4 }}>
                <Typography variant="h6" gutterBottom>
                    Суммарная статистика по странам
                </Typography>
                <Grid container spacing={1}>
                    <Grid item xs={4}>
                        <Typography variant="subtitle1">Страна</Typography>
                    </Grid>
                    <Grid item xs={4}>
                        <Typography variant="subtitle1">Потоки</Typography>
                    </Grid>
                    <Grid item xs={4}>
                        <Typography variant="subtitle1">Аккаунты</Typography>
                    </Grid>
                    {sortedCountries.map(({ country, accounts, threadsWorking, threadsTotal }) => (
                        <React.Fragment key={country}>
                            <Grid item xs={4}>
                                <Typography variant="body1">{country}</Typography>
                            </Grid>
                            <Grid item xs={4}>
                                <Typography variant="body1">{threadsWorking}/{threadsTotal}</Typography>
                            </Grid>
                            <Grid item xs={4}>
                                <Typography variant="body1">{accounts}</Typography>
                            </Grid>
                        </React.Fragment>
                    ))}
                </Grid>
            </Paper>
        </Container>
    );
}

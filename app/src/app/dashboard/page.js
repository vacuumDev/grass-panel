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
            const res = await fetch('http://localhost:8080/dashboard', { credentials: 'include' });
            if (res.ok) {
                const data = await res.json();
                setServers(data.servers);
            } else {
                router.push('/');
            }
            setLoading(false);
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <Container sx={{ textAlign: 'center', mt: 8 }}>
                <CircularProgress />
            </Container>
        );
    }

    return (
        <Container sx={{ mt: 4 }} maxWidth={false}>
            <Typography variant="h4" gutterBottom>
                Dashboard
            </Typography>
            <Typography variant="h6" gutterBottom>
                Общая статистика по всем серверам
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {servers && servers.map((server) => (
                    <Paper
                        key={server.id}
                        sx={{
                            p: 2,
                            cursor: 'pointer',
                            transition: 'box-shadow 0.3s',
                            '&:hover': { boxShadow: 6 },
                        }}
                        onClick={() => router.push(`/dashboard/${server.id}`)}
                    >
                        <Grid container alignItems="center"
                              sx={{
                                  display: 'flex',
                                  justifyContent: 'space-around',
                              }}>
                            <Grid item xs={1}>
                                <Typography variant="subtitle1">🖥 server-{server.id}</Typography>
                            </Grid>
                            <Grid item xs={1}>
                                <Typography variant="subtitle1">{server.username}</Typography>
                            </Grid>
                            <Grid item xs={1}>
                                <Typography variant="subtitle1">{server.threads} threads</Typography>
                            </Grid>
                            <Grid item xs={1}>
                                <Typography variant="subtitle1">{server.last24}/24hr</Typography>
                            </Grid>
                            <Grid item xs={1}>
                                <Typography variant="subtitle1">{server.points} points</Typography>
                            </Grid>
                            <Grid item xs={1}>
                                <Typography variant="subtitle1">
                                    {server.status === 'Running' ? '🟢 Running' : '🔴 ' + server.status}
                                </Typography>
                            </Grid>
                            <Grid item xs={1}>
                                <Typography variant="subtitle1">{server.ip}</Typography>
                            </Grid>
                            <Grid item xs={1}>
                                <Typography variant="subtitle1">86% CPU</Typography>
                            </Grid>
                            <Grid item xs={1}>
                                <Typography variant="subtitle1">17.8G</Typography>
                            </Grid>
                        </Grid>
                    </Paper>
                ))}
            </Box>
        </Container>
    );
}

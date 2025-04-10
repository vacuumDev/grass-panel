'use client'
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Container, Typography, CircularProgress, Button, Paper, Box, Grid } from '@mui/material';

export default function ServerDetail() {
    const params = useParams();
    const router = useRouter();
    const [server, setServer] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/server/${params.id}`, { credentials: 'include' });
            if (res.ok) {
                const data = await res.json();
                setServer(data);
            } else {
                router.push('/dashboard');
            }
            setLoading(false);
        };
        fetchData();
    }, [params.id]);

    if (loading) {
        return (
            <Container sx={{ textAlign: 'center', mt: 8 }}>
                <CircularProgress />
            </Container>
        );
    }

    return (
        <Container sx={{ mt: 4 }}>
            <Button variant="outlined" onClick={() => router.push('/dashboard')} sx={{ mb: 2 }}>
                Назад
            </Button>
            <Paper sx={{ p: 3 }}>
                <Typography variant="h4" gutterBottom>
                    Детали сервера {params.id}
                </Typography>
                {/* Общая информация */}
                <Box sx={{ mb: 3 }}>
                    <Typography variant="h6">Общая информация</Typography>
                    <Grid container spacing={1}>
                        <Grid item xs={6}>
                            <Typography variant="subtitle1">Total Points:</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="body1">{server.totalPoints}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="subtitle1">Points Change (24h):</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="body1">{server.totalChange24h}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="subtitle1">Status:</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="body1">
                                {server.status === 'working' ? '🟢 Running' : '🔴 Stopped'}
                            </Typography>
                        </Grid>
                    </Grid>
                </Box>
                {/* Потоки */}
                <Box sx={{ mb: 3 }}>
                    <Typography variant="h6">Потоки (Threads)</Typography>
                    <Grid container spacing={1}>
                        <Grid item xs={6}>
                            <Typography variant="subtitle1">Working:</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="body1">{server.threads.working}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="subtitle1">Total:</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="body1">{server.threads.total}</Typography>
                        </Grid>
                    </Grid>
                </Box>
                {/* CPU */}
                <Box sx={{ mb: 3 }}>
                    <Typography variant="h6">CPU</Typography>
                    <Grid container spacing={1}>
                        <Grid item xs={6}>
                            <Typography variant="subtitle1">Average Usage:</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="body1">{server.cpu.averageUsage}%</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="subtitle1">Number of Cores:</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="body1">{server.cpu.numCores}</Typography>
                        </Grid>
                    </Grid>
                    <Box sx={{ mt: 1 }}>
                        <Typography variant="subtitle1">Детали по ядрам:</Typography>
                        {server.cpu.cores.map((core, index) => (
                            <Typography key={index} variant="body2">
                                Core {core.core}: {core.usage}%
                            </Typography>
                        ))}
                    </Box>
                </Box>
                {/* Память */}
                <Box sx={{ mb: 3 }}>
                    <Typography variant="h6">Память (Memory)</Typography>
                    <Grid container spacing={1}>
                        <Grid item xs={6}>
                            <Typography variant="subtitle1">Used:</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="body1">{server.memory.used} GB</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="subtitle1">Total:</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="body1">{server.memory.total} GB</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="subtitle1">Usage Percentage:</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="body1">{server.memory.usedPercentage}%</Typography>
                        </Grid>
                    </Grid>
                </Box>
                {/* Страны */}
                <Box sx={{ mb: 3 }}>
                    <Typography variant="h6">Countries</Typography>
                    <Grid container spacing={1}>
                        {Object.entries(server.countries).map(([country, count], index) => (
                            <Grid item xs={6} key={index}>
                                <Typography variant="body1">
                                    {country}: {count}
                                </Typography>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </Paper>
        </Container>
    );
}

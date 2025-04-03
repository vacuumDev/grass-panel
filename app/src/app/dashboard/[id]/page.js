'use client'
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Container, Typography, CircularProgress, Button, Paper, Box } from '@mui/material';

export default function ServerDetail() {
    const params = useParams();
    const router = useRouter();
    const [server, setServer] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch(`http://localhost:8080/server/${params.id}`, { credentials: 'include' });
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
            <Button
                variant="outlined"
                onClick={() => router.push('/dashboard')}
                sx={{ mb: 2 }}
            >
                Назад
            </Button>
            <Paper sx={{ p: 3 }}>
                <Typography variant="h4" gutterBottom>
                    Сервер {server.id}
                </Typography>
                <Typography variant="body1" gutterBottom>
                    Threads: {server.threads}
                </Typography>
                <Typography variant="body1" gutterBottom>
                    Last 24 hrs: {server.last24}
                </Typography>
                <Typography variant="body1" gutterBottom>
                    Points: {server.points}
                </Typography>
                <Typography variant="body1" gutterBottom>
                    Использование памяти: {server.memory}
                </Typography>
                <Typography variant="body1" gutterBottom>
                    Количество ядер: {server.cores}
                </Typography>
            </Paper>
        </Container>
    );
}

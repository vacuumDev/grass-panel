'use client'
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TextField, Button, Container, Typography, Box, Paper } from '@mui/material';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ username, password })
    });
    if (res.ok) {
      router.push('/dashboard');
    } else {
      setError('Неверные учетные данные');
    }
  };

  return (
      <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
      >
        <Paper elevation={6} sx={{ padding: 4, maxWidth: 400, width: '100%' }}>
          <Typography variant="h4" align="center" gutterBottom>
            Вход
          </Typography>
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
                label="Логин"
                fullWidth
                margin="normal"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
                label="Пароль"
                type="password"
                fullWidth
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            {error && <Typography color="error" align="center">{error}</Typography>}
            <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
            >
              Войти
            </Button>
          </Box>
        </Paper>
      </Box>
  );
}

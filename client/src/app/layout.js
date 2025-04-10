"use client"
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';

export default function RootLayout({ children }) {
    const theme = createTheme({
        palette: {
            primary: { main: '#1976d2' }, // синий
            background: {
                default: '#f4f6f8'
            }
        },
        typography: {
            fontFamily: 'Roboto, sans-serif',
        }
    });

    return (
        <html lang="en">
        <body>
        <ThemeProvider theme={theme}>
            <CssBaseline />
            {children}
        </ThemeProvider>
        </body>
        </html>
    );
}

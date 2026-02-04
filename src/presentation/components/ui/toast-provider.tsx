'use client';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTheme } from 'next-themes';

export const ToastProvider = () => {
    const { theme } = useTheme();

    return (
        <ToastContainer
            position="top-center"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme={theme === 'dark' ? 'dark' : 'light'}
            toastStyle={theme === 'dark' ? { backgroundColor: '#1e293b', color: '#fff' } : {}}
        />
    );
};

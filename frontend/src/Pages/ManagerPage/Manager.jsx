import React, { useEffect, useState } from 'react';
import { fetchManagerData } from '../../api/userApi';
import { useSelector } from 'react-redux';
import { selectAuthUser } from '../../redux/authSlice';
import '../../Styles/Manager.css';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Snackbar, Alert } from '@mui/material';

function Manager() {
    const user = useSelector(selectAuthUser);
    const [phoneNumbers, setPhoneNumbers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (user) {
                    const data = await fetchManagerData(user.id);
                    console.log(data)
                    setPhoneNumbers(data.phoneNumbers);
                }
            } catch (error) {
                console.error('Error fetching manager data:', error);
                setSnackbarMessage('Ошибка получения данных');
                setSnackbarOpen(true);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user]);

    return (
        <div style={{ padding: '10px 20px' }}>
            <h2>{user.department}</h2>
            {loading ? (
                <p>Загрузка...</p>
            ) : (
                <TableContainer component={Paper}>
                    <Table aria-label="manager phones table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Должность</TableCell>
                                <TableCell>Телефон</TableCell>
                                <TableCell>Дом. телефон</TableCell>
                                <TableCell>Моб. телефон</TableCell>
                                <TableCell>ФИО</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {phoneNumbers.map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell>{row.doljnost || '-'}</TableCell>
                                    <TableCell>{row.phone || '-'}</TableCell>
                                    <TableCell>{row.home_phone || '-'}</TableCell>
                                    <TableCell>{row.mobile_phone || '-'}</TableCell>
                                    <TableCell>{row.fio || '-'}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={() => setSnackbarOpen(false)}>
                <Alert onClose={() => setSnackbarOpen(false)} severity="error">
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </div>
    );
}

export default Manager;

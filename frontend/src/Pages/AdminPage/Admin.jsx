import React, { useEffect, useState } from 'react';
import { getAuthUsers, addUser, editUser, deleteUser } from '../../api/userApi'; // Ensure correct import paths
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import { Snackbar, Alert } from '@mui/material';

function Admin() {
    const [managersData, setManagersData] = useState([]);
    const [adminsData, setAdminsData] = useState([]);
    const [usersData, setUsersData] = useState([]);
    const [selectedManagerRow, setSelectedManagerRow] = useState(null);
    const [selectedAdminRow, setSelectedAdminRow] = useState(null);
    const [selectedUserRow, setSelectedUserRow] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await getAuthUsers();
                const managers = data.filter(user => user.role === 'manager');
                const admins = data.filter(user => user.role === 'admin');
                const users = data.filter(user => user.role === 'user');
                setManagersData(managers);
                setAdminsData(admins);
                setUsersData(users);
            } catch (error) {
                console.error('Error fetching users data:', error);
                setSnackbarMessage('Ошибка получения данных');
                setSnackbarOpen(true);
            }
        };

        fetchUsers();
    }, []);

    const handleRowClick = (index, role) => {
        if (role === 'manager') {
            setSelectedManagerRow(index);
            setSelectedAdminRow(null);
            setSelectedUserRow(null);
        } else if (role === 'admin') {
            setSelectedAdminRow(index);
            setSelectedManagerRow(null);
            setSelectedUserRow(null);
        } else if (role === 'user') {
            setSelectedUserRow(index);
            setSelectedManagerRow(null);
            setSelectedAdminRow(null);
        }
    };

    const handleEdit = async () => {
        if (selectedManagerRow !== null) {
            const user = managersData[selectedManagerRow];
            try {
                await editUser(user.id, user);
                setSnackbarMessage('Изменения сохранены');
                setSnackbarOpen(true);
            } catch (error) {
                console.error('Error editing user:', error);
                setSnackbarMessage('Ошибка при сохранении изменений');
                setSnackbarOpen(true);
            }
        }
    };

    const handleDelete = async () => {
        if (selectedManagerRow !== null) {
            const user = managersData[selectedManagerRow];
            try {
                await deleteUser(user.id);
                setManagersData(managersData.filter((_, index) => index !== selectedManagerRow));
                setSelectedManagerRow(null);
                setSnackbarMessage('Пользователь удален');
                setSnackbarOpen(true);
            } catch (error) {
                console.error('Error deleting user:', error);
                setSnackbarMessage('Ошибка при удалении пользователя');
                setSnackbarOpen(true);
            }
        }
    };

    const renderActions = (role, index) => {
        if ((role === 'manager' && selectedManagerRow === index) ||
            (role === 'admin' && selectedAdminRow === index) ||
            (role === 'user' && selectedUserRow === index)) {
            return (
                <TableRow>
                    <TableCell colSpan={3}>
                        <Button onClick={handleEdit}>Изменить</Button>
                        <Button onClick={handleDelete}>Удалить</Button>
                    </TableCell>
                </TableRow>
            );
        }
        return null;
    };

    return (
        <div>
            <Button>Добавить пользователя</Button>
            <Button>Добавить менеджера</Button>
            <Button>Добавить администратора</Button>
            <h2>Менеджеры</h2>
            <TableContainer component={Paper}>
                <Table aria-label="managers table">
                    <TableHead>
                        <TableRow>
                            <TableCell>ФИО</TableCell>
                            <TableCell>Роль</TableCell>
                            <TableCell>Отдел</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {managersData.map((row, index) => (
                            <React.Fragment key={index}>
                                <TableRow
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 }, backgroundColor: selectedManagerRow === index ? '#f5f5f5' : 'inherit' }}
                                    onClick={() => handleRowClick(index, 'manager')}
                                >
                                    <TableCell>{row.name || '-'}</TableCell>
                                    <TableCell>{row.role || '-'}</TableCell>
                                    <TableCell>{row.department || '-'}</TableCell>
                                </TableRow>
                                {renderActions('manager', index)}
                            </React.Fragment>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <h2>Администраторы</h2>
            <TableContainer component={Paper}>
                <Table aria-label="admins table">
                    <TableHead>
                        <TableRow>
                            <TableCell>ФИО</TableCell>
                            <TableCell>Роль</TableCell>
                            <TableCell>Отдел</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {adminsData.map((row, index) => (
                            <React.Fragment key={index}>
                                <TableRow
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 }, backgroundColor: selectedAdminRow === index ? '#f5f5f5' : 'inherit' }}
                                    onClick={() => handleRowClick(index, 'admin')}
                                >
                                    <TableCell>{row.name || '-'}</TableCell>
                                    <TableCell>{row.role || '-'}</TableCell>
                                    <TableCell>{row.department || '-'}</TableCell>
                                </TableRow>
                                {renderActions('admin', index)}
                            </React.Fragment>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <h2>Пользователи</h2>
            <TableContainer component={Paper}>
                <Table aria-label="users table">
                    <TableHead>
                        <TableRow>
                            <TableCell>ФИО</TableCell>
                            <TableCell>Роль</TableCell>
                            <TableCell>Отдел</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {usersData.map((row, index) => (
                            <React.Fragment key={index}>
                                <TableRow
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 }, backgroundColor: selectedUserRow === index ? '#f5f5f5' : 'inherit' }}
                                    onClick={() => handleRowClick(index, 'user')}
                                >
                                    <TableCell>{row.name || '-'}</TableCell>
                                    <TableCell>{row.role || '-'}</TableCell>
                                    <TableCell>{row.department || '-'}</TableCell>
                                </TableRow>
                                {renderActions('user', index)}
                            </React.Fragment>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={() => setSnackbarOpen(false)}>
                <Alert onClose={() => setSnackbarOpen(false)} severity="success">
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </div>
    );
}

export default Admin;

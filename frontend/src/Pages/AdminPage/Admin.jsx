import React, { useEffect, useState } from 'react';
import { getAuthUsers, editUser, deleteUser } from '../../api/userApi';
import { getPhones } from '../../api/api';
import '../../Styles/Admin.css'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import { Snackbar, Alert } from '@mui/material';
import Swal from 'sweetalert2';

function Admin() {
    const [managersData, setManagersData] = useState([]);
    const [adminsData, setAdminsData] = useState([]);
    const [usersData, setUsersData] = useState([]);
    const [uniqueDepartments, setUniqueDepartments] = useState([]);
    const [selectedManagerRow, setSelectedManagerRow] = useState(null);
    const [selectedAdminRow, setSelectedAdminRow] = useState(null);
    const [selectedUserRow, setSelectedUserRow] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const [userData, phoneData] = await Promise.all([getAuthUsers(), getPhones()]);
                const managers = userData.filter(user => user.role === 'manager');
                const admins = userData.filter(user => user.role === 'admin');
                const users = userData.filter(user => user.role === 'user');

                const allDepartments = phoneData.map(phone => phone.struct_podrazdel);
                const uniqueDepartments = Array.from(new Set(allDepartments))
                    .filter(dept => dept)
                    .sort((a, b) => a.localeCompare(b));

                setUniqueDepartments(uniqueDepartments);
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
        setIsEditing(true);
    };

    const handleSave = async () => {
        let updatedUser;
        let oldRole, newRole;

        if (selectedManagerRow !== null) {
            updatedUser = { ...managersData[selectedManagerRow] };
            oldRole = 'manager';
        } else if (selectedAdminRow !== null) {
            updatedUser = { ...adminsData[selectedAdminRow] };
            oldRole = 'admin';
        } else if (selectedUserRow !== null) {
            updatedUser = { ...usersData[selectedUserRow] };
            oldRole = 'user';
        }
        newRole = updatedUser.role;

        try {
            await editUser(updatedUser.id, updatedUser);
            if (oldRole !== newRole) {
                if (oldRole === 'manager') {
                    setManagersData(prev => prev.filter((user, idx) => idx !== selectedManagerRow));
                } else if (oldRole === 'admin') {
                    setAdminsData(prev => prev.filter((user, idx) => idx !== selectedAdminRow));
                } else if (oldRole === 'user') {
                    setUsersData(prev => prev.filter((user, idx) => idx !== selectedUserRow));
                }
                if (newRole === 'manager') {
                    setManagersData(prev => [...prev, updatedUser]);
                } else if (newRole === 'admin') {
                    setAdminsData(prev => [...prev, updatedUser]);
                } else if (newRole === 'user') {
                    setUsersData(prev => [...prev, updatedUser]);
                }
            } else {
                if (oldRole === 'manager') {
                    setManagersData(prev => prev.map((user, idx) => idx === selectedManagerRow ? updatedUser : user));
                } else if (oldRole === 'admin') {
                    setAdminsData(prev => prev.map((user, idx) => idx === selectedAdminRow ? updatedUser : user));
                } else if (oldRole === 'user') {
                    setUsersData(prev => prev.map((user, idx) => idx === selectedUserRow ? updatedUser : user));
                }
            }
            setSnackbarMessage('Изменения сохранены');
            setSnackbarOpen(true);
        } catch (error) {
            console.error('Error saving user:', error);
            setSnackbarMessage('Ошибка при сохранении изменений');
            setSnackbarOpen(true);
        } finally {
            setIsEditing(false);
            setSelectedManagerRow(null);
            setSelectedAdminRow(null);
            setSelectedUserRow(null);
        }
    };


    const handleDelete = () => {
        if (selectedManagerRow !== null) {
            Swal.fire({
                title: 'Внимание!',
                text: 'Подтвердите удаление',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Удалить',
                cancelButtonText: 'Отмена'
            }).then(async (result) => {
                if (result.isConfirmed) {
                    const user = managersData[selectedManagerRow];
                    try {
                        await deleteUser(user.id);
                        setManagersData(managersData.filter((_, index) => index !== selectedManagerRow));
                        setSelectedManagerRow(null);
                        setSnackbarMessage('Менеджер удален');
                        setSnackbarOpen(true);
                    } catch (error) {
                        console.error('Error deleting user:', error);
                        setSnackbarMessage('Ошибка при удалении менеджера');
                        setSnackbarOpen(true);
                    }
                }
            });
        } else if (selectedAdminRow !== null) {
            Swal.fire({
                title: 'Внимание!',
                text: 'Подтвердите удаление',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Удалить',
                cancelButtonText: 'Отмена'
            }).then(async (result) => {
                if (result.isConfirmed) {
                    const user = adminsData[selectedAdminRow];
                    try {
                        await deleteUser(user.id);
                        setAdminsData(adminsData.filter((_, index) => index !== selectedAdminRow));
                        setSelectedAdminRow(null);
                        setSnackbarMessage('Администратор удален');
                        setSnackbarOpen(true);
                    } catch (error) {
                        console.error('Error deleting user:', error);
                        setSnackbarMessage('Ошибка при удалении администратора');
                        setSnackbarOpen(true);
                    }
                }
            });
        } else if (selectedUserRow !== null) {
            Swal.fire({
                title: 'Внимание!',
                text: 'Подтвердите удаление',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Удалить',
                cancelButtonText: 'Отмена'
            }).then(async (result) => {
                if (result.isConfirmed) {
                    const user = usersData[selectedUserRow];
                    try {
                        await deleteUser(user.id);
                        setUsersData(usersData.filter((_, index) => index !== selectedUserRow));
                        setSelectedUserRow(null);
                        setSnackbarMessage('Пользователь удален');
                        setSnackbarOpen(true);
                    } catch (error) {
                        console.error('Error deleting user:', error);
                        setSnackbarMessage('Ошибка при удалении пользователя');
                        setSnackbarOpen(true);
                    }
                }
            });
        } else {
            setSnackbarMessage('Выберите пользователя для удаления');
            setSnackbarOpen(true);
        }
    };

    const renderActions = (role, index) => {
        const isRowSelected = (role === 'manager' && selectedManagerRow === index) ||
            (role === 'admin' && selectedAdminRow === index) ||
            (role === 'user' && selectedUserRow === index);

        if (isRowSelected) {
            return (
                <TableRow>
                    <TableCell colSpan={3}>
                        {!isEditing ? (
                            <div className='buttons_container'>
                                <Button onClick={handleEdit} className='user_edit_button'>Изменить</Button>
                                <Button onClick={handleDelete} className='user_delete_button'>Удалить</Button>
                            </div>
                        ) : (
                            <div className='buttons_container'>
                                <Button onClick={handleSave} className='user_edit_accept_button'>Сохранить</Button>
                                <Button onClick={() => setIsEditing(false)} className='user_edit_decline_button'>Отменить</Button>
                            </div>
                        )}
                    </TableCell>
                </TableRow>
            );
        }
        return null;
    };

    const renderRow = (row, index, role) => {
        const isSelected = (role === 'manager' && selectedManagerRow === index) ||
            (role === 'admin' && selectedAdminRow === index) ||
            (role === 'user' && selectedUserRow === index);

        return (
            <React.Fragment key={index}>
                <TableRow
                    sx={{ '&:last-child td, &:last-child th': { border: 0 }, backgroundColor: isSelected ? '#f5f5f5' : 'inherit' }}
                    onClick={() => handleRowClick(index, role)}
                >
                    <TableCell>{row.name || '-'}</TableCell>
                    <TableCell>
                        {isEditing && isSelected ? (
                            <select
                                value={row.role}
                                onChange={(e) => handleInputChange(e, 'role', index, role)}
                            >
                                <option value="user">Пользователь</option>
                                <option value="manager">Менеджер</option>
                                <option value="admin">Администратор</option>
                            </select>
                        ) : (
                            row.role === 'user' ? 'Пользователь' :
                                row.role === 'manager' ? 'Менеджер' :
                                    row.role === 'admin' ? 'Администратор' :
                                        '-'
                        )}
                    </TableCell>

                    <TableCell>
                        {isEditing && isSelected && row.role !== 'admin' && row.role !== 'user' ? (
                            <select
                                value={row.department || ''}
                                onChange={(e) => handleInputChange(e, 'department', index, role)}
                            >
                                <option value="">Выберите департамент</option>
                                {uniqueDepartments.map((dept, i) => (
                                    <option key={i} value={dept}>{dept}</option>
                                ))}
                            </select>
                        ) : (
                            row.department || '-'
                        )}
                    </TableCell>
                </TableRow>
                {renderActions(role, index)}
            </React.Fragment>
        );
    };

    const handleInputChange = (e, field, index, role) => {
        const value = e.target.value;
        if (role === 'manager') {
            setManagersData(prev => prev.map((user, idx) => idx === index ? { ...user, [field]: value } : user));
        } else if (role === 'admin') {
            setAdminsData(prev => prev.map((user, idx) => idx === index ? { ...user, [field]: value } : user));
        } else if (role === 'user') {
            setUsersData(prev => prev.map((user, idx) => idx === index ? { ...user, [field]: value } : user));
        }
    };

    return (
        <div style={{ padding: '10px 20px' }}>
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
                        {managersData.map((row, index) => renderRow(row, index, 'manager'))}
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
                        {adminsData.map((row, index) => renderRow(row, index, 'admin'))}
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
                        {usersData.map((row, index) => renderRow(row, index, 'user'))}
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

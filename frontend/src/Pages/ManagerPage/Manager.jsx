import React, { useEffect, useState } from 'react';
import { fetchManagerData, updateManagerData } from '../../api/userApi';
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
import Button from '@mui/material/Button';
import { Snackbar, Alert } from '@mui/material';
import Swal from 'sweetalert2';
import ManagerModal from './ManagerModal';
import { deleteDepartment } from '../../api/api';

function Manager() {
    const user = useSelector(selectAuthUser);
    const [phoneNumbers, setPhoneNumbers] = useState([]);
    const [originalData, setOriginalData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [selectedManagerId, setSelectedManagerId] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isManagerModalOpen, setIsManagerModalOpen] = useState(false);
    const [selectedHeader, setSelectedHeader] = useState(null)
    const [editingHeader, setEditingHeader] = useState(null);
    const [editingSubHeader, setEditingSubHeader] = useState(null);
    const [previousHeader,setPreviousHeader] = useState(null)
    useEffect(() => {
        const fetchData = async () => {
            try {
                if (user) {
                    const data = await fetchManagerData(user.id);

                    const sortedData = data.phoneNumbers.sort((a, b) => {
                        if (!a.vnutr_podrazdel && !a.vnutr_podrazdel_podrazdel) return -1;
                        if (!b.vnutr_podrazdel && !b.vnutr_podrazdel_podrazdel) return 1;
                        return 0;
                    });

                    setPhoneNumbers(sortedData);
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

    const handleRowClick = async (id) => {
        if (isEditing && selectedManagerId !== id) {
            const result = await Swal.fire({
                title: 'Вы находитесь в режиме редактирования',
                text: 'Хотите сохранить изменения?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Сохранить',
                cancelButtonText: 'Отменить',
            });

            if (result.isConfirmed) {
                await handleSave();
            } else {
                setPhoneNumbers((prevPhoneNumbers) => {
                    return prevPhoneNumbers.map(row =>
                        row.id === selectedManagerId ? originalData : row
                    );
                });
            }
        }

        const selectedRow = phoneNumbers.find(row => row.id === id);
        setSelectedManagerId(id);
        setOriginalData({ ...selectedRow });
        setIsEditing(false);
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleDepEdit = (text) => {
        setEditingHeader(true)
        setPreviousHeader(text)
    }

    const handleSubDepEdit = (text) => {
        setEditingSubHeader(true)
        setPreviousHeader(text)
    }

    const handleSave = async () => {
        const updatedData = phoneNumbers.map(row =>
            row.id === selectedManagerId ? { ...row } : row
        );
        const selectedData = updatedData.find(row => row.id === selectedManagerId);
        const id = selectedData.id;

        try {
            await updateManagerData(id, selectedData);
            setPhoneNumbers(updatedData);
            setSnackbarMessage('Изменения сохранены');
            setSnackbarOpen(true);
        } catch (error) {
            console.error('Error saving data:', error);
            setSnackbarMessage('Ошибка при сохранении данных');
            setSnackbarOpen(true);
        } finally {
            setIsEditing(false);
        }
    };

    const saveChanges = async () => {
        try {
            if (editingHeader) {
                await updateDepartmentName({
                    columnName: 'vnutr_podrazdel',
                    oldValue: editingHeader,
                    newValue: phoneNumbers.find(row => row.vnutr_podrazdel === editingHeader).vnutr_podrazdel
                });
                setEditingHeader(null);
            }
            if (editingSubHeader) {
                await updateDepartmentName({
                    columnName: 'vnutr_podrazdel_podrazdel',
                    oldValue: editingSubHeader,
                    newValue: phoneNumbers.find(row => row.vnutr_podrazdel_podrazdel === editingSubHeader).vnutr_podrazdel_podrazdel
                });
                setEditingSubHeader(null);
            }
            setSnackbarMessage('Изменения сохранены');
            setSnackbarOpen(true);
        } catch (error) {
            console.error('Error saving changes:', error);
            setSnackbarMessage('Ошибка при сохранении данных');
            setSnackbarOpen(true);
        }
    };

    const handleDelete = async () => {
        Swal.fire({
            title: "Вы уверены?",
            text: "Это действие нельзя будет отменить!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: 'Удалить',
            cancelButtonText: 'Отменить',
        }).then(async (result) => {
            if (result.isConfirmed) {
                const updatedData = phoneNumbers.map(row =>
                    row.id === selectedManagerId ? { ...row } : row
                );
                const selectedData = updatedData.find(row => row.id === selectedManagerId);
                const id = selectedData.id;

                try {
                    await deleteDepartment(id);
                    setSnackbarMessage('Успешно удалено');
                    setSelectedManagerId(null);
                    setSnackbarOpen(true);
                    window.location.reload();
                } catch (error) {
                    console.error('Error saving data:', error);
                    setSnackbarMessage('Ошибка при сохранении данных');
                    setSnackbarOpen(true);
                }
            } else {
                setSnackbarMessage('Удаление отменено');
                setSnackbarOpen(true);
            }
        });
    };

    const handleInputChange = (e, field) => {
        const { value } = e.target;
        setPhoneNumbers(prevPhoneNumbers =>
            prevPhoneNumbers.map(row =>
                row.id === selectedManagerId
                    ? { ...row, [field]: value }
                    : row
            )
        );
    };

    const renderTableBody = () => {
        const groupedData = phoneNumbers.reduce((acc, row) => {
            const { vnutr_podrazdel, vnutr_podrazdel_podrazdel } = row;

            if (!vnutr_podrazdel) {
                acc.noPodrazdel.push(row);
            } else if (!vnutr_podrazdel_podrazdel) {
                if (!acc.podrazdel[vnutr_podrazdel]) {
                    acc.podrazdel[vnutr_podrazdel] = { noSubPodrazdel: [], subPodrazdel: {} };
                }
                acc.podrazdel[vnutr_podrazdel].noSubPodrazdel.push(row);
            } else {
                if (!acc.podrazdel[vnutr_podrazdel]) {
                    acc.podrazdel[vnutr_podrazdel] = { noSubPodrazdel: [], subPodrazdel: {} };
                }
                if (!acc.podrazdel[vnutr_podrazdel].subPodrazdel[vnutr_podrazdel_podrazdel]) {
                    acc.podrazdel[vnutr_podrazdel].subPodrazdel[vnutr_podrazdel_podrazdel] = [];
                }
                acc.podrazdel[vnutr_podrazdel].subPodrazdel[vnutr_podrazdel_podrazdel].push(row);
            }

            return acc;
        }, { noPodrazdel: [], podrazdel: {} });

        const handleHeaderClick = (key) => {
            if (isEditing) {
                Swal.fire({
                    title: 'Вы находитесь в режиме редактирования',
                    text: 'Хотите сохранить изменения?',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Сохранить',
                    cancelButtonText: 'Отменить',
                }).then(async (result) => {
                    if (result.isConfirmed) {
                        await handleSave();
                    } else {
                        setPhoneNumbers(prevPhoneNumbers => prevPhoneNumbers.map(row =>
                            row.id === selectedManagerId ? originalData : row
                        ));
                    }
                    resetEditingState();
                });
            } else {
                if ((editingHeader || editingSubHeader) && (selectedHeader!==key)) {
                    Swal.fire({
                        title: 'Вы находитесь в режиме редактирования',
                        text: 'Хотите сохранить изменения?',
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonText: 'Сохранить',
                        cancelButtonText: 'Отменить',
                    }).then(async (result) => {
                        if (result.isConfirmed) {
                        } else {
                            resetEditingState();
                        }
                        setSelectedHeader(key);
                    });
                } else {
                    setSelectedHeader(key);
                }
            }
        };
        
        const resetEditingState = () => {
            setEditingHeader(false);
            setEditingSubHeader(false);
            setSelectedHeader(null);
            setOriginalData({});
            setIsEditing(false);
            setPreviousHeader(null)
        };

        const renderRows = (data) => {
            return data.map(row => {
                const isSelected = selectedManagerId === row.id;

                return (
                    <React.Fragment key={row.id}>
                        <TableRow
                            sx={{ '&:last-child td, &:last-child th': { border: 0 }, backgroundColor: isSelected ? '#f5f5f5' : 'inherit' }}
                            onClick={(e) => {
                                if (!e.target.closest('input')) {
                                    handleRowClick(row.id);
                                }
                            }}
                        >
                            <TableCell>{isSelected && isEditing ? (
                                <input
                                    type="text"
                                    value={row.doljnost}
                                    onChange={(e) => handleInputChange(e, 'doljnost')}
                                />
                            ) : row.doljnost || '-'}</TableCell>
                            <TableCell>{isSelected && isEditing ? (
                                <input
                                    type="text"
                                    value={row.phone}
                                    onChange={(e) => handleInputChange(e, 'phone')}
                                />
                            ) : row.phone || '-'}</TableCell>
                            <TableCell>{isSelected && isEditing ? (
                                <input
                                    type="text"
                                    value={row.home_phone}
                                    onChange={(e) => handleInputChange(e, 'home_phone')}
                                />
                            ) : row.home_phone || '-'}</TableCell>
                            <TableCell>{isSelected && isEditing ? (
                                <input
                                    type="text"
                                    value={row.mobile_phone}
                                    onChange={(e) => handleInputChange(e, 'mobile_phone')}
                                />
                            ) : row.mobile_phone || '-'}</TableCell>
                            <TableCell>{isSelected && isEditing ? (
                                <input
                                    type="text"
                                    value={row.fio}
                                    onChange={(e) => handleInputChange(e, 'fio')}
                                />
                            ) : row.fio || '-'}</TableCell>
                        </TableRow>
                        {isSelected && (
                            <TableRow>
                                <TableCell colSpan={5}>
                                    <div className="buttons_container">
                                        {!isEditing ? (
                                            <>
                                                <Button onClick={handleEdit} className="manager_edit_button">Изменить</Button>
                                                <Button className="manager_delete_button" onClick={handleDelete}>Удалить</Button>
                                            </>
                                        ) : (
                                            <>
                                                <Button onClick={handleSave} className="manager_save_button">Сохранить</Button>
                                                <Button onClick={() => {
                                                    setPhoneNumbers(prevPhoneNumbers =>
                                                        prevPhoneNumbers.map(row =>
                                                            row.id === selectedManagerId ? originalData : row
                                                        )
                                                    );
                                                    setIsEditing(false);
                                                }} className="manager_cancel_button">Отменить</Button>
                                            </>
                                        )}
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </React.Fragment>
                );
            });
        };
        return (
            <>
                {groupedData.noPodrazdel.length > 0 && (
                    <>
                        {renderRows(groupedData.noPodrazdel)}
                    </>
                )}
                {Object.keys(groupedData.podrazdel).map((podrazdelKey, index) => (
                    <React.Fragment key={index}>
                        <TableRow
                            onClick={() => handleHeaderClick(podrazdelKey, true)}
                            style={{ cursor: 'pointer' }}
                        >
                            <TableCell colSpan={5} style={{ backgroundColor: '#f0f0f0', fontWeight: 'bold' }}>
                                {podrazdelKey}
                                {podrazdelKey === selectedHeader &&
                                    <div className="buttons_container">
                                        {!editingHeader ? (
                                            <>
                                                <Button className="manager_edit_button" onClick={() => handleDepEdit(podrazdelKey)}>Изменить</Button>
                                                <Button className="manager_delete_button">Удалить</Button>
                                            </>
                                        ) : (
                                            <>
                                                <Button className="manager_save_button">Сохранить</Button>
                                                <Button className="manager_cancel_button">Отменить</Button>
                                            </>
                                        )}
                                    </div>
                                }
                            </TableCell>
                        </TableRow>
                        {groupedData.podrazdel[podrazdelKey].noSubPodrazdel.length > 0 && (
                            <>
                                {renderRows(groupedData.podrazdel[podrazdelKey].noSubPodrazdel)}
                            </>
                        )}
                        {Object.keys(groupedData.podrazdel[podrazdelKey].subPodrazdel).map((subPodrazdelKey, subIndex) => (
                            <React.Fragment key={subIndex}>
                                <TableRow
                                    onClick={() => handleHeaderClick(subPodrazdelKey, true)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <TableCell colSpan={5} style={{ paddingLeft: '20px', fontWeight: 'bold' }}>
                                        {subPodrazdelKey}
                                        {subPodrazdelKey === selectedHeader &&
                                            <div className="buttons_container">
                                                {!editingSubHeader ? (
                                                    <>
                                                        <Button className="manager_edit_button" onClick={() => handleSubDepEdit(subPodrazdelKey)}>Изменить</Button>
                                                        <Button className="manager_delete_button">Удалить</Button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Button className="manager_save_button">Сохранить</Button>
                                                        <Button className="manager_cancel_button">Отменить</Button>
                                                    </>
                                                )}
                                            </div>
                                        }
                                    </TableCell>
                                </TableRow>
                                {renderRows(groupedData.podrazdel[podrazdelKey].subPodrazdel[subPodrazdelKey])}
                            </React.Fragment>
                        ))}
                    </React.Fragment>
                ))}
            </>
        );
    };

    const openManagerModal = () => {
        setIsManagerModalOpen(true);
    }

    const closeManagerModal = () => {
        setIsManagerModalOpen(false);
    }

    return (
        <div style={{ padding: '10px 20px' }}>
            {loading ? (
                <p>Загрузка...</p>
            ) : (
                <div>
                    <div className='manager_header_container'>
                        <h2>{user.department}</h2>
                        <Button className='manager_add_podradel_button' onClick={openManagerModal}>Добавить</Button>
                    </div>
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
                                {renderTableBody()}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            )}

            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={() => setSnackbarOpen(false)}>
                <Alert onClose={() => setSnackbarOpen(false)} severity="success">
                    {snackbarMessage}
                </Alert>
            </Snackbar>
            {isManagerModalOpen && <ManagerModal closeModal={closeManagerModal} phoneNumbers={phoneNumbers} />}
        </div>
    );
}

export default Manager;

import React, { useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import '../../Styles/PhoneData.css';
import { selectAuthUser } from '../../redux/authSlice';
import { useSelector } from 'react-redux';
import { Button, TextField } from '@mui/material';

function PhoneData({ tableData }) {
    const [selectedRow, setSelectedRow] = useState(null);
    const [editState, setEditState] = useState(null);

    const handleRowClick = (index) => {
        if (!editState) {
            setSelectedRow(index === selectedRow ? null : index);
            setEditState(null);
        }
    };

    const handleEditClick = (index) => {
        setEditState({ ...tableData[index] });
    };

    const handleSaveClick = () => {
        console.log('Сохранить изменения', editState);

        setEditState(null);
    };

    const handleCancelClick = () => {
        setEditState(null);
    };

    const handleInputChange = (e, field) => {
        setEditState((prevState) => ({
            ...prevState,
            [field]: e.target.value,
        }));
    };

    const user = useSelector(selectAuthUser);

    return (
        <div>
            <TableContainer component={Paper}>
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Должность</TableCell>
                            <TableCell>Внутренний номер</TableCell>
                            <TableCell>Городской номер</TableCell>
                            <TableCell>Корпоративный номер</TableCell>
                            <TableCell>ФИО</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {tableData.map((row, index) => (
                            <React.Fragment key={index}>
                                <TableRow
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    onClick={() => handleRowClick(index)}
                                    selected={selectedRow === index}
                                >
                                    <TableCell component="th" scope="row">
                                        {editState && selectedRow === index ? (
                                            <TextField
                                                value={editState.doljnost}
                                                onChange={(e) => handleInputChange(e, 'doljnost')}
                                                size="small"
                                            />
                                        ) : (
                                            row.doljnost
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {editState && selectedRow === index ? (
                                            <TextField
                                                value={editState.phone}
                                                onChange={(e) => handleInputChange(e, 'phone')}
                                                size="small"
                                            />
                                        ) : (
                                            row.phone || '-'
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {editState && selectedRow === index ? (
                                            <TextField
                                                value={editState.home_phone}
                                                onChange={(e) => handleInputChange(e, 'home_phone')}
                                                size="small"
                                            />
                                        ) : (
                                            row.home_phone || '-'
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {editState && selectedRow === index ? (
                                            <TextField
                                                value={editState.mobile_phone}
                                                onChange={(e) => handleInputChange(e, 'mobile_phone')}
                                                size="small"
                                            />
                                        ) : (
                                            row.mobile_phone || '-'
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {editState && selectedRow === index ? (
                                            <TextField
                                                value={editState.fio}
                                                onChange={(e) => handleInputChange(e, 'fio')}
                                                size="small"
                                            />
                                        ) : (
                                            row.fio || '-'
                                        )}
                                    </TableCell>
                                </TableRow>
                                {user.role === 'admin' && selectedRow === index && (
                                    <TableRow>
                                        <TableCell colSpan={5} align="left">
                                            <div className="button_group">
                                                {editState ? (
                                                    <>
                                                        <Button
                                                            variant="contained"
                                                            color="primary"
                                                            onClick={handleSaveClick}
                                                        >
                                                            Сохранить
                                                        </Button>
                                                        <Button
                                                            variant="contained"
                                                            color="secondary"
                                                            onClick={handleCancelClick}
                                                        >
                                                            Отменить
                                                        </Button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Button
                                                            variant="contained"
                                                            color="primary"
                                                            onClick={() => handleEditClick(index)}
                                                        >
                                                            Изменить
                                                        </Button>
                                                        <Button
                                                            variant="contained"
                                                            color="primary"
                                                        >
                                                            Удалить
                                                        </Button>
                                                        <Button
                                                            variant="contained"
                                                            color="secondary"
                                                            onClick={handleRowClick}
                                                        >
                                                            Закрыть
                                                        </Button></>
                                                )}

                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </React.Fragment>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}

export default PhoneData;

import React, { useState } from 'react'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import '../../Styles/PhoneData.css'
import { selectAuthUser } from '../../redux/authSlice';
import { useSelector } from 'react-redux';
import { Button } from '@mui/material';

function PhoneData({ tableData }) {

    const [selectedRow, setSelectedRow] = useState(null);

    const handleRowClick = (index) => {
        setSelectedRow(index);
    };

    const handleAddClick = () => {
        console.log('Добавить строку');
    };

    const handleDeleteClick = () => {
        console.log('Удалить строку');
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
                            <TableRow
                                key={index}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                onClick={() => handleRowClick(index)}
                                selected={selectedRow === index}
                            >
                                <TableCell component="th" scope="row">
                                    {row.doljnost}
                                </TableCell>
                                <TableCell>{row.phone || '-'}</TableCell>
                                <TableCell>{row.home_phone || '-'}</TableCell>
                                <TableCell>{row.mobile_phone || '-'}</TableCell>
                                <TableCell>{row.fio || '-'}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            {user.role === 'manager' && selectedRow !== null && (
                <div className="button-group">
                    <Button variant="contained" color="primary" onClick={handleAddClick}>
                        Добавить
                    </Button>
                    <Button variant="contained" color="primary" onClick={handleAddClick}>
                        Изменить
                    </Button>
                    <Button variant="contained" color="secondary" onClick={handleDeleteClick}>
                        Удалить
                    </Button>
                    <Button variant="contained" color="secondary" onClick={handleDeleteClick}>
                        Закрыть
                    </Button>
                </div>
            )}
        </div>
    )
}

export default PhoneData

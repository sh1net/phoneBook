import React, { useState } from 'react';
import PhoneData from './PhoneData';
import '../../Styles/DepartmentData.css';
import { Button, TextField } from '@mui/material';
import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';
import { selectAuthUser } from '../../redux/authSlice';

function DepartmentData({ departmentData, loading }) {
    const [selectedHeader, setSelectedHeader] = useState(null);
    const [editState, setEditState] = useState({});
    const [currentlyEditing, setCurrentlyEditing] = useState(null);
    const user = useSelector(selectAuthUser); // Get the current user from the Redux store

    if (loading) {
        return (
            <div className='spinner_container'>
                <div className="spinner"></div>
            </div>
        );
    }

    if (!departmentData || departmentData.length === 0) {
        return <h2 className="department_nothing_find">Ничего не найдено</h2>;
    }

    const groupByHierarchy = (data) => {
        const result = {};

        data.forEach((item) => {
            const { podrazdel, struct_podrazdel, vnutr_podrazdel, vnutr_podrazdel_podrazdel } = item;

            if (!result[podrazdel]) {
                result[podrazdel] = { children: {} };
            }

            if (struct_podrazdel && struct_podrazdel !== podrazdel) {
                if (!result[podrazdel].children[struct_podrazdel]) {
                    result[podrazdel].children[struct_podrazdel] = { children: {} };
                }

                if (vnutr_podrazdel) {
                    if (!result[podrazdel].children[struct_podrazdel].children[vnutr_podrazdel]) {
                        result[podrazdel].children[struct_podrazdel].children[vnutr_podrazdel] = { children: {} };
                    }

                    if (vnutr_podrazdel_podrazdel) {
                        if (!result[podrazdel].children[struct_podrazdel].children[vnutr_podrazdel].children[vnutr_podrazdel_podrazdel]) {
                            result[podrazdel].children[struct_podrazdel].children[vnutr_podrazdel].children[vnutr_podrazdel_podrazdel] = { children: [] };
                        }
                        result[podrazdel].children[struct_podrazdel].children[vnutr_podrazdel].children[vnutr_podrazdel_podrazdel].children.push(item);
                    } else {
                        if (!Array.isArray(result[podrazdel].children[struct_podrazdel].children[vnutr_podrazdel].children)) {
                            result[podrazdel].children[struct_podrazdel].children[vnutr_podrazdel].children = [];
                        }
                        result[podrazdel].children[struct_podrazdel].children[vnutr_podrazdel].children.push(item);
                    }
                } else {
                    if (!Array.isArray(result[podrazdel].children[struct_podrazdel].children)) {
                        result[podrazdel].children[struct_podrazdel].children = [];
                    }
                    result[podrazdel].children[struct_podrazdel].children.push(item);
                }
            } else {
                if (!Array.isArray(result[podrazdel].children)) {
                    result[podrazdel].children = [];
                }
                result[podrazdel].children.push(item);
            }
        });

        return result;
    };

    const groupedData = groupByHierarchy(departmentData);

    const handleHeaderClick = (key) => {
        if (currentlyEditing && currentlyEditing !== key) {
            Swal.fire({
                title: 'Сохранить изменения?',
                text: "Вы хотите сохранить изменения, прежде чем перейти к другому разделу?",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Сохранить',
                cancelButtonText: 'Отменить изменения',
            }).then((result) => {
                if (result.isConfirmed) {
                    handleSaveClick(currentlyEditing); // Save the current changes
                    setSelectedHeader(key);
                    setCurrentlyEditing(null);
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                    handleCancelClick(currentlyEditing); // Discard the current changes
                    setSelectedHeader(key);
                    setCurrentlyEditing(null);
                }
            });
        } else {
            setSelectedHeader(key === selectedHeader ? null : key); // Toggle the selection
            setCurrentlyEditing(null);
        }
    };

    const handleEditClick = (key) => {
        if (user.role === 'admin') { // Check if the user is an admin
            setEditState((prevState) => ({
                ...prevState,
                [key]: true, // Set edit mode for the selected header
            }));
            setCurrentlyEditing(key); // Track which header is currently being edited
        }
    };

    const handleSaveClick = (key) => {
        // Handle save logic here
        console.log(`Saving changes for ${key}`);
        setEditState((prevState) => ({
            ...prevState,
            [key]: false, // Exit edit mode after saving
        }));
        setCurrentlyEditing(null); // Clear currently editing state
    };

    const handleCancelClick = (key) => {
        setEditState((prevState) => ({
            ...prevState,
            [key]: false, // Exit edit mode without saving
        }));
        setCurrentlyEditing(null); // Clear currently editing state
    };

    const handleInputChange = (e, key) => {
        console.log(`Editing ${key}: ${e.target.value}`);
    };

    const renderHierarchy = (data, depth = 0) => {
        if (!data || Object.keys(data).length === 0) {
            return null;
        }

        return Object.keys(data).map((key) => {
            const item = data[key];
            if (!isNaN(key)) {
                return null;
            }

            const styles = {
                fontSize: `${24 - depth * 2}px`,
                fontWeight: depth === 0 ? 'bold' : 'normal',
                margin: '10px 0',
                cursor: 'pointer',
            };

            const isEditing = editState[key];
            const isSelected = selectedHeader === key;

            return (
                <div key={key}>
                    <div className="data_container">
                        <div className="department_info_add_container">
                            {isEditing ? (
                                <TextField
                                    value={key}
                                    onChange={(e) => handleInputChange(e, key)}
                                    size="small"
                                    variant="outlined"
                                    style={{ fontSize: styles.fontSize }}
                                />
                            ) : (
                                <p style={styles} onClick={() => handleHeaderClick(key)}>
                                    {key}
                                </p>
                            )}
                            {isSelected && !isEditing && user.role === 'admin' && (
                                <div className="button_group">
                                    <Button onClick={() => handleEditClick(key)}>Изменить</Button>
                                    <Button>Добавить</Button>
                                    <Button>Удалить</Button>
                                </div>
                            )}
                            {isEditing && user.role === 'admin' && (
                                <div className="button_group">
                                    <Button onClick={() => handleSaveClick(key)}>Сохранить</Button>
                                    <Button onClick={() => handleCancelClick(key)}>Отменить</Button>
                                </div>
                            )}
                        </div>
                    </div>
                    {Array.isArray(item.children) && item.children.length > 0 && (
                        <PhoneData tableData={item.children} hideHeader={depth > 0} />
                    )}
                    {renderHierarchy(item.children, depth + 1)}
                </div>
            );
        });
    };

    return (
        <div>
            {renderHierarchy(groupedData)}
        </div>
    );
}

export default DepartmentData;

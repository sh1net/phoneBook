import React, { useState, useMemo } from 'react';
import '../../Styles/ManagerModal.css';
import { Button } from '@mui/material';
import { addDepartment } from '../../api/api';

function ManagerModal({ closeModal, phoneNumbers }) {
    const [selectedOption, setSelectedOption] = useState('');
    const [selectedStructDivision, setSelectedStructDivision] = useState('');
    const [selectedInnerDivision, setSelectedInnerDivision] = useState('');
    const [newDivisionName, setNewDivisionName] = useState('');
    const [newInnerDivisionName, setNewInnerDivisionName] = useState('');
    const [formData, setFormData] = useState({
        doljnost: '',
        phone: '',
        home_phone: '',
        mobile_phone: '',
        fio: '',
    });

    // Memoized list of structural divisions
    const structDivisions = useMemo(() => {
        const divisions = phoneNumbers.map(record => record.vnutr_podrazdel).filter(Boolean);
        return [...new Set(divisions)];
    }, [phoneNumbers]);

    // Memoized list of inner divisions based on selected structural division
    const innerDivisions = useMemo(() => {
        if (!selectedStructDivision) return [];
        return phoneNumbers
            .filter(record => record.vnutr_podrazdel === selectedStructDivision)
            .map(record => record.vnutr_podrazdel_podrazdel)
            .filter(Boolean);
    }, [selectedStructDivision, phoneNumbers]);

    // Handles option change and resets dependent states
    const handleOptionChange = (e) => {
        const value = e.target.value;
        setSelectedOption(value);
        setSelectedStructDivision('');
        setSelectedInnerDivision('');
        setNewDivisionName('');
        setNewInnerDivisionName('');
    };

    // Handles changes in the structural division selection
    const handleStructDivisionChange = (e) => {
        setSelectedStructDivision(e.target.value);
        setSelectedInnerDivision('');
        setNewInnerDivisionName(''); // Reset inner division name if structural division changes
    };

    // Handles changes in the inner division selection
    const handleInnerDivisionChange = (e) => {
        setSelectedInnerDivision(e.target.value);
    };

    // Handles changes in new division name
    const handleNewDivisionNameChange = (e) => {
        setNewDivisionName(e.target.value);
    };

    // Handles changes in new inner division name
    const handleNewInnerDivisionNameChange = (e) => {
        setNewInnerDivisionName(e.target.value);
    };

    // Handles input change for general form data
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
    };

    // Submits the form data
    const handleSubmit = async () => {
        const result = {
            podrazdel1: phoneNumbers[0]?.podrazdel || '', // Assuming first level division
            podrazdel2: phoneNumbers[0]?.struct_podrazdel || '', // Assuming second level division
            podrazdel3: selectedStructDivision || newDivisionName || '', // Use either existing or new structural division
            podrazdel4: selectedInnerDivision || newInnerDivisionName || '', // Use either existing or new inner division
            ...formData,
        };

        try {
            const response = await addDepartment(result);
            console.log('Response from server:', response);
            closeModal();
        } catch (error) {
            console.error('Error adding department:', error);
        }
    };

    // Renders entry fields for form data
    const renderEntryFields = () => (
        <div className="entry-fields">
            <input
                type="text"
                name="doljnost"
                placeholder="Должность"
                value={formData.doljnost}
                onChange={handleInputChange}
            />
            <input
                type="text"
                name="phone"
                placeholder="Телефон"
                value={formData.phone}
                onChange={handleInputChange}
            />
            <input
                type="text"
                name="home_phone"
                placeholder="Дом. телефон"
                value={formData.home_phone}
                onChange={handleInputChange}
            />
            <input
                type="text"
                name="mobile_phone"
                placeholder="Моб. телефон"
                value={formData.mobile_phone}
                onChange={handleInputChange}
            />
            <input
                type="text"
                name="fio"
                placeholder="ФИО"
                value={formData.fio}
                onChange={handleInputChange}
            />
        </div>
    );

    return (
        <div className='manager_modal_container'>
            <div className='manager_modal_container_container'>
                <div>
                    <div className='manager_modal_header_container'>
                        <p className='manager_modal_header'>Создание записи</p>
                        <p className='manager_modal_close_button' onClick={closeModal}>&times;</p>
                    </div>
                    <div className='manager_modal_body'>
                        <p>Что вы хотите добавить?</p>
                        <select
                            className='manager_modal_select'
                            value={selectedOption}
                            onChange={handleOptionChange}
                        >
                            <option value="">Выберите тип записи</option>
                            <option value="strukturnoe_podrazdelenie">Новое структурное подразделение</option>
                            <option value="vnutrennee_podrazdelenie">Новое внутреннее подразделение</option>
                            <option value="zapic">Запись</option>
                        </select>

                        {selectedOption === 'strukturnoe_podrazdelenie' && (
                            <>
                                <p>Введите название структурного подразделения</p>
                                <input
                                    type="text"
                                    className='manager_modal_input'
                                    value={newDivisionName}
                                    onChange={handleNewDivisionNameChange}
                                    placeholder="Название структурного подразделения"
                                />
                                <p>Хотите добавить внутреннее подразделение? (опционально)</p>
                                <input
                                    type="text"
                                    className='manager_modal_input'
                                    value={newInnerDivisionName}
                                    onChange={handleNewInnerDivisionNameChange}
                                    placeholder="Название внутреннего подразделения (опционально)"
                                />
                                {renderEntryFields()}
                                <Button
                                    className='manager_modal_submit_button'
                                    onClick={handleSubmit}
                                >
                                    Добавить запись
                                </Button>
                            </>
                        )}

                        {selectedOption === 'vnutrennee_podrazdelenie' && (
                            <>
                                <p>Выберите структурное подразделение</p>
                                <select
                                    className='manager_modal_select'
                                    value={selectedStructDivision}
                                    onChange={handleStructDivisionChange}
                                >
                                    <option value="">Выберите структурное подразделение</option>
                                    {structDivisions.map((division, index) => (
                                        <option key={index} value={division}>{division}</option>
                                    ))}
                                </select>
                                {selectedStructDivision && (
                                    <>
                                        <p>Введите название внутреннего подразделения</p>
                                        <input
                                            type="text"
                                            className='manager_modal_input'
                                            value={newInnerDivisionName}
                                            onChange={handleNewInnerDivisionNameChange}
                                            placeholder="Название внутреннего подразделения"
                                        />
                                    </>
                                )}
                                {renderEntryFields()}
                                <Button
                                    className='manager_modal_submit_button'
                                    onClick={handleSubmit}
                                >
                                    Добавить запись
                                </Button>
                            </>
                        )}

                        {selectedOption === 'zapic' && (
                            <>
                                <p>Выберите структурное подразделение</p>
                                <select
                                    className='manager_modal_select'
                                    value={selectedStructDivision}
                                    onChange={handleStructDivisionChange}
                                >
                                    <option value="">Выберите структурное подразделение (опционально)</option>
                                    {structDivisions.map((division, index) => (
                                        <option key={index} value={division}>{division}</option>
                                    ))}
                                </select>
                                <p>Выберите внутреннее подразделение (опционально)</p>
                                <select
                                    className='manager_modal_select'
                                    value={selectedInnerDivision}
                                    onChange={handleInnerDivisionChange}
                                >
                                    <option value="">Выберите внутреннее подразделение (опционально)</option>
                                    {innerDivisions.map((innerDivision, index) => (
                                        <option key={index} value={innerDivision}>{innerDivision}</option>
                                    ))}
                                </select>
                                {renderEntryFields()}
                                <Button
                                    className='manager_modal_submit_button'
                                    onClick={handleSubmit}
                                >
                                    Добавить запись
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ManagerModal;

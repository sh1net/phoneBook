import React from 'react'
import '../../Styles/DepartmentModal.css'

function CreateDepartmentModal({ closeModal }) {

    return (
        <div className='department_modal_container'>
            <div className='department_modal_container_container'>
                <div className='modal_header_container'>
                    <p className='modal_header'>Создание записи</p>
                    <p className='modal_close_button' onClick={closeModal}>&times;</p>
                </div>
            </div>
        </div>
    )
}

export default CreateDepartmentModal

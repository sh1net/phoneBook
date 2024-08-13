import React from 'react';
import PhoneData from './PhoneData';
import '../../Styles/DepartmentData.css';

function DepartmentData({ departmentData, loading }) {

  if (loading) {
    return <div className='spinner_container'>
       <div className="spinner"></div>
    </div>
  }

  if (!departmentData || departmentData.length === 0) {
    return <h2 className="department_nothing_find">Ничего не найдено</h2>;
  }

  const groupedData = departmentData.reduce((acc, item) => {
    const { otdel, podrazdelenie, vnutr, gor, phone } = item;
    const baseOtdel = otdel.split(' ')[0];
    if (!acc[baseOtdel]) {
      acc[baseOtdel] = {};
    }
    if (!acc[baseOtdel][otdel]) {
      acc[baseOtdel][otdel] = [];
    }
    acc[baseOtdel][otdel].push({ podrazdelenie, vnutr, gor, phone });
    return acc;
  }, {});

  return (
    <div>
      {Object.keys(groupedData).map((baseOtdel, index) => {
        const subDepartments = Object.keys(groupedData[baseOtdel]);
        const mainDepartmentIndex = subDepartments.findIndex(
          subDepartment => subDepartment === baseOtdel
        );
        let mainDepartmentData;
        if (mainDepartmentIndex > -1) {
          mainDepartmentData = groupedData[baseOtdel][baseOtdel];
          subDepartments.splice(mainDepartmentIndex, 1);
        }

        return (
          <div key={index}>
            <div className="data_container">
              <div className="department_info_add_container">
                <p style={{ margin: '0' }}>{baseOtdel}</p>
              </div>
            </div>
            <div style={{ margin: '3px 20px' }}>
              {mainDepartmentData && (
                <div>
                  <PhoneData tableData={mainDepartmentData} />
                </div>
              )}
              {subDepartments.map((subDepartment, subIndex) => {
                const subKey = `${index}-${subIndex}`;
                return (
                  <div key={subKey}>
                    <div className="data_sub_department_container">
                      <div className="department_info_add_container">
                        <p style={{ margin: '0' }}>{subDepartment}</p>
                      </div>
                    </div>
                    <PhoneData tableData={groupedData[baseOtdel][subDepartment]} />
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default DepartmentData;
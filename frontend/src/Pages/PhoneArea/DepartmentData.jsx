import React from 'react';
import PhoneData from './PhoneData';
import '../../Styles/DepartmentData.css';

function DepartmentData({ departmentData, loading }) {
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

            if (struct_podrazdel) {
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

    const renderHierarchy = (data, depth = 0) => {
        if (!data || Object.keys(data).length === 0) {
            return null;
        }

        return Object.keys(data).map((key) => {
            const item = data[key];

            // Skip rendering numeric keys (e.g., 0, 1, 2, 3)
            if (!isNaN(key)) {
                return null;
            }

            // Determine styles based on depth
            const styles = {
                fontSize: `${24 - depth * 2}px`, // Adjust the font size based on depth
                fontWeight: depth === 0 ? 'bold' : 'normal', // Bold for top-level, normal for others
                margin: '10px 0', // Add some margin for spacing
            };

            return (
                <div key={key}>
                    <div className="data_container">
                        <div className="department_info_add_container">
                            <p style={styles}>{key}</p>
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

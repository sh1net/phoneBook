import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import { getPhones, searchData } from '../api/api';
import DepartmentData from './PhoneArea/DepartmentData';
import Admin from './AdminPage/Admin';
import { selectSearchParams } from '../redux/searchSlice';
import { useSelector } from 'react-redux';

function Main() {
  const [departmentData, setDepartmentData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdmin, setShowAdmin] = useState(false);
  const searchedData = useSelector(selectSearchParams);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        let data;
        if (searchedData.trim() === '') {
          data = await getPhones();
        } else {
          data = await searchData(searchedData);
        }
        setDepartmentData(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [searchedData]);

  const showDepartmentData = () => {
    setShowAdmin(false);
  };

  const showAdminData = () => {
    setShowAdmin(true);
  };

  return (
    <div>
      <Navbar onProfileClick={showAdminData} onLogoClick={showDepartmentData} />
      {showAdmin ? (
        <Admin />
      ) : (
        <DepartmentData departmentData={departmentData} loading={loading} />
      )}
    </div>
  );
}

export default Main;

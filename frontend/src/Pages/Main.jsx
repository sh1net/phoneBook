import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import { getPhones, searchData } from '../api/api';
import DepartmentData from './PhoneArea/DepartmentData';
import { selectSearchParams } from '../redux/searchSlice';
import { useSelector } from 'react-redux';

function Main() {
  const [departmentData, setDepartmentData] = useState([]);
  const [loading, setLoading] = useState(true);
  const searchedData = useSelector(selectSearchParams);
  console.log(loading)

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
        setLoading(false)
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [searchedData]); 

  return (
    <div>
      <Navbar />
      <DepartmentData departmentData={departmentData} loading={loading} />
    </div>
  );
}

export default Main;

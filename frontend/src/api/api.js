const API_URL = 'http://localhost:3001/api';

export const getPhones = async () => {
  try {
    const response = await fetch(`${API_URL}/phoneData`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

export const searchData = async (query) => {
  try {
    const response = await fetch(`${API_URL}/search?q=${encodeURIComponent(query)}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

export const login = async (username, password) => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ smma: username, password }),
    });
    const data = await response.json();
    return data;
  } catch (e) {
    return(e.response?.data.message)
  }
};

export const addDepartment = async (departmentData) => {
  try {
    const response = await fetch(`${API_URL}/addDepartment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(departmentData),  // Передача данных подразделения
    });

    if (!response.ok) {
      throw new Error('Failed to add department');
    }

    const data = await response.json();
    return data;
  } catch (e) {
    return e.message || 'An error occurred';
  }
};

export const deleteDepartment = async (departmentId) => {
  try {
      const response = await fetch(`${API_URL}/deleteDepartment/${departmentId}`, {
          method: 'DELETE',
      });
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      return await response.text(); // Assuming the backend sends a text response
  } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
  }
};

export const updateDepartmentName = async (data) => {
  try {
      const response = await fetch(`${API_URL}/editDepartment`, {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
      });
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      return await response.text();
  } catch (error) {
      console.error('Error editing user:', error);
      throw error;
  }
};
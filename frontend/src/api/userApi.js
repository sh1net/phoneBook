const API_URL = 'http://localhost:3001/api';

export const getAuthUsers = async () => {
    try {
        const response = await fetch(`${API_URL}/users`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching auth_users data:', error);
        throw error;
    }
};

export const addUser = async (userData) => {
    try {
        const response = await fetch(`${API_URL}/addUser`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.text(); // Assuming the backend sends a text response
    } catch (error) {
        console.error('Error adding user:', error);
        throw error;
    }
};

export const editUser = async (userId, userData) => {
    try {
        const response = await fetch(`${API_URL}/editUser/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.text(); // Assuming the backend sends a text response
    } catch (error) {
        console.error('Error editing user:', error);
        throw error;
    }
};

export const deleteUser = async (userId) => {
    try {
        const response = await fetch(`${API_URL}/deleteUser/${userId}`, {
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

export const validateUser = async (userId) => {
    try {
        const response = await fetch(`${API_URL}/validateUser/${userId}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

export const fetchManagerData = async (userId) => {
    try {
        const response = await fetch(`${API_URL}/managerDepartment/${userId}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching manager data:', error);
    }
};

export const updateManagerData = async (id, data) => {
    try {
        const response = await fetch(`${API_URL}/editDepartment/${id}`, {
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
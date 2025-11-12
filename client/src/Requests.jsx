const API_BASE_URL = '/api';

export const createRecord = async (tableName, newData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/tables/${tableName}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newData),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || `Failed to create record in ${tableName}`);
        }

        console.log(`Success: Created record with ID ${data.insertId}`);
        return data;
    } catch (error) {
        console.error("Error in createRecord:", error);
        throw error;
    }
};

export const deleteRecord = async (tableName, pkColumn, pkValue) => {
    try {
        const response = await fetch(`${API_BASE_URL}/tables/${tableName}/${pkColumn}/${pkValue}`, {
            method: 'DELETE',
        });
        
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || `Failed to delete record ID ${pkValue}`);
        }
        
        console.log(`Success: Deleted ${data.affectedRows} record(s)`);
        return data;
    } catch (error) {
        console.error("Error in deleteRecord:", error);
        throw error;
    }
};

export const updateRecord = async (tableName, pkColumn, pkValue, updatedData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/tables/${tableName}/${pkColumn}/${pkValue}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedData),
        });

        const data = await response.json()

        if (!response.ok) {
            throw new Error(data.error || `Failed to update record ${pkValue}`)
        }
        return data;
    } catch (error) {
        console.error("Error in updateRecord:", error)
        throw error;
    }
};
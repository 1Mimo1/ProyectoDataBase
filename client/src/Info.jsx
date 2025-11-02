import React, {useState, useEffect} from "react";
import { useNavigate} from 'react-router-dom'
import './Info.css'
import { createRecord, deleteRecord, updateRecord } from "./Requests";
const  Info = ({username} ) => {
    const navigate = useNavigate()
    const [serverData, setServerData] = useState([])
    const [selectedTable, setSelectedTable] = useState('')
    const [selectedTableData, setSelectedTableData] = useState([])

    const [isCreating, setIsCreating] = useState(false);
    const [creatableColumns, setCreatableColumns] = useState([]);
    const [newRecordData, setNewRecordData] = useState({});

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const urlOfData = 'http://18.191.193.151:5000/api'


    const [isUpdating, setIsUpdating] = useState(false); 
    const [recordToUpdate, setRecordToUpdate] = useState(null);

    const handleTableChange = (event) => {
        setSelectedTable(event.target.value);
    }
    const handleNavigateToQuery = (querySelected) => {
    navigate('/query', {state: {querySelected}});
    };
    const fetchTableData = async (tableToFetch) => {
        setLoading(true);
        try {
            let urlOfTable = `${urlOfData}/tables/${tableToFetch}`
            const response = await fetch(urlOfTable)
            const data = await response.json()
            if(!response.ok) throw new Error("Failed to fetch table data")
            
            setSelectedTableData(data.info);
            
            if (data.info.length > 0) {
                const allKeys = Object.keys(data.info[0]);
                const createKeys = allKeys.filter(key => key.toLowerCase() !== 'id'); 
                setCreatableColumns(createKeys);

                const initialData = createKeys.reduce((acc, column) => {
                    acc[column] = ''; 
                    return acc;
                }, {});
                setNewRecordData(initialData);
            } else {
                 setCreatableColumns([]); 
            }
            setError(null);
        }catch (error) {
            console.error("Fetch Data Error:", error);
            setError(error.message);
            setSelectedTableData([]);
        } finally {
            setLoading(false);
        }
    }
    useEffect(()=>{
        if(selectedTable){
            fetchTableData(selectedTable); 
        }
    },[selectedTable])
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewRecordData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };
    const handleCreateSubmit = async (e) => {
        e.preventDefault();
        try {
            await createRecord(selectedTable, newRecordData);
            alert(`Record created successfully in ${selectedTable}!`);
            setIsCreating(false);
            fetchTableData(selectedTable); 
        } catch (err) {
            alert(`Creation Failed: ${err.message}`);
        }
    };
    const handleDelete = async () => {
        if (selectedTableData.length === 0) {
            return alert("No data available to delete.");
        }
        const primaryKeyColumn = Object.keys(selectedTableData[0])[0];
        const recordIdToDelete = prompt(`Enter the value of the **${primaryKeyColumn}** to delete from ${selectedTable}:`);
        
        if (!recordIdToDelete) return; 

        if (!window.confirm(`Are you sure you want to delete record with ${primaryKeyColumn} **${recordIdToDelete}** from table ${selectedTable}? This action cannot be undone.`)) {
            return;
        }

        try {
            await deleteRecord(selectedTable, primaryKeyColumn, recordIdToDelete);
            alert(`Successfully deleted record ${recordIdToDelete}!`);
            fetchTableData(selectedTable); 
        } catch (err) {
            alert(`Deletion Failed: ${err.message}`);
        }
    }
    const handleUpdate = async () => {
    if (selectedTableData.length === 0) {
        return alert("No data available to update.");
    }

    const primaryKeyColumn = Object.keys(selectedTableData[0])[0];

    const recordIdToUpdate = prompt(`Enter the value of the **${primaryKeyColumn}** for the record you wish to update in ${selectedTable}:`);

    if (!recordIdToUpdate) return; 

    const originalRecord = selectedTableData.find(record => String(record[primaryKeyColumn]) === recordIdToUpdate);

    if (!originalRecord) {
        return alert(`Record with ${primaryKeyColumn} ${recordIdToUpdate} not found.`);
    }

    setRecordToUpdate(originalRecord);
    setNewRecordData(originalRecord); 
    setIsUpdating(true);
};

const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    const primaryKeyColumn = Object.keys(recordToUpdate)[0];
    const recordId = recordToUpdate[primaryKeyColumn];

    const dataToSend = { ...newRecordData };
    delete dataToSend[primaryKeyColumn];

    try {
        await updateRecord(selectedTable, primaryKeyColumn, recordId, dataToSend);
        alert(`Record updated successfully: ${primaryKeyColumn} ${recordId}!`);
        setIsUpdating(false); 
        fetchTableData(selectedTable); 
    } catch (err) {
        alert(`Update Failed: ${err.message}`);
    }
};

    useEffect(()=>{
        const fetchTables = async () => {
            try {
               const response = await fetch (`${urlOfData}/tables`) 
               if(!response.ok){
                 throw new Error('Error buscando', response.status)
               }
               const tables = await response.json()
               const tablesArr = tables.tables

               if(tablesArr && tablesArr.length > 0){
                    setServerData(tablesArr)
                    setSelectedTable(tablesArr[0])
               }else(
                    setError("Error loading tables")
               )
            } catch (error) {
                console.error("Error", error)
                setServerData([])
                setError(error.message)
            }finally{
                setLoading(false)
            }
        }
        fetchTables()
    }, [])
    if(loading){
        return <h1>Info Loading</h1>
    }
    if(error){
        return <h1>Error Loading {error}</h1>
    }
    if (isCreating) {
    return (
        <div className="create_modal_container"> 
            <h3>Crear Nuevo Registro en: {selectedTable}</h3>
            <form onSubmit={handleCreateSubmit}>
              
                {creatableColumns.map((columnName) => (
                    <div key={columnName} className="form-group">
                        <label htmlFor={columnName}>
                            **{columnName.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}**:
                        </label>
                        <input
                            id={columnName}
                            name={columnName}
                            type="text"
                            value={newRecordData[columnName] || ''}
                            onChange={handleInputChange}
                        />
                    </div>
                ))}
                <div className="form-actions">
                    <button type="submit" className="buttons create_btn">Submit</button>
                    <button type="button" onClick={() => setIsCreating(false)} className="buttons delete_btn">Cancel</button>
                </div>
            </form>
        </div>
    );
    }   
if (isUpdating) {
    const primaryKeyColumn = Object.keys(recordToUpdate)[0];
    const primaryKeyValue = recordToUpdate[primaryKeyColumn];

    return (
        <div className="create_modal_container"> 
            <h3>Actualizar Registro en: {selectedTable}</h3>
            <p>Updating record: **{primaryKeyColumn} {primaryKeyValue}**</p>
            <form onSubmit={handleUpdateSubmit}> 
                {Object.keys(newRecordData).map((columnName) => (
                    <div key={columnName} className="form-group">
                        <label htmlFor={columnName}>
                            **{columnName.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}**:
                        </label>
                        <input
                            id={columnName}
                            name={columnName}
                            type="text"
                            readOnly={columnName === primaryKeyColumn}
                            value={newRecordData[columnName] || ''}
                            onChange={handleInputChange}
                        />
                    </div>
                ))}
                <div className="form-actions">
                    <button type="submit" className="buttons update_btn">Save Changes</button>
                    <button type="button" onClick={() => setIsUpdating(false)} className="buttons delete_btn">Cancel</button>
                </div>
            </form>
        </div>
    );
}
    return(
        <>
            <div className="title_container">
                <h1>Welcome {username}</h1>
                <h2>Displaying: <span className="h2_p"> {selectedTable}</span></h2>
            </div>
            <div className="divisor">
                <div className="global_container">
                    <div className="select_div">
                        <p className="p_select">Select Table . . . </p>
                        <select value={selectedTable} onChange={handleTableChange} className="TableSelect" id={selectedTable}>
                            {serverData.map((t)=> (
                                <option className="option"value={t} key={t}>
                                    {t}
                                </option>
                            ))}
                        </select>     
                    </div>
                    <div className="button_div">
                        <button className="buttons create_btn" onClick={() => setIsCreating(true)}>
                            Crear
                        </button>
                        <button className="buttons update_btn" onClick={handleUpdate}>
                            Actualizar
                        </button>
                        <button className="buttons delete_btn" onClick={handleDelete}>
                            Eliminar
                        </button>
                    </div>
                    <div className="button_div">
                        <button className="buttons1" onClick={() => handleNavigateToQuery(1)}>
                            Buscar Por Titulo
                        </button>
                        <button className="buttons1" onClick={() => handleNavigateToQuery(2)}>
                            Buscar Por Puesto
                        </button>
                        <button className="buttons1" onClick={() => handleNavigateToQuery(3)}>
                            Buscar Por Sala
                        </button>
                        <button className="buttons1" onClick={() => handleNavigateToQuery(4)}>
                            Detalle Personal de Sala
                        </button>
                        <button className="buttons1" onClick={() => handleNavigateToQuery(5)}>
                            Pacientes Ambulatorios
                        </button>
                        <button className="buttons1" onClick={() => handleNavigateToQuery(6)}>
                            Salas Especificas
                        </button>
                        <button className="buttons1" onClick={() => handleNavigateToQuery(7)}>
                            Pacientes Por Fecha
                        </button>
                        <button className="buttons1" onClick={() => handleNavigateToQuery(8)}>
                            Medicacion Detallada
                        </button>
                    </div>
                </div>     
                <div className="info_display">
                    <div className="display_div">
                        {selectedTableData.length > 0 ? (
                            <>
                            <div className="data_keys">
                                {Object.keys(selectedTableData[0]).map((key, ind) => (
                                    <p key={ind} className="single_key">
                                        {key}
                                    </p>
                                ))}
                            </div>
                        {selectedTableData.map((t, index)=> (
                            <div className="data_div" key={index}>
                                {Object.values(t).map((data, i) => (
                                    <div className="data_cont" key={i}>
                                        <p key={i} className="single_data">
                                            {data}
                                        </p>
                                    </div>
                                ))}
                            </div>
                            ))}
                        </>
                        ):(
                            <h3>No data found</h3>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Info
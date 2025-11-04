const mysql = require('mysql2/promise')
const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors') //ESTO RESUELVE LO DE PODER VER INFO (PERMISOSSS)
//const path = require('path')
const allowedOrigins = ['https://databaseproje.netlify.app'];
dotenv.config({ path: 'server.env' }); 
const app = express();
const PORT = process.env.PORT || 5000;

const config = {
    host: process.env.RDS_ENDPOINT,         
    user: process.env.RDS_USER,            
    password: process.env.RDS_PASSWORD,     
    database: process.env.RDS_DATABASE,     
    port: process.env.RDS_PORT,                             
    waitForConnections: true,
    connectionLimit: 2,
    queueLimit: 0
};

let pool;
async function initializeDatabase () {
    try {
        pool = await mysql.createPool(config)
        console.log("Connected!")
        return pool
    } catch (error) {
        console.log("Nope!", error.message)
    }
}
app.use(cors({origin: allowedOrigins}))
app.use(express.json())
app.get('/', (req, res) => {
    res.status(200).json({status: "API"});
});
const backendTrialsSJJSJSJ =  {
    message: "si se vio"
}
app.get('/tables', async (req, res) => {
    //res.json(backendTrialsSJJSJSJ)
    try {
        const sql = `
            SELECT 
                table_name 
            FROM 
                information_schema.tables 
            WHERE 
                table_schema = '${process.env.RDS_DATABASE}'
        `
        const [rows] = await pool.query(sql); 
        let tableNames = rows.map(row => row.TABLE_NAME)
        res.status(200).json({
            tables: tableNames
        })
        console.log(tableNames)
    } catch (err) {
        console.error("Error", err);
    }
});
const savedQueries = {
    '1': `Select Personal.Nombres, Personal.Apellidos, Titulos.Titulo, Instituciones.Institucion
        from Personal
        join Detalle_academico on Personal.No_de_personal = Detalle_academico.No_de_personal
        join Instituciones on Detalle_academico.Cod_institucion = Instituciones.Cod_institucion
        join Titulos on Instituciones.Cod_titulo = Titulos.Cod_titulo;`,
    '2': `Select Personal.Nombres, Personal.Apellidos, Organizaciones.Organizacion, Puestos.Puesto
        from Personal
        join Detalle_experiencia on Personal.No_de_personal = Detalle_experiencia.No_de_personal
        join Organizaciones on Detalle_experiencia.Cod_organizacion = Organizaciones.Cod_organizacion
        join Puestos on Detalle_experiencia.Cod_puesto = Puestos.Cod_puesto;`,
    '3': `select Sala.No_de_sala, Sala.Nombre_de_sala, Personal.*
        from Personal
        join Detalle_de_personal on Personal.No_de_personal = Detalle_de_personal.No_de_personal
        join Sala on Detalle_de_personal.No_de_sala = Sala.No_de_sala;`,
    '4': `select Paciente.Nombre, Paciente.Apellido, Sala.No_de_sala, Sala.Nombre_de_sala, Clinica.descripcion
        from Paciente
        join Detalle_pacientes_sala on Paciente.No_de_paciente = Detalle_pacientes_sala.No_de_paciente
        join Sala on Detalle_pacientes_sala.No_de_sala = Sala.No_de_sala
        join Clinica on Sala.Tip_clinica = Clinica.Tip_clinica
        where Clinica.descripcion = 'A';`,
    '5': `select Sala.No_de_sala, Paciente.*
        from Paciente
        join Detalle_pacientes_sala on Paciente.No_de_paciente = Detalle_pacientes_sala.No_de_paciente
        join Sala on Detalle_pacientes_sala.No_de_sala = Sala.No_de_sala
        where Sala.No_de_sala = 106;`,
    '6': `select Sala.No_de_sala, Paciente.*
        from Paciente
        join Detalle_pacientes_sala on Paciente.No_de_paciente = Detalle_pacientes_sala.No_de_paciente
        join Sala on Detalle_pacientes_sala.No_de_sala = Sala.No_de_sala
        where Detalle_pacientes_sala.En_lista_de_espera = '2022-03-26';`,
    '7': `Select Paciente.Nombre, Paciente.Apellido, Medicamento.Nombre as Nombre_de_medicamento, 
        Detalle_dosis.Dosis, Detalle_dosis.Metodo_de_administracion, Detalle_dosis.Unidades_por_dia, 
        Detalle_dosis.Fecha_comienzo, Detalle_dosis.Fecha_finalizar
        from Paciente
        join Detalle_dosis on Paciente.No_de_paciente = Detalle_dosis.No_de_paciente
        join Medicamento on Detalle_dosis.No_de_droga = Medicamento.No_de_droga
        where Paciente.No_de_paciente = 'P00011';`, 
    '8': `select Sala.No_de_sala, Suministros.*
        from Sala
        join Detalle_de_personal on Sala.No_de_sala = Detalle_de_personal.No_de_sala
        join Personal on Detalle_de_personal.No_de_personal = Personal.No_de_personal
        join Detalle_suministros on Personal.No_de_personal = Detalle_suministros.No_de_personal
        join Suministros on Detalle_suministros.ID_suministro = Suministros.ID_suministro
        where Sala.No_de_sala = 109;` ,
    '9':`select Paciente.*, Parentescos.*
            from Paciente
            join Detalle_parentesco on Paciente.No_de_paciente = Detalle_parentesco.No_de_paciente
            join Parentescos on Detalle_parentesco.Cod_parentesco = Parentescos.Cod_parentesco
            where Paciente.Nombre = 'Ivan'`,
    '10':`select Paciente.Nombre, Detalle_dosis.*
        from Paciente
        join Detalle_dosis on Paciente.No_de_paciente = Detalle_dosis.No_de_paciente
        where Detalle_dosis.No_de_paciente = 'P02127'`,
    '11': `select Paciente.*, Medico.*
        from Paciente
        join Detalle_medico_local on Paciente.No_de_paciente = Detalle_medico_local.No_de_paciente
        join Medico on Detalle_medico_local.Cod_medico = Medico.Cod_medico
        where Paciente.Nombre = 'Ivan'`,
    '12':`Select Personal.*, Sala.*
        from Personal
        join Detalle_de_personal on Personal.No_de_personal = Detalle_de_personal.No_de_personal
        join Sala on Detalle_de_personal.No_de_sala = Sala.No_de_sala
        where Personal.No_de_personal = 'P106'` 
};
app.get(`/query/:queryInserted`, async( req, res) => {
    const queryId = req.params.queryInserted
    const sql = savedQueries[queryId]
    if(!sql){
        return res.status(404).json({error: 'Nothing'})
    }
    try {
        const[rows] = await pool.query(sql)
        res.status(200).json({
            queryId: queryId,
            info: rows
        })
    } catch (error) {
        res.status(500).json({error: error.message})
    }
})
app.get(`/tables/:tableInformation`, async( req, res) => {

    const tableInformation = req.params.tableInformation.trim()
    const sql = `SELECT * FROM \`${tableInformation}\``;
    try {
        const [rows] = await pool.query(sql)
        res.status(200).json({
            tables: tableInformation,
            info: rows
        })
        console.log(rows)
    } catch (error) {
        console.error(error)
    }
})
app.post(`/tables/:tableName`, async (req, res) => {
    const tableName = req.params.tableName.trim();
    const data = req.body;
    
    const columns = Object.keys(data).join(', ');
    const placeholders = Object.keys(data).map(() => '?').join(', ');
    const values = Object.values(data);

    const sql = `INSERT INTO \`${tableName}\` (${columns}) VALUES (${placeholders})`;

    try {
        const [result] = await pool.query(sql, values);
        res.status(201).json({
            message: `Record created successfully in table ${tableName}`,
            insertId: result.insertId
        });
    } catch (error) {
        console.error("Error creating record:", error);
        res.status(500).json({ error: error.message });
    }
});
app.delete(`/tables/:tableName/:colName/:recordValue`, async (req, res) => {
    const tableName = req.params.tableName.trim();
    const colName = req.params.colName.trim()
    const recordValue = req.params.recordValue
    
    const sql = `DELETE FROM \`${tableName}\` WHERE \`${colName}\` = ?`;

    try {
        const [result] = await pool.query(sql, [recordValue]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: `Record with ID ${recordValue} not found.` });
        }
        
        res.status(200).json({
            message: `Record deleted successfully from table ${tableName}`,
            affectedRows: result.affectedRows
        });
    } catch (error) {
        console.error("Error deleting record:", error);
        res.status(500).json({ error: error.message });
    }
});
app.put(`/tables/:tableName/:colName/:recordValue`, async (req, res) => {
    const tableName = req.params.tableName.trim();
    const colName = req.params.colName.trim();   
    const recordValue = req.params.recordValue;
    const updatedData = req.body;               

    const setClauses = Object.keys(updatedData).map(key => `\`${key}\` = ?`).join(', ');
    const values = Object.values(updatedData); 

    const queryValues = [...values, recordValue]; 

    const sql = `UPDATE \`${tableName}\` SET ${setClauses} WHERE \`${colName}\` = ?`;

    try {
        const [result] = await pool.query(sql, queryValues);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: `Record with ${colName} ${recordValue} not found or no changes were made.` });
        }

        res.status(200).json({
            message: `Record updated successfully in table ${tableName}`,
            affectedRows: result.affectedRows
        });
    } catch (error) {
        console.error("Error updating record:", error);
        res.status(500).json({ error: error.message });
    }
});
initializeDatabase().then(() => {
    app.listen(PORT, () => {
        console.log(`\nServer is running on http://localhost:${PORT}`);
    });
});
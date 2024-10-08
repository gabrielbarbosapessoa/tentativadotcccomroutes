import React, { useState, useEffect } from "react";
import axios from "axios";
import "./MainContentGerenciador.css";

const MainContentGerenciador = () => {
  const [employees, setEmployees] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState(null);
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    fetchEmployees(); 
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get("http://localhost:8080/funcionario"); 
      setEmployees(response.data);
    } catch (error) {
      console.error("Erro ao buscar funcionários:", error);
    }
  };

  const handleAddEmployee = () => {
    setCurrentEmployee(null);
    setIsEdit(false);
    setModalVisible(true);
  };

  const handleEditEmployee = (employee) => {
    setCurrentEmployee(employee);
    setIsEdit(true);
    setModalVisible(true);
  };

  const handleDeleteEmployee = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/funcionario/${id}`); 
      setEmployees(employees.filter((employee) => employee.id !== id));
    } catch (error) {
      console.error("Erro ao excluir funcionário:", error);
    }
  };

  const handleSaveEmployee = async (employee) => {
    try {
      if (isEdit) {
        await axios.put(`http://localhost:8080/funcionario/${employee.id}`, employee); 
        setEmployees(employees.map((emp) => (emp.id === employee.id ? employee : emp)));
      } else {
        const response = await axios.post("http://localhost:8080/funcionario", employee); 
        setEmployees([...employees, response.data]);
      }
      setModalVisible(false);
    } catch (error) {
      console.error("Erro ao salvar funcionário:", error);
    }
  };

  return (
    <div className="main-content">
      <h1 className="cadfunc">Hora de Cadastrar </h1>
      <h1 className="cadfunc2">os Funcionários!</h1>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Email</th>
              <th>Nome</th>
              <th>Senha</th>
              <th>Editar</th>
              <th>Excluir</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee.id}>
                <td>{employee.id}</td>
                <td>{employee.email}</td>
                <td>{employee.nome}</td>
                <td>{employee.senha}</td>
                <td>
                  <button className="lapis" onClick={() => handleEditEmployee(employee)}>✏️</button>
                </td>
                <td>
                  <button className="lapis" onClick={() => handleDeleteEmployee(employee.id)}>
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {modalVisible && (
          <Modal
            employee={currentEmployee}
            onClose={() => setModalVisible(false)}
            onSave={handleSaveEmployee}
            isEdit={isEdit}
          />
        )}
      </div>
      <button className="add-button" onClick={handleAddEmployee}>
        Incluir
      </button> 
    </div>
  );
};

const Modal = ({ employee, onClose, onSave, isEdit }) => {
  const [id, setId] = useState(employee?.id || "");
  const [email, setEmail] = useState(employee?.email || "");
  const [nome, setNome] = useState(employee?.nome || ""); 
  const [senha, setSenha] = useState(employee?.senha || "");

  const handleSubmit = () => {
    const updatedEmployee = { id, email, nome, senha }; 
    onSave(updatedEmployee);
  };

  useEffect(() => {
    if (employee) {
      setId(employee.id);
      setEmail(employee.email);
      setNome(employee.nome);
      setSenha(employee.senha);
    }
  }, [employee]);

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>{isEdit ? "Editar Funcionário" : "Adicionar Funcionário"}</h2>
       
        <label>
          Nome:
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
        </label>
        <label>
          Email:
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label>
          Senha:
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
        </label>
        <button onClick={handleSubmit}>Salvar</button>
        <button onClick={onClose}>Cancelar</button>
      </div>
    </div>
  );
};

export default MainContentGerenciador;

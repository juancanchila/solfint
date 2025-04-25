import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../shared/components/Layout/Layout';
import QueueList from '../Exams/QueueList';  // Aquí importas el componente QueueList
import './Home.css';

function Home() {
  const navigate = useNavigate();
  const handleExam = () => {
    navigate('/exams');
  };
  const handleSubjets = () => {
    navigate('/subjets');
  };
  const handleCatalog = () => {
    navigate('/catalog');
  };

  return (
    <Layout>
      <h1>Bienvenido al Home</h1>
      <p>Este es el contenido de la página principal. Aquí puedes agregar cualquier información relevante.</p>
      <div className="cards">
        <div onClick={handleExam} className="card">
          <h2>Gestión de Exámenes</h2>
          <p>Descripción de la tarjeta 1.</p>
        </div>
        <div onClick={handleSubjets} className="card">
          <h2>Gestión de Evaluados</h2>
          <p>Descripción de la tarjeta 2.</p>
        </div>
        <div onClick={handleCatalog} className="card">
          <h2>Catalogo</h2>
          <p>Descripción de la tarjeta 3.</p>
        </div>

      </div>
      <div className="queues-section">

        <QueueList /> {/* Aquí agregas la lista de colas como un componente profesional */}
      </div>
    </Layout>
  );
}

export default Home;

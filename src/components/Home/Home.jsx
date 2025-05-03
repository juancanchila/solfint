import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../shared/components/Layout/Layout';
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
      <h1>DASHBOARD</h1>


    </Layout>
  );
}

export default Home;

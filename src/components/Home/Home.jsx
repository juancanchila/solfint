import Layout from '../../shared/components/Layout/Layout';
import './Home.css';

function Home() {

  return (
    <Layout>
      <h1>Bienvenido al Home</h1>
      <p>Este es el contenido de la página principal. Aquí puedes agregar cualquier información relevante.</p>
      <div className="cards">
        <div className="card">
          <h2>Título 1</h2>
          <p>Descripción de la tarjeta 1.</p>
        </div>
        <div className="card">
          <h2>Título 2</h2>
          <p>Descripción de la tarjeta 2.</p>
        </div>
        <div className="card">
          <h2>Título 3</h2>
          <p>Descripción de la tarjeta 3.</p>
        </div>
      </div>
    </Layout>
  );
}

export default Home;

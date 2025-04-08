// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import routesConfig from './config/routesConfig.jsx';

function App() {
  return (
    <Router>
      <Routes>
        {routesConfig.map((route, index) =>
          route.children ? (
            <Route key={index} path={route.path} element={route.element}>
              {route.children.map((child, childIndex) => (
                <Route
                  key={childIndex}
                  path={child.path}
                  element={child.element}
                />
              ))}
            </Route>
          ) : (
            <Route key={index} path={route.path} element={route.element} />
          )
        )}
      </Routes>
    </Router>
  );
}

export default App;

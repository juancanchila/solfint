import React, { useState } from 'react';
import './Send-Code.css';
import { useNavigate } from 'react-router-dom';

function SendCode() {
  const user = {
    phone: '+57 3121234567' // Suponiendo que ya tienes este dato en contexto o localStorage
  };

  const lastDigits = user.phone.slice(-4);
  const [code, setCode] = useState('');
  const navigate = useNavigate();

  const handleDigit = (digit) => {
    if (code.length < 6) setCode(code + digit);
  };

  const handleDelete = () => {
    setCode(code.slice(0, -1));
  };

  const handleSubmit = () => {
    if (code.length === 6) {
      alert(`Código ingresado: ${code}`);
      navigate('/home'); // redirige a home o a donde quieras
    } else {
      alert('Ingresa un código válido de 6 dígitos');
    }
  };

  return (
    <div className="send-code-container">
      <div className="phone-info">
        Código enviado al número terminado en ****{lastDigits}
      </div>

      <div className="input-code">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="code-box">{code[i] || ''}</div>
        ))}
      </div>

      <div className="keypad">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
          <button key={n} className="key" onClick={() => handleDigit(n)}>{n}</button>
        ))}

        <button className="key key-ok" onClick={handleSubmit}>OK</button>
        <button className="key" onClick={() => handleDigit(0)}>0</button>
        <button className="key key-del" onClick={handleDelete}>⌫</button>
      </div>
    </div>
  );
}

export default SendCode;

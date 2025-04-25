import React, { useState } from 'react';
import './Send-Code.css';
import { useNavigate } from 'react-router-dom';
import { AuthService } from '../../services/authService';

function SendCode() {
  const phone = localStorage.getItem('phone') || '4567';
  const isReset = localStorage.getItem('isreset') === 'true';
  const lastDigits = phone.slice(-4);

  const [code, setCode] = useState('');
  const navigate = useNavigate();

  const handleDigit = (digit) => {
    if (code.length < 6) setCode(code + digit);
  };

  const handleDelete = () => {
    setCode(code.slice(0, -1));
  };

  const handleSubmit = async () => {
    if (code.length !== 6) {
      alert('Ingresa un código válido de 6 dígitos');
      return;
    }

    try {
      const verified = await AuthService.verifyCode(code);

      if (verified) {
        if (isReset) {
          navigate('/set-password');
        } else {
          navigate('/home');
        }
      } else {
        alert('Código incorrecto');
        navigate('/login');
      }
    } catch (err) {
      alert(err.message);
      navigate('/login');
    }
  };

  return (
    <div className="send-code-container">
      <div className="phone-info">
        {isReset
          ? `Código enviado al número terminado en ****${lastDigits}`
          : `Código enviado al número terminado en ****${phone}`}
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

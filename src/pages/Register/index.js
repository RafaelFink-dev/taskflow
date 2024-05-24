import { useState } from "react";

import { Link } from "react-router-dom";
import { auth } from '../../firebaseConnection';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify"

export default function Register() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  async function handleRegister(e) { //Como é <form> recebe um evento
    e.preventDefault(); //Para não atualizar a pagina, previnir o comportamento

    if (email !== '' && password !== '') {

      await createUserWithEmailAndPassword(auth, email, password)
        .then(() => {
          navigate('/admin', { replace: true })
        })
        .catch(() => {
          console.log('Erro ao criar usuário!')
        })

    } else {
      toast.warn('Preencha todos os campos!')
    }
  }

  return (
    <div className="home-container">
      <img
        src={require('../../assets/tarefa.png')}
        className="logo-img"
      />
      <h1>CADASTRE-SE</h1>
      <span>VAMOS MUDAR A MANEIRA COM QUE GERENCIA SUAS TAREFAS!</span>

      <form className="form" onSubmit={handleRegister}>

        <input
          type="text" placeholder="Digite seu email..."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password" placeholder="******"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Cadastrar</button>

      </form>

      <Link to='/' className="button-link">
        Já possui uma conta? Faça o login!
      </Link>


    </div>
  )
}
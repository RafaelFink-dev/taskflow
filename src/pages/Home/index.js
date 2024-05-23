import { useState, Image } from "react";
import './home.css';
import { Link } from "react-router-dom";
import { auth } from '../../firebaseConnection'
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function Home() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  async function handleLogin(e) { //Como é <form> recebe um evento
    e.preventDefault(); //Para não atualizar a pagina, previnir o comportamento

    if (email !== '' && password !== '') {

      await signInWithEmailAndPassword(auth, email, password)
        .then(() => {
          navigate('/admin', { replace: true })
        })
        .catch(() => {
          console.log('Erro ao fazer login!')
        })

    } else {
      alert('Preencha todos os campos!')
    }
  }

  return (
    <div className="home-container">
      <img
        src={require('../../assets/tarefa.png')}
        className="logo-img"
      />
      <h1>TASKFLOW</h1>
      <span>SIMPLIFIQUE O GERENCIAMENTO DE SUAS TAREFAS.</span>

      <form className="form" onSubmit={handleLogin}>

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

        <button type="submit">Acessar</button>

      </form>

      <Link to='/register' className="button-link">
        Não possui uma conta ? Cadastre-se agora!
      </Link>


    </div>
  )
}
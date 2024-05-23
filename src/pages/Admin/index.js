import './admin.css';
import { useState, useEffect } from 'react';
import { auth, db } from '../../firebaseConnection';
import { signOut } from 'firebase/auth';
import { addDoc, collection, onSnapshot, query, orderBy, where, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';

export default function Admin() {

    const [tarefaInput, setTarefaInput] = useState('');
    const [user, setUser] = useState({});
    const [tarefas, setTarefas] = useState([]);
    const [edit, setEdit] = useState({});

    useEffect(() => {

        async function loadTarefas() {
            const userDetail = localStorage.getItem("@detailUser")
            setUser(JSON.parse(userDetail));

            if (userDetail) {
                const data = JSON.parse(userDetail); //Dados do usuario logado

                //buscando apenas as tarefas do usuário logado
                const tarefaRef = collection(db, 'tarefas');
                const q = query(tarefaRef, orderBy('created', 'desc'), where('userUid', '==', data?.uid))

                const unsub = onSnapshot(q, (snapshot) => {
                    let lista = [];

                    snapshot.forEach((doc) => {
                        lista.push({
                            id: doc.id,
                            tarefa: doc.data().tarefa,
                            userUid: doc.data().userUid
                        })

                        setTarefas(lista);
                    })
                })
            }
        }

        loadTarefas();

    }, [])

    async function handleRegister(e) {
        e.preventDefault();

        if (tarefaInput === '') {
            toast.warn('Digite sua tarefa!');
            return;
        }

        if (edit?.id) {
            handleUpdateTarefa();
            return;
        }

        await addDoc(collection(db, 'tarefas'), {
            tarefa: tarefaInput,
            created: new Date(),
            userUid: user?.uid //Interrogação caso venha vazio, ele não cracha
        })
            .then(() => {
                toast.success('Tarefa inserida com sucesso!')
                setTarefaInput('');
            })
            .catch((e) => {
                console.log("Erro ao registrar: " + e)
            })
    }

    async function handleLogout() {
        signOut(auth);
    }

    async function deleteTarefa(id) {
        const docRef = doc(db, 'tarefas', id);
        await deleteDoc(docRef);
        toast.success('Tarefa concluída com sucesso!')
    }

    function editTarefa(item) {
        setTarefaInput(item.tarefa);
        setEdit(item);
    }

    async function handleUpdateTarefa() {
        const docRef = doc(db, 'tarefas', edit?.id);
        await updateDoc(docRef, {
            tarefa: tarefaInput
        })
            .then(() => {
                toast.success('Tarefa alterada com sucesso!')
                setTarefaInput('');
                setEdit({});
            })
            .catch((e) => {
                console.log('Erro ao editar tarefa: ' + e)
                setTarefaInput('');
                setEdit({});
            })
    }

    function cancelarAlteracao() {
        setTarefaInput('');
        setEdit({});
    }

    return (
        <div className='admin-container'>
            <h1>Minhas tarefas</h1>

            <form className='form' onSubmit={handleRegister}>
                <textarea
                    placeholder='Digite sua tarefa...'
                    value={tarefaInput}
                    onChange={(e) => setTarefaInput(e.target.value)}
                />

                {Object.keys(edit).length > 0 ? (
                    <div className='btns-edits'>
                        <button className='btn-edit' type='submit'>Atualizar tarefa</button>
                        <button className='btn-edit' type='button' onClick={cancelarAlteracao}>Cancelar alteração</button>
                    </div>
                ) : (
                    <button className='btn-register' type='submit'>Registrar tarefa</button>
                )}
            </form>

            {tarefas.map((item) => (
                (
                    <article className='list' key={item.id}>
                        <p>{item.tarefa}</p>

                        <div>
                            <button onClick={() => editTarefa(item)} className='btn-edit'>Editar</button>
                            <button className='btn-delete' onClick={() => deleteTarefa(item.id)}>Concluir</button>
                        </div>
                    </article>
                )
            ))}

            <button className='btn-logout' onClick={handleLogout}>SAIR</button>
        </div>
    )
}
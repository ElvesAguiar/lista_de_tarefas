import { useState, useEffect } from "react";
import { db } from "./firebaseConnection";
import {auth} from "./firebaseConnection"

import {
  doc,
  setDoc,
  collection,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";

import {
createUserWithEmailAndPassword,
signInWithEmailAndPassword,
signOut,
onAuthStateChanged
} from 'firebase/auth'

import "./app.css";
import { async } from "@firebase/util";

function App() {
  const [titulo, setTitulo] = useState("");
  const [autor, setAutor] = useState("");

  const [posts, setPosts] = useState([]);
  const [idPost, setIdPost] = useState([]);

  const [Email, setEmail] = useState([]);
  const [senha, setSenha] = useState([]);
  
  const[user, setUser] = useState(false);
  const [userDetail,setUserDetail] = useState([]);


  useEffect(() => {
    async function loadPosts() {
      const unsub = onSnapshot(collection(db, "posts"), (snapshot) => {
        let listPost = [];
        snapshot.forEach((doc) => {
          listPost.push({
            id: doc.id,
            titulo: doc.data().titulo,
            autor: doc.data().autor,
          });
        });

        setPosts(listPost);
      });
    }
    loadPosts();
  }, []);

  useEffect(()=>{
    async function checkLogin(){
      onAuthStateChanged(auth, (user)=>{
        if(user){
        
          console.log(user);
          setUser(true);
          setUserDetail(
            {
              uid: user.uid,
              email: user.email
            }
          )

        }else{
          setUser(false);
          setUserDetail({});
        }

      })
    }

    checkLogin();


  },[])

  async function handleAdd() {
    // await setDoc(doc(db,"posts", "12345"),
    // {titulo: titulo,
    //   autor:autor}
    // )
    // .then((error)=>{
    //   console.log("Gerou Erro"+error)
    // })
    // .catch((error)=>{
    //   console.log("Gerou Erro"+error)
    // });

    await addDoc(collection(db, "posts"), {
      titulo: titulo,
      autor: autor,
    })
      .then(() => {
        console.log("Cadatrado com Sucesso");
        setAutor("");
        setTitulo("");
      })
      .catch((error) => {
        console.log("Error" + error);
      });
  }

  async function bucarPost() {
    // const postRef = doc(db, "posts","pfOLMBaCuPoikoYRb4wl" );
    // await getDoc(postRef).
    // then((snapshot)=>{
    //   setAutor(snapshot.data().autor);
    //   setTitulo(snapshot.data().titulo);
    // }).
    // catch((error)=>{
    //   console.log("Error: "+error);
    // });

    const postRef = collection(db, "posts");
    await getDocs(postRef)
      .then((snapshot) => {
        let list = [];
        snapshot.forEach((doc) => {
          list.push({
            id: doc.id,
            titulo: doc.data().titulo,
            autor: doc.data().autor,
          });
        });

        setPosts(list);
      })
      .catch((error) => {
        console.log("Deu Algum erro" + error);
      });
  }

  async function editarPost() {
    const docRef = doc(db, "posts", idPost);

    await updateDoc(docRef, {
      titulo: titulo,
      autor: autor,
    })
      .then(() => {
        console.log("Post Atulizado!");
        setIdPost("");
        setTitulo("");
        setAutor("");
      })
      .catch((error) => {
        console.log("Error ao atualizar:" + error);
      });
  }

  async function excluirPost(id) {
    const docRef = doc(db, "posts", id);
    await deleteDoc(docRef)
      .then(() => {
        console.log("Post deletado com sucesso!");
      })
      .catch((error) => {
        console.log("Error ao deletar! " + error);
      });
  }

  async function novoUsuario(){
    await createUserWithEmailAndPassword(auth,Email,senha)
    .then((value)=>{
      console.log("Casdastro feito com sucesso!!");
      console.log(value);
      setEmail('');
      setSenha('');
    })
    .catch((error)=>{
      if(error.code === 'auth/weak-password'){
        alert("senha muito fraca");
      }else if (error.code === 'auth/email-already-in-use'){
        alert("email já exite");
      }
      
      console.log("Falha ao cadastrar!!" + error);
    });
  }

  async function logarUsuario(){
    await signInWithEmailAndPassword(auth,Email,senha)
    .then((value)=>{
      console.log("user logado com sucesso")
      
      setUserDetail(
        {
          uid:value.user.uid,
          email: value.user.email
        }
      );
      setUser(true);

      
      setEmail('');
      setSenha('');
    })
    .catch(()=>{
      console.log("error ao fazer login")
    });
  }

  async function fazerLogout(){
    await signOut(auth)
    setUser(false);
    setUserDetail({});
  }


  return (
    <div>
      <h1>Hello World!!! :)</h1>

      { user && (
        <div>
          <strong>Seja bem-vindo(a) (Você está logado!)</strong> <br/>
          <span>ID: {userDetail.uid} - Email: {userDetail.email}</span> <br/>
          <button onClick={fazerLogout}>Sai da conta</button>
          <br/> <br/>
        </div>
      )}



      <div className="container">
      <h2>Usuarios</h2>
        <label>Email</label>
        <input
          value={Email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="digite seu email"
        />
        <br />

        <label>senha</label>
        <input
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          placeholder="digite sua senha"
        />
        <br />

        <button onClick={novoUsuario}>Cadastrar</button>
        <button onClick={logarUsuario}>logar usuario</button>

      </div>
      <br></br>
      <hr/>
      <div className="container">
      <h2>Posts</h2><br/>
        <label>ID do Post:</label>
        <input
          placeholder="Digite o ID do post"
          value={idPost}
          onChange={(e) => {
            setIdPost(e.target.value);
          }}
        />
        <br />
        <label>Titulo:</label>
        <textarea
          type="text"
          placeholder="Digite o seu titulo"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
        />
        <label>Autor:</label>
        <input
          type="text"
          placeholder="Autor do post"
          value={autor}
          onChange={(e) => setAutor(e.target.value)}
        />

        <button onClick={handleAdd}>Cadatrar</button>
        <button onClick={bucarPost}>Buscar Post</button>
        <br />
        <button onClick={editarPost}>Atualizar Post</button>

        <ul>
          {posts.map((post) => {
            return (
              <li key={post.id}>
                <strong>ID: {post.id}</strong>
                <br />
                <span>titulo:{post.titulo} </span>
                <br />
                <span>autor:{post.autor} </span>
                <br />
                <button onClick={() => excluirPost(post.id)}>Excluir</button>
                <br />
                <br />
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default App;

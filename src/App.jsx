import { useEffect, useState } from "react";
import "./App.css";
import { Auth } from "./components/auth";
import { db, auth, storage } from "./config/firebase";
import {
  getDocs,
  collection,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { ref, uploadBytes } from "firebase/storage";

function App() {
  const [movieList, setmovieList] = useState([]);

  //New movie states
  const [newTitle, setNewTitle] = useState("");
  const [newReleaseDate, setNewReleaseDate] = useState(0);
  const [isOscar, setIsOscar] = useState(false);
  //Title update state
  const [updatedTitle, setUpdatedTitle] = useState("");

  //File upload state
  const [fileUpload, setFileUpload] = useState(null);

  const movieCollectionRef = collection(db, "movies");
  const getMovieList = async () => {
    try {
      const data = await getDocs(movieCollectionRef);
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      console.log(filteredData);
      setmovieList(filteredData);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteMovie = async (id) => {
    const movieDoc = doc(db, "movies", id);
    await deleteDoc(movieDoc);
    getMovieList();
  };

  const updateMovieTitle = async (id) => {
    const movieDoc = doc(db, "movies", id);
    await updateDoc(movieDoc, { title: updatedTitle });
    getMovieList();
  };

  useEffect(() => {
    getMovieList();
  }, []);

  const onSubmitMovie = async () => {
    try {
      await addDoc(movieCollectionRef, {
        title: newTitle,
        releaseDate: newReleaseDate,
        recievedAnOscar: isOscar,
        userId: auth?.currentUser?.uid,
      });
      getMovieList();
    } catch (err) {
      console.error(err);
    }
  };

  const uploadFile = async () => {
    if (!fileUpload) return;
    const filesFolderRef = ref(storage, `projectFiles/${fileUpload.name}`);
    try {
      await uploadBytes(filesFolderRef, fileUpload);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="App">
      <Auth />
      <div>
        <input
          type="text"
          placeholder="Movie Name..."
          onChange={(e) => setNewTitle(e.target.value)}
        />
        <input
          type="number"
          placeholder="Release Date..."
          onChange={(e) => setNewReleaseDate(Number(e.target.value))}
        />
        <input
          type="checkbox"
          checked={isOscar}
          onChange={(e) => setIsOscar(e.target.checked)}
        />
        <label>Recieved an Oscar</label>
        <button onClick={onSubmitMovie}>Submit Movie</button>
      </div>
      <div>
        {movieList.map((movie) => (
          <div>
            <h1 style={{ color: movie.recievedAnOscar ? "green" : "red" }}>
              {movie.title}
            </h1>
            <p>Date: {movie.releaseDate}</p>
            <button onClick={() => deleteMovie(movie.id)}>Delete_Movie</button>
            <input
              type="text"
              placeholder="New title"
              onChange={(e) => setUpdatedTitle(e.target.value)}
            />
            <button onClick={() => updateMovieTitle(movie.id)}>
              Update_title
            </button>
          </div>
        ))}
      </div>
      <br />
      <div>
        <input type="file" onChange={(e) => setFileUpload(e.target.files[0])} />
        <button onClick={uploadFile}>Upload_file</button>
      </div>
    </div>
  );
}

export default App;

import React, { useState } from "react"; // Add this import
import "react-quill-new/dist/quill.snow.css";
import { Navigate } from "react-router-dom";
import Editor from "../Editor";

export default function CreatePost() {
  const [title,setTitle] = useState('');
  const [summary,setSummary] = useState('');
  const [content,setContent] = useState('');
  const [files, setFiles] = useState('');
  const [redirect, setRedirect] = useState(false);
  const [error, setError] = useState('');
  
  async function createNewPost(ev) {
    ev.preventDefault();
    setError('');
    
    const fileInput = document.querySelector('input[type="file"]');
    if (!fileInput.files || !fileInput.files[0]) {
      setError('Please select an image file');
      return;
    }
    
    if (!title) {
      setError('Title is required');
      return;
    }
    
    if (!content) {
      setError('Content is required');
      return;
    }
    
    const data = new FormData();
    data.set('title', title);
    data.set('summary', summary);
    data.set('content', content);
    data.set('file', fileInput.files[0]);
    
    try {
      const response = await fetch('http://localhost:4000/post', {
        method: 'POST',
        body: data,
        credentials: 'include',
      });
      
      if (response.ok) {
        setRedirect(true);
      } else {
        const responseData = await response.json();
        setError(responseData.error || 'Something went wrong');
      }
    } catch (err) {
      console.error('Error creating post:', err);
      setError('Network error. Please try again.');
    }
  }

  if (redirect) {
    return <Navigate to={'/'} />
  }
  
  return (
    <form onSubmit={createNewPost}>
      {error && <div className="error" style={{color: 'red', marginBottom: '10px'}}>{error}</div>}
      <input type="title"
             placeholder={'Title'}
             value={title}
             onChange={ev => setTitle(ev.target.value)} />
      <input type="summary"
             placeholder={'Summary'}
             value={summary}
             onChange={ev => setSummary(ev.target.value)} />
      <input type="file"
             onChange={ev => setFiles(ev.target.files)} />
      <Editor value={content} onChange={setContent} />
      <button style={{marginTop:'5px'}}>Create post</button>
    </form>
  );
}
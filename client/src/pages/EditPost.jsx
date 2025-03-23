import {useEffect, useState} from "react";
import {Navigate, useParams} from "react-router-dom";
import Editor from "../Editor";

export default function EditPost() {
  const {id} = useParams();
  const [title,setTitle] = useState('');
  const [summary,setSummary] = useState('');
  const [content,setContent] = useState('');
  const [files, setFiles] = useState('');
  const [redirect,setRedirect] = useState(false);
  const [error,setError] = useState('');

  useEffect(() => {
    fetch('http://localhost:4000/post/'+id)
      .then(response => {
        response.json().then(postInfo => {
          setTitle(postInfo.title);
          setContent(postInfo.content);
          setSummary(postInfo.summary);
        });
      })
      .catch(err => {
        console.error('Error fetching post data:', err);
        setError('Failed to load post data');
      });
  }, [id]);

  async function updatePost(ev) {
    ev.preventDefault();
    setError('');
    
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
    data.set('id', id);
    if (files?.[0]) {
      data.set('file', files?.[0]);
    }
    
    try {
      const response = await fetch('http://localhost:4000/post', {
        method: 'PUT',
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
      console.error('Error updating post:', err);
      setError('Network error. Please try again.');
    }
  }

  if (redirect) {
    return <Navigate to={'/post/'+id} />
  }

  return (
    <form onSubmit={updatePost}>
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
      <Editor onChange={setContent} value={content} />
      <button style={{marginTop:'5px'}}>Update post</button>
    </form>
  );
}
import {formatISO9075} from "date-fns";
import {Link} from "react-router-dom";

export default function Post({_id,title,summary,cover,content,createdAt,author}) {
  return (
    <div className="post">
      <div className="image">
        <Link to={`/post/${_id}`}>
          {cover ? (
            <img src={`http://localhost:4000/${cover}`} alt={title} />
          ) : (
            <div className="placeholder-img" style={{height: '200px', background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              No image available
            </div>
          )}
        </Link>
      </div>
      <div className="texts">
        <Link to={`/post/${_id}`}>
        <h2>{title}</h2>
        </Link>
        <p className="info">
          <a className="author">{author?.username || 'Unknown author'}</a>
          <time>{createdAt ? formatISO9075(new Date(createdAt)) : ''}</time>
        </p>
        <p className="summary">{summary}</p>
      </div>
    </div>
  );
}
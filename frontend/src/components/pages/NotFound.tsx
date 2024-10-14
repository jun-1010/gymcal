import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>404 - Page Not Found</h1>
      <p>お探しのページは見つかりませんでした。</p>
      <Link to="/" style={{ color: "blue", textDecoration: "underline" }}>
        ホームに戻る
      </Link>
    </div>
  );
};

export default NotFound;
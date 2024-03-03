import { Link } from "react-router-dom";
export default function Header() {
  return (
    <div className="header">
      <Link onClick={() => {}} to={"/"}>
        მთავარი
      </Link>
      <Link to={"/history"}>ისტორია</Link>
    </div>
  );
}

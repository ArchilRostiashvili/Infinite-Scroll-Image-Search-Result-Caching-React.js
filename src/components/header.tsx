import { Link } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

export default function Header() {
  const queryClient = useQueryClient();
  return (
    <div className="header">
      <Link onClick={() => {}} to={"/"}>
        მთავარი
      </Link>
      <Link to={"/history"}>ისტორია</Link>
    </div>
  );
}

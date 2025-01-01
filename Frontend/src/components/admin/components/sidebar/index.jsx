import "./style.css";
import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="admin-sidebar">
      <ul>
        <li>
          <NavLink
            to="/admin"
            end
            className={({ isActive }) =>
              isActive ? "active-link" : "inactive-link"
            }
          >
            Home
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/admin/users"
            end
            className={({ isActive }) =>
              isActive ? "active-link" : "inactive-link"
            }
          >
            Danh Sách Người dùng
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/admin/topQuestion"
            end
            className={({ isActive }) =>
              isActive ? "active-link" : "inactive-link"
            }
          >
            Top Câu Hỏi
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/admin/file"
            end
            className={({ isActive }) =>
              isActive ? "active-link" : "inactive-link"
            }
          >
            File
          </NavLink>
        </li>
        {/* <li>
          <a href="/settings">Cài đặt</a>
        </li> */}
      </ul>
    </aside>
  );
}

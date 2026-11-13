import { Link, useLocation } from "react-router";
import { ChevronRight, Home } from "lucide-react";

export function Breadcrumb() {
  const location = useLocation();

  const pathNames = location.pathname.split("/").filter((path) => path);

  return (
    <nav className="flex items-center space-x-1 text-[13px] font-medium text-text-muted">
      <Link to="/dashboard" className="hover:text-white transition-colors flex items-center gap-1">
        <Home className="w-4 h-4" />
      </Link>

      {pathNames.map((path, index) => {
        const routeTo = `/${pathNames.slice(0, index + 1).join("/")}`;
        const isLast = index === pathNames.length - 1;
        const formattedPath = path.charAt(0).toUpperCase() + path.slice(1);

        return (
          <div key={path} className="flex items-center space-x-1">
            <ChevronRight className="w-4 h-4 text-white/20" />
            {isLast ? (
              <span className="text-white">{formattedPath}</span>
            ) : (
              <Link to={routeTo} className="hover:text-white transition-colors">
                {formattedPath}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
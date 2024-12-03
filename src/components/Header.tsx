import { useNavigate } from "react-router-dom";
import menu from "@/config/Menu";
import Icon from "./Icon";
import { useEffect, useState } from "react";
import "../css/Header.css";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState("Prospectos");
  const navigate = useNavigate();

  useEffect(() => {
    const currentRoute = menu.find(
      (option) => option.route === location.pathname
    );
    if (currentRoute) {
      setCurrentPage(currentRoute.name);
    }
  }, [location.pathname, menu]);

  return (
    <header className="flex flex-col py-4">
      <div className="flex flex-row justify-evenly p-4">
        <div className="flex items-center text-center">
          <div className="md:flex hidden flex-row gap-4">
            {/* Menu Desktop */}
            {menu.map((option) => (
              <a
                key={option.name}
                className={`${
                  location.pathname === `${option.route}`
                    ? "bg-primary-1 text-foreground-1"
                    : ""
                } items-center font-medium transition-all hover:opacity-80 duration-500 ease-in-out cursor-pointer text-lg py-2 px-4 rounded-full hover:scale-105`}
                onClick={() => {
                  {
                    navigate(option.route);
                  }
                }}
              >
                {option.name}
              </a>
            ))}
          </div>
          <h1 className="flex md:hidden font-medium text-2xl">{currentPage}</h1>
          <div className="flex md:hidden">
            {/* Menu Button */}
            <Icon
              icon="keyboard_arrow_down"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`transition-all ease-in-out hover:scale-105 duration-400 h-8 w-8 content-center cursor-pointer text-foreground-1 ${
                isMenuOpen ? "rotate-180" : "-mt-1"
              }`}
              style={{ fontSize: "36px" }}
            />
          </div>
        </div>
      </div>
      <div
        className={`menu ${
          isMenuOpen ? "open" : "-mb-20"
        } flex md:hidden w-full h-max justify-center items-center flex-col gap-8 p-12`}
      >
        {/* Menu Mobile */}
        {menu.map((option) => (
          <a
            key={option.name}
            className={`${
              location.pathname === `${option.route}`
                ? "bg-primary-1 text-foreground-1"
                : ""
            } items-center w-full transition-all duration-500 ease-in-out text-center justify-center flex font-medium cursor-pointer text-xl py-4 rounded-full`}
            onClick={() => {
              {
                navigate(option.route);
                setIsMenuOpen(false);
              }
            }}
          >
            {option.name}
          </a>
        ))}
      </div>
    </header>
  );
};

export default Header;

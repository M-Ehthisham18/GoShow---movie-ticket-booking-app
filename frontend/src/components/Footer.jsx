import React from "react";
import { assets } from "../assets/assets";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="px-6 pt-8 md:px-16 lg:px-36 w-full text-gray-300">
      <div className="flex flex-col md:flex-row justify-between w-full gap-10 border-b border-gray-500 pb-10">
        <div className="md:max-w-96">
          <img className="w-36 h-auto" src={assets.logo} alt="logo" />
          <p className="mt-6 text-sm">
            GoShow is an online movie ticket booking app that allows users to
            explore movies, view details, and book tickets seamlessly with a
            modern UI, responsive design, and interactive experience.
          </p>
          <div className="flex items-center gap-2 mt-4">
            <img
              src={assets.googlePlay}
              alt="google play"
              className="h-10 w-auto border border-white rounded"
            />
            <img
              src={assets.appStore}
              alt="app store"
              className="h-10 w-auto border border-white rounded"
            />
          </div>
        </div>
        <div className="flex-1 flex items-start md:justify-end gap-20 md:gap-40">
          <div>
            <h2 className="font-semibold mb-5">Pages</h2>
            <ul className="text-sm space-y-2">
              <Link
                onClick={() => {
                  scrollTo(0, 0);
                  setIsOpen(false);
                }}
                to="/"
                className="hover:text-primary transition duration-300"
              >
                {" "}
                Home{" "}
              </Link>{" "}
              <br />
              <Link
                onClick={() => {
                  scrollTo(0, 0);
                  setIsOpen(false);
                }}
                className="hover:text-primary transition duration-300"
                to="/movies"
              >
                {" "}
                Movies{" "}
              </Link>
              <br />
              <Link
                onClick={() => {
                  scrollTo(0, 0);
                  setIsOpen(false);
                }}
                className="hover:text-primary transition duration-300"
                to="/theaters"
              >
                {" "}
                Theaters{" "}
              </Link>
              <br />
              <Link
                onClick={() => {
                  scrollTo(0, 0);
                  setIsOpen(false);
                }}
                className="hover:text-primary transition duration-300"
                to="/releases"
              >
                {" "}
                Releases{" "}
              </Link>
              <br />
              <Link
                onClick={() => {
                  scrollTo(0, 0);
                  setIsOpen(false);
                }}
                className="hover:text-primary transition duration-300"
                to="/favorites"
              >
                {" "}
                Favorites{" "}
              </Link>
            </ul>
          </div>
          <div>
            <h2 className="font-semibold mb-5">Get in touch</h2>
            <div className="text-sm space-y-2">
              {/* <p>+1-234-567-890</p> */}
              <p>ehthishamulhaq18@gmail.com</p>
            </div>
          </div>
        </div>
      </div>
      <p className="pt-4 text-center text-sm pb-5">
        Copyright {new Date().getFullYear()} © Ehthisham. All Right Reserved.
      </p>
    </footer>
  );
};

export default Footer;

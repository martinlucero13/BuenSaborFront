import React, { useContext, useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import UserContext from "../../context/userContext";
import LeftNavBar from "./HeaderComponents/LeftNavBar/LeftNavBar";
import ButtonLeftNavBar from "./HeaderComponents/LeftNavBar/ButtonLeftNavBar";
import UserDataNavBar from "./HeaderComponents/UserDataNavBar";
import ButtonAndIcon from "./HeaderComponents/LeftNavBar/ButtonAndIcon";
import PedidoContext from "../../Context/pedidoContext";

export default function NewNavBar({ setCambioContraseña }) {
  const navigate = useRouter();
  const { user } = useContext(UserContext);
  const { articulos } = useContext(PedidoContext);
  const [open, setOpen] = useState(false);
  const [show, setShow] = useState(0);

  useEffect(() => {
    setCambioContraseña(false);
  }, []);

  useEffect(() => {
    open ? setShow(1) : setShow(0);
  }, [open]);

  function handleShow() {
    setOpen(!open);
  }

  function handleRedirect() {
    navigate.push("/home");
    setOpen(false);
  }

  return (
    <>
      <nav>
        <LeftNavBar show={show} handleShow={handleShow} />
        <div>
          <section>
            <div>
              <ButtonLeftNavBar handleShow={handleShow} />
            </div>
            <div>
              <Image
                onClick={handleRedirect}
                width={90}
                height={90}
                src="/buensabor.png"
                alt="buensabor"
              />
            </div>
          </section>
          <section className="title-section">
            {" "}
            <Image
              className="respoimage"
              width={100}
              height={30}
              src="/marcasheader.jpg"
            />
            <h1
              width="50px"
              style={{ fontFamily: "Caveat, cursive" }}
              onClick={handleRedirect}
            >
              EL BUEN SABOR
            </h1>{" "}
            <Image
              className="respoimage"
              width={100}
              height={30}
              src="/marcasheader.jpg"
            />
          </section>
          <article>
            {user.USROL === "1" && (
              <ul>
                <li className="li">
                  <ButtonAndIcon
                    IconName="Cart4"
                    link="/carrito"
                    name={articulos.length}
                  />
                </li>
              </ul>
            )}

            {user && (
              <ul>
                <li>
                  {user.USNOMUSU} {user.USAPEUSU}
                </li>
              </ul>
            )}
            <UserDataNavBar setCambioContraseña={setCambioContraseña} />
          </article>
        </div>
      </nav>
      <style jsx>{`
        .title-section {
          display: flex;
          flex: 1; /* Para ocupar todo el espacio restante */
          justify-content: center;
          align-items: center;
        }

        h1 {
          color: white;
          font-weight: bold;
          margin-left: 8px;
          margin-right: 10px;
        }
        nav {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 96px;
          width: 100%;
          padding: 0;
          background-color: white;
        }
        div {
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 80px;
          width: 100%;
          margin: 0;
          padding: 0;
          background-color: #e11919;
        }
        section {
          display: flex;
          justify-content: center;
          margin: 0 5px 0 0;
          cursor: pointer;
        }
        article {
          display: flex;
          flex-direction: row;
          align-items: center;
        }
        ul {
          align-items: center;
          text-decoration: none;
          color: white;
          font-weight: bold;
          list-style: none;
          margin: 0;
          padding: 2px;
        }
        .li {
          width: 100%;
          display: flex;
          flex-direction: column;
          padding: 7px;
          border-radius: 10px;
          transition: all 0.5s;
        }
        .li:hover {
          color: black;
          background-color: #ff0000;
          cursor: pointer;
        }
        @media screen and (max-width: 850px) {
          .respoimage {
            display: none;
          }
        }
        @media screen and (max-width: 575px) {
          ul {
            display: none;
          }
        }
      `}</style>
    </>
  );
}

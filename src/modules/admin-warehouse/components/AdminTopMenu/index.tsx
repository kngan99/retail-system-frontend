import React from "react";
import { observer } from "mobx-react-lite";
import { useHistory } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import logoSvg from "../../../../../src/logo.svg";
import { LogoDto } from "../../../../common/dto/Logo.dto";
import NotificationSummary from "../../../notification/components/Summary";
import AccountSummary from "../../../account/components/AccountSummary";
//import './top-menu.scss';

/*
 * Props of Component
 */
interface ComponentProps {
  className?: string;
  logo?: LogoDto;
}

const AdminTopMenu = (props: ComponentProps) => {
  const history = useHistory();

  /*
   * Props of Component
   */
  const {
    className,
    logo = {
      className: "",
      url: logoSvg,
      alt: "Logo",
    },
  } = props;

  /*
   * Setting logo responsive
   */
  const isMobile = useMediaQuery({
    query: "(max-width: 991px)",
  });

  return (
    <>
      <div className={`top-menu ${className ? className : ""}`}>
        {isMobile && (
          <div
            onClick={() => {
              history.push("/");
            }}
            className="logo-menu"
          >
            <img
              className={logo.className ? logo.className : ""}
              src={logo.url ? logo.url : ""}
              alt={logo.alt ? logo.alt : "Logo"}
            />
          </div>
        )}
        
      <NotificationSummary />
      <AccountSummary />
      </div>
    </>
  );
};

export default observer(AdminTopMenu);

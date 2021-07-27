import React from 'react';
import { observer } from 'mobx-react-lite';
<link rel="stylesheet" href="https://pro.fontawesome.com/releases/v5.10.0/css/all.css" integrity="sha384-AYmEC3Yw5cVb3ZcuHtOA93w35dYTsvhLPVnYs9eStHfGJvOvKxVfELGroGkvsg+p"/>

const AdminFooter = () => {
  return (
    <>
      <div className="admin-footer">
        <address>© 2021 From Tu and Ngan with <i className="fas fa-heartbeat" style={{color:'red'}}></i></address>
        <p className="admin-version">Version 1.0 </p>
      </div>
    </>
  );
};

export default observer(AdminFooter);

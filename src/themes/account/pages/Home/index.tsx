import { observer } from "mobx-react";
import React from "react";
import { Row, Table } from "react-bootstrap";
import { AccountStoreContext } from "../../../../modules/account/account.store";

const HomePage = () => {
  const accountStore = React.useContext(AccountStoreContext);
  const [accounts, setAccounts] = React.useState<any[]>([]);

  React.useEffect(() => {
    const getAccounts = async () => {
      await accountStore.getAccounts(0, 10);
      setAccounts(accountStore.accounts);
    };
    getAccounts();
  }, [accountStore]);

  return (
    <>
      <div style={{ background: "white", minHeight: "1000px"}}>
        <Row style={{ marginLeft: '10px' }}>Home Page</Row>
        <Row style={{ marginLeft: '10px' }}>Test account</Row>
        <br/>
        <Table striped bordered hover responsive="lg" style={{marginLeft: '10px'}}>
          <thead>
            <tr>
              <th>#</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Username</th>
            </tr>
          </thead>
          <tbody>
            {accounts?.map((account: any) => (
              <tr>
                <td>{account.Id}</td>
                <td>{account.FName}</td>
                <td>{account.LName}</td>
                <td>{account.Username}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </>
  );
};

export default observer(HomePage);

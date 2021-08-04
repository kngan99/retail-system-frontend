import React from "react";
import { observer } from "mobx-react-lite";
import { Form, Button, InputGroup, FormControl } from "react-bootstrap";

/*
 * Props of Component
 */
interface ComponentProps {
  style?: React.CSSProperties;
  className?: string;
  children?: React.ReactNode;
  label?: string;
  filterText?: string;
  handleFilter: any;
  filtered?: boolean;
  handleResetFilter?: any;
}

const Filter = (props: ComponentProps) => {
  /*
   * Props of Component
   */
  const {
    style,
    className,
    children,
    label,
    filterText,
    handleFilter,
    filtered = false,
    handleResetFilter,
  } = props;

  const [searchKeyword, setSearchKeyword] = React.useState<string>("");
  const onSubmit = async() => {
    handleFilter(searchKeyword);
  }

  return (
    <>
      <Form.Group>
      <InputGroup className="mb-3">
        <InputGroup.Text id="basic-addon1">#</InputGroup.Text>
        <Form.Control
          placeholder="Search..."
          aria-label="Search"
          aria-describedby="basic-addon1"
          value={searchKeyword}
          onChange={e => setSearchKeyword(e.target.value)}
        />
        
        <Button onClick={onSubmit} style={{marginLeft: "10px"}}>
          Search
          <i className="ico ico-o-next"></i>
        </Button>
        </InputGroup>
      </Form.Group>
    </>
  );
};

export default observer(Filter);

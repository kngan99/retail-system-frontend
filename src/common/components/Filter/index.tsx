import React from "react";
import { observer } from "mobx-react-lite";
import { Form, Button } from "react-bootstrap";

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

  const [searchKeyword, setSearchKeyword]= React.useState<string>('');

  return (
    <>
      {({ handleSubmit, handleChange, values, errors }) => (
        <Form
          onSubmit={(values) => {
            console.log("alo");
            handleFilter(values);
          }}
        >
          <Form.Group
            className={`block-filter ${filtered ? "filtered" : ""} ${
              className ? className : ""
            }`}
            style={style}
            controlId="search"
          >
            <div className="group">
              <Form.Control
                size="lg"
                type="text"
                placeholder={`Search...`}
                name="search"
                value={values.search}
                onChange={handleChange}
              />
              <Button type="submit">
                <i className="ico ico-o-next"></i>
              </Button>
              {filtered && (
                <Button onClick={handleResetFilter}>
                  <i className="ico ico-reset"></i>
                </Button>
              )}
            </div>
          </Form.Group>
          {children}
        </Form>
      )}
    </>
  );
};

export default observer(Filter);

import React from 'react';
import { observer } from 'mobx-react-lite';
import { List, message, Avatar, Spin } from 'antd';
import { Button, ListGroup, Badge } from 'react-bootstrap';
import InfiniteScroll from 'react-infinite-scroller';
import http from "../../../../common/sevices";

/*
 * Props of Component
 */
interface ComponentProps {
  className?: string;
}

const NotificationSummary = (props: ComponentProps) => {
  /*
   * Props of Component
   */
  const { className } = props;

  /*
   * Setting show/hide Notification
   */
  const [showNotification, setShowNotification] = React.useState<boolean>(
    false
  );
  const [data, setData] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [hasMore, setHasMore] = React.useState<boolean>(true);
  const domain = "http://localhost:4000";
  const [url, setUrl] = React.useState<string>(domain + "/api/notifications/pagination?page=1&limit=1");

  const handleInfiniteOnLoad = () => {
    setLoading(true);
    http.get(url).then((res) => {
      let pastData = data;
      setData(pastData.concat(res.data.items));
      if (res.data.links.next && res.data.links.next !== "") {
        setHasMore(true);
        setUrl(res.data.links.next);
      }
      else {
        setHasMore(false);
      }
      setLoading(false);
    });
  };

  return (
    <>
      <div className={`item box-noti ${className ? className : ''}`}>
        <Button
          variant="link"
          className="box-noti-link"
          onClick={() => setShowNotification(!showNotification)}
        >
          <i className="ico ico-noti"></i>
          <Badge variant="light">3</Badge> 
        </Button>
        {showNotification && (
          <>
            <ListGroup as="ul" className="box-noti-list">
                <ListGroup.Item
                  as="li"
                >
                </ListGroup.Item>
              <InfiniteScroll
                initialLoad={true}
                pageStart={0}
                loadMore={handleInfiniteOnLoad}
                hasMore={!loading && hasMore}
                useWindow={false}
              >
                <List
                  dataSource={data}
                  renderItem={item => (
                    <List.Item key={item.id}>
                      <List.Item.Meta
                        title={<a href="https://ant.design">{item.Title}</a>}
                        description={item.Message}
                      />
                      <div>{item.CreatedAt}</div>
                    </List.Item>
                  )}
                >
                  {loading && hasMore && (
                    <div className="demo-loading-container">
                      <Spin />
                    </div>
                  )}
                </List>
              </InfiniteScroll>
                <ListGroup.Item className="buttons">
                  <Button
                  >
                    <span>Load more</span>
                    <i className="ico ico-next"></i>
                  </Button>
                </ListGroup.Item>
              )
            </ListGroup>
            {/* <div className="demo-infinite-container"> */}
            {/* </div> */}
            {/* <LoadMoreListNotification/> */}
          </>
        )}
      </div>
    </>
  );
};

export default observer(NotificationSummary);

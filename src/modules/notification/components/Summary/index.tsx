import React from 'react';
import { observer } from 'mobx-react-lite';
import { List, message, Avatar, Spin, Tag } from 'antd';
import { Button, ListGroup, Badge } from 'react-bootstrap';
import InfiniteScroll from 'react-infinite-scroller';
import http from "../../../../common/sevices";
import moment from "moment";
import './style.css';

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
  const [num, setNum] = React.useState<number>(0);
  const [data, setData] = React.useState<any[]>([]);
  const [readNoti, setReadNoti] = React.useState<number[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [hasMore, setHasMore] = React.useState<boolean>(true);
  const domain = "https://warehouse-retail.herokuapp.com";
  const [url, setUrl] = React.useState<string>(domain + "/api/notifications/pagination?page=1&limit=10");
  React.useEffect(() => {
    http.get(domain + "/api/notifications/count").then((res) => {
      setNum(res.data.count);
    })
  }, []);
  React.useEffect(() => {
    http.get(domain + "/api/notifications/count").then((res) => {
      setNum(res.data.count);
    })
  }, [readNoti]);

  const handleInfiniteOnLoad = () => {
    setLoading(true);
    http.get(url).then((res) => {
      let pastData = data;
      setData(pastData.concat(res.data.items));
      if (res.data.links.next && res.data.links.next !== "") {
        setHasMore(true);
        setUrl(domain + res.data.links.next);
      }
      else {
        setHasMore(false);
        setUrl(domain + res.data.links.next);
      }
      setLoading(false);
    });
  }

  const markAsRead = (id) => {
    http.get(domain + "/api/notifications/read/" + String(id))
      .then((res) => {
        if (res.data) {
          setReadNoti([...readNoti, id]);
        }
    })
  }

  return (
    <>
      <div className={`item box-noti ${className ? className : ''}`}>
        <Button
          variant="link"
          className="box-noti-link"
          onClick={() => setShowNotification(!showNotification)}
        >
          <i className="ico ico-noti"></i>
          <Badge variant="light">{num}</Badge>
        </Button>
        {showNotification && (
          <>
            <ListGroup as="ul" className="box-noti-list">
              <div className="demo-infinite-container">
              <InfiniteScroll
                initialLoad={true}
                loadMore={handleInfiniteOnLoad}
                hasMore={!loading && hasMore}
                useWindow={false}
              >
                <List
                  dataSource={data}
                    renderItem={item => (
                      item.IsRead ?
                    <List.Item key={item.id} className="notification is-read">
                      <List.Item.Meta
                            title={<a href="#">{item.Title}  <small>{moment(new Date(item.CreatedAt)).fromNow()}</small></a>}
                            description={item.Title === "Warning: Some product is going to run out soon!" ? item.Message.split("; ").map((detail) => <Tag color="default">{detail}</Tag>) : item.Message}
                      />
                      {/* <div>{item.CreatedAt}</div> */}
                        </List.Item>
                        :
                        <List.Item key={item.id} className="notification not-read">
                          <List.Item.Meta
                            title={<a href="#">{item.Title}  {!readNoti.includes(item.Id) && <Button type="text" className={"mark-button"} onClick={() => markAsRead(item.Id)}>mark as read</Button>}<small>{moment(new Date(item.CreatedAt)).fromNow()}</small></a>}
                            description={item.Title === "Warning: Some product is going to run out soon!" ? item.Message.split("; ").map((detail) => readNoti.includes(item.Id) ? <Tag color="default">{detail}</Tag> : <Tag color="gold">{detail}</Tag> ) : item.Message}
                          />
                          {/* <div>{item.CreatedAt}</div> */}
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
              </div>
              {/* <ListGroup.Item className="buttons">
                <Button className="mark-as-read-btn">
                  <span>Mark all as read</span>
                  <i className="ico ico-next"></i>
                </Button>
              </ListGroup.Item> */}
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

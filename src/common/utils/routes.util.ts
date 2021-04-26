/*
 * get title of the current router
 * @param path: string
 * @param routers: any[]
 * @return string
 */
export const getRouteTitle = (path: string, routers: any[]): string => {
  return (
    routers.find((route) => route.path === path)?.title ||
    process.env.REACT_APP_DEFAULT_TITLE ||
    ''
  );
};

/*
 * get path of the current router
 * @param path: string
 * @param routers: any[]
 * @return string
 */
export const getRoute = (path: string, routers: any[]): string => {
  return routers.find((route) => route.path === path)?.path || '';
};

/*
 * get extra params of a router to filter
 * @param filter: Record<string, unknown>
 * @return string
 */
export const prepareGetQuery = (filter: Record<string, unknown>) => {
  const keys = Object.keys(filter);
  const filterValues = keys
    .filter((key) => !!filter[key] || filter[key] === 0)
    .map((key) => {
      if (typeof filter[key] === 'object' && filter[key] !== null) {
        const entityObject: any = filter[key];
        let queryString = [];
        for (const prop in entityObject) {
          queryString.push(`${key}[${prop}]=${entityObject[prop]}`);
        }

        return queryString.join('&');
      }
      return `${key}=${filter[key]}`;
    });

  const behind = filterValues.join('&');

  if (behind) return `?${behind}`;

  return '';
};

/*
 * checking the current router is in routers or not
 * @param path: string
 * @param routers: any[]
 * @return boolean
 */
export const isExisting = (path: string, routers: any[]): boolean => {
  return routers.find((route) => {
    return route.path.includes(path) ? true : false;
  });
};

/*
 * checking the current router is guarded or not
 * @param path: string
 * @param routers: any[]
 * @return boolean
 */
export const isGuarded = (path: string, routers: any[]): boolean => {
  return routers.find((route) => route.path === path)?.isGuarded === true
    ? true
    : false;
};

/*
 * checking the current router is a static page
 * it means we can access it without checking any conditions, no need 'isGuarded' field when defining a static route
 * @param path: string
 * @param routers: any[]
 * @return boolean
 */
export const isStaticPage = (path: string, routers: any[]): boolean => {
  const routeItem = routers.find((route) => route.path === path);
  return routeItem?.isGuarded !== true && routeItem?.isGuarded !== false
    ? true
    : false;
};

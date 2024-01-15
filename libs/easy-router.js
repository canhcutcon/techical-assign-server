const _this = {};
const ALLOWED_METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE"];
const Environment = "development";
const makeSingleRoute = (method, path, handler) => {
  if (!ALLOWED_METHODS.includes(method)) {
    throw Error(
      `Method must be one of: ${ALLOWED_METHODS.join(", ")}, got ${method}`
    );
  }

  if (typeof handler !== "function" && typeof handler !== "object") {
    throw Error(`Handler must be a function or an object, got ${handler}`);
  }

  if (typeof path !== "string") {
    throw Error(`Path must be a string, got ${path}`);
  }

  path = path.endsWith("/") ? path.slice(0, path.length - 1) : path;

  const route = {
    method,
    path,
  };

  if (typeof handler?.handler === "function") {
    route.config = handler;
  } else {
    route.handler = handler;
  }

  return route;
};

const _methods = {};
_methods.GET = (path, handler) => makeSingleRoute("GET", path, handler);
_methods.POST = (path, handler) => makeSingleRoute("POST", path, handler);
_methods.PUT = (path, handler) => makeSingleRoute("PUT", path, handler);
_methods.PATCH = (path, handler) => makeSingleRoute("PATCH", path, handler);
_methods.DELETE = (path, handler) => makeSingleRoute("DELETE", path, handler);

_this.Methods = _methods;

_this.Group = (prefix = "", routes = []) => {
  if (!prefix || routes.length === 0) {
    return [];
  }

  const _routes = [];
  for (const element of routes) {
    const route = element;

    if (route.length) {
      _routes.push(..._this.Group(prefix, route));
    } else {
      _routes.push(
        makeSingleRoute(
          route.method,
          prefix + route.path,
          route.config || route.handler
        )
      );
    }
  }

  return _routes;
};

class Router {
  _routes = [];

  constructor(routes = []) {
    this._routes = routes;
  }

  applyRouteHoF(hof) {
    if (typeof hof !== "function") {
      throw Error(`HOF must be a function, got ${hof}`);
    }

    this._routes = this._routes
      .filter(
        (route) =>
          Environment !== "production" || !route.path.includes("devtools")
      )
      .map((route) => {
        return hof(route);
      });
  }

  allRoutes() {
    return this._routes;
  }

  addRoute(method, path, handler) {
    this._routes.push(makeSingleRoute(method, path, handler));
  }

  GET(path, handler) {
    this.addRoute("GET", path, handler);
  }

  POST(path, handler) {
    this.addRoute("POST", path, handler);
  }

  PUT(path, handler) {
    this.addRoute("PUT", path, handler);
  }

  PATCH(path, handler) {
    this.addRoute("PATCH", path, handler);
  }

  DELETE(path, handler) {
    this.addRoute("DELETE", path, handler);
  }

  group(prefix = "", routes = []) {
    if (!prefix || routes.length === 0) {
      return;
    }

    for (const element of routes) {
      const route = element;

      if (route.length) {
        this.group(prefix, route);
      } else {
        this._routes.push(
          makeSingleRoute(
            route.method,
            prefix + route.path,
            route.config || route.handler
          )
        );
      }
    }
  }
}

_this.makeRouter = (routes = []) => {
  return new Router(routes);
};

module.exports = _this;

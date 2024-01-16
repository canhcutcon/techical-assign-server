"use strict";
const { setSwaggerTagAndExceptionCapture } = require("../helpers/api-handler");
const EasyRouter = require("../libs/easy-router");
const {
  GET,
  // PATCH,
  PUT,
  DELETE,
  POST,
} = EasyRouter.Methods;

const router = EasyRouter.makeRouter();
const Group = EasyRouter.Group;

const AuthRouter = require("./auth.route");
const UserRouter = require("./user.route");
const AdminRouter = require("./admin.route");
const CardRouter = require("./card.route");

router.group("/authentication", [
  POST("/login", AuthRouter.login),
  POST("/register", AuthRouter.register),
]);

router.group("/admin", [
  POST("/login", AdminRouter.login),
  POST("/register", AdminRouter.addMember),
]);

/**
 * {
  "username": "user",
  "password": "123456"
}
 */

router.group("/user", [GET("/profile", UserRouter.getUserInfo)]);

router.group("/cards", [
  GET("/", CardRouter.getCards),
  POST("/", CardRouter.createCard),
  PUT("/{cardId}", CardRouter.updateCard),
  DELETE("/{cardId}", CardRouter.deleteCard),
  GET("/{cardId}", CardRouter.getCard),
]);

router.applyRouteHoF(setSwaggerTagAndExceptionCapture);

module.exports = router.allRoutes();

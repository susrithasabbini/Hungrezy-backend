process.env.NODE_ENV = "test";

import {
  User,
  Admin,
  Announcement,
  Contact,
  Menu,
  Order,
  Restaurant,
  RestaurantReview,
  Review,
  UserVerification,
} from "../models/index.js";

//clean up the database before and after each test
beforeEach((done) => {
  User.deleteMany({}, function (err) {});
  Admin.deleteMany({}, function (err) {});
  Announcement.deleteMany({}, function (err) {});
  Contact.deleteMany({}, function (err) {});
  Menu.deleteMany({}, function (err) {});
  Order.deleteMany({}, function (err) {});
  Restaurant.deleteMany({}, function (err) {});
  RestaurantReview.deleteMany({}, function (err) {});
  Review.deleteMany({}, function (err) {});
  UserVerification.deleteMany({}, function (err) {});
  done();
});

afterEach((done) => {
  User.deleteMany({}, function (err) {});
  Admin.deleteMany({}, function (err) {});
  Announcement.deleteMany({}, function (err) {});
  Contact.deleteMany({}, function (err) {});
  Menu.deleteMany({}, function (err) {});
  Order.deleteMany({}, function (err) {});
  Restaurant.deleteMany({}, function (err) {});
  RestaurantReview.deleteMany({}, function (err) {});
  Review.deleteMany({}, function (err) {});
  UserVerification.deleteMany({}, function (err) {});

  done();
});

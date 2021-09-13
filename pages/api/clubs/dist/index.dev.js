"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _connectDB = _interopRequireDefault(require("../../../utils/connectDB"));

var _clubsModel = _interopRequireDefault(require("../../../models/clubsModel"));

var _auth = _interopRequireDefault(require("../../../middlewares/auth"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

(0, _connectDB["default"])();

var _callee = function _callee(req, res) {
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.t0 = req.method;
          _context.next = _context.t0 === "POST" ? 3 : _context.t0 === "GET" ? 6 : 9;
          break;

        case 3:
          _context.next = 5;
          return regeneratorRuntime.awrap(createClub(req, res));

        case 5:
          return _context.abrupt("break", 9);

        case 6:
          _context.next = 8;
          return regeneratorRuntime.awrap(getClubs(req, res));

        case 8:
          return _context.abrupt("break", 9);

        case 9:
        case "end":
          return _context.stop();
      }
    }
  });
};

exports["default"] = _callee;

var createClub = function createClub(req, res) {
  var result, name, newClub;
  return regeneratorRuntime.async(function createClub$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap((0, _auth["default"])(req, res));

        case 3:
          result = _context2.sent;

          if (!(result.role !== "admin")) {
            _context2.next = 6;
            break;
          }

          return _context2.abrupt("return", res.status(400).json({
            err: "La autenticación no es válida"
          }));

        case 6:
          name = req.body.name;

          if (name) {
            _context2.next = 9;
            break;
          }

          return _context2.abrupt("return", res.status(400).json({
            err: "El nombre no puede dejarse en blanco."
          }));

        case 9:
          newClub = new _clubsModel["default"]({
            name: name.toLowerCase()
          });
          _context2.next = 12;
          return regeneratorRuntime.awrap(newClub.save());

        case 12:
          res.json({
            msg: "¡Éxito! Creó una nuevo Categoría.",
            newClub: newClub
          });
          _context2.next = 18;
          break;

        case 15:
          _context2.prev = 15;
          _context2.t0 = _context2["catch"](0);
          return _context2.abrupt("return", res.status(500).json({
            err: _context2.t0.message
          }));

        case 18:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 15]]);
};

var getClubs = function getClubs(req, res) {
  var clubs;
  return regeneratorRuntime.async(function getClubs$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return regeneratorRuntime.awrap(_clubsModel["default"].find());

        case 3:
          clubs = _context3.sent;
          res.json({
            clubs: clubs
          });
          _context3.next = 10;
          break;

        case 7:
          _context3.prev = 7;
          _context3.t0 = _context3["catch"](0);
          return _context3.abrupt("return", res.status(500).json({
            err: _context3.t0.message
          }));

        case 10:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 7]]);
};
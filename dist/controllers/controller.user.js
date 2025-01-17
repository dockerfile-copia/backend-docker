"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _bcrypt = _interopRequireDefault(require("bcrypt"));
var _responses = _interopRequireDefault(require("../messages/responses.js"));
var _auth = require("../middleware/auth.js");
var _mail = require("../middleware/mail.js");
var _otp = require("../middleware/otp.js");
var _database = require("../models/database.js");
/**
 * Este es el controlador para el usuario
 * @module ctl-user
 */

// BOTH

/**
 * Esta funcion sirve para loguearse el administrador y usuario
 * @param {object} req Captura peticiones en HTML
 * @param {object} res Envia peticiones en HTML
 * @param {object} next Sirve para pasar a la siguiente instruccion
 */
var login = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
    var data, message, match, _message, token, info;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return _database.pool.query("CALL sp_read_logueo(?);", [req.body.email]);
        case 3:
          data = _context.sent;
          if (!(data[0][0] === 0)) {
            _context.next = 8;
            break;
          }
          message = "User doesn't exist";
          _responses["default"].error(req, res, message, 404);
          return _context.abrupt("return");
        case 8:
          _context.next = 10;
          return _bcrypt["default"].compare(req.body.password, data[0][0][0].password);
        case 10:
          match = _context.sent;
          if (match) {
            _context.next = 15;
            break;
          }
          _message = "Wrong password";
          _responses["default"].error(req, res, _message, 404);
          return _context.abrupt("return");
        case 15:
          token = (0, _auth.assignToken)(data[0][0][0]);
          info = data[0][0];
          _responses["default"].success(req, res, {
            token: token,
            info: info
          }, 200);
          _context.next = 23;
          break;
        case 20:
          _context.prev = 20;
          _context.t0 = _context["catch"](0);
          next(_context.t0);
        case 23:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[0, 20]]);
  }));
  return function login(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

/**
 * Esta funcion sirve para actualizar todas las cuentas
 * @param {object} req Captura peticiones en HTML
 * @param {object} res Envia peticiones en HTML
 * @param {object} next Sirve para pasar a la siguiente instruccion
 */
var updateAccounts = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res, next) {
    var data, message, _message2;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return _bcrypt["default"].hash(req.body.password.toString(), 10);
        case 2:
          req.body.password = _context2.sent;
          _context2.prev = 3;
          _context2.next = 6;
          return _database.pool.query("CALL sp_update_cuentas(?, ?, ?, ?, ?);", [req.body.email, req.body.password, req.body.nombre, req.body.apellido, req.body.estado]);
        case 6:
          data = _context2.sent;
          if (data[0].affectedRows >= 1) {
            message = "Item updated successful (Account)";
            _responses["default"].success(req, res, message, 201);
          } else {
            _message2 = "Could't updated Account";
            _responses["default"].error(req, res, _message2, 400);
          }
          _context2.next = 13;
          break;
        case 10:
          _context2.prev = 10;
          _context2.t0 = _context2["catch"](3);
          next(_context2.t0);
        case 13:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[3, 10]]);
  }));
  return function updateAccounts(_x4, _x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}();

/**
 * Esta funcion sirve para mostrar la informacion de peticion de las herramientas para USER
 * @param {object} req Captura peticiones en HTML
 * @param {object} res Envia peticiones en HTML
 * @param {object} next Sirve para pasar a la siguiente instruccion
 */
var showInfoReport = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res, next) {
    var data, message;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return _database.pool.query("call sp_read_informe_solicitud_user(?);", [req.body.id]);
        case 3:
          data = _context3.sent;
          message = data[0][0];
          _responses["default"].success(req, res, message, 201);
          _context3.next = 11;
          break;
        case 8:
          _context3.prev = 8;
          _context3.t0 = _context3["catch"](0);
          next(_context3.t0);
        case 11:
        case "end":
          return _context3.stop();
      }
    }, _callee3, null, [[0, 8]]);
  }));
  return function showInfoReport(_x7, _x8, _x9) {
    return _ref3.apply(this, arguments);
  };
}();

/**
 * Esta funcion sirve para crear y enviar el codigo OTP, para recuperar la
 * contraseña
 * @param {object} req Captura peticiones en HTML
 * @param {object} res Envia peticiones en HTML
 * @param {object} next Sirve para pasar a la siguiente instruccion
 */
var sendMail = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(req, res, next) {
    var data, _message3, otp, message;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _context4.next = 3;
          return _database.pool.query("CALL sp_read_logueo(?);", [req.body.email]);
        case 3:
          data = _context4.sent;
          if (!(!data[0][0] >= 1)) {
            _context4.next = 8;
            break;
          }
          _message3 = "Email doesn't exist";
          _responses["default"].error(req, res, _message3, 404);
          return _context4.abrupt("return");
        case 8:
          otp = (0, _otp.generateCodeOTP)();
          (0, _mail.sendOTP)(req.body.email, otp);
          message = "Otp sent to email: " + req.body.email;
          _responses["default"].success(req, res, message, 200);
          _context4.next = 17;
          break;
        case 14:
          _context4.prev = 14;
          _context4.t0 = _context4["catch"](0);
          next(_context4.t0);
        case 17:
        case "end":
          return _context4.stop();
      }
    }, _callee4, null, [[0, 14]]);
  }));
  return function sendMail(_x10, _x11, _x12) {
    return _ref4.apply(this, arguments);
  };
}();

/**
 * Esta funcion sirve para recuperar contraseña
 * @param {object} req Captura peticiones en HTML
 * @param {object} res Envia peticiones en HTML
 * @param {object} next Sirve para pasar a la siguiente instruccion
 */
var recoverPassword = /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(req, res, next) {
    var data, message, _message4;
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          _context5.next = 2;
          return _bcrypt["default"].hash(req.body.password.toString(), 10);
        case 2:
          req.body.password = _context5.sent;
          _context5.prev = 3;
          _context5.next = 6;
          return _database.pool.query("CALL sp_update_cuentas(?, ?, ?, ?, ?);", [req.body.email, req.body.password, "", "", ""]);
        case 6:
          data = _context5.sent;
          if (data[0].affectedRows >= 1) {
            message = "Item updated successful (password)";
            _responses["default"].success(req, res, message, 201);
          } else {
            _message4 = "Could't updated password";
            _responses["default"].error(req, res, _message4, 400);
          }
          _context5.next = 13;
          break;
        case 10:
          _context5.prev = 10;
          _context5.t0 = _context5["catch"](3);
          next(_context5.t0);
        case 13:
        case "end":
          return _context5.stop();
      }
    }, _callee5, null, [[3, 10]]);
  }));
  return function recoverPassword(_x13, _x14, _x15) {
    return _ref5.apply(this, arguments);
  };
}();

/**
 * Esta funcion sirve para crear cuentas de usuario
 * @param {object} req Captura peticiones en HTML
 * @param {object} res Envia peticiones en HTML
 * @param {object} next Sirve para pasar a la siguiente instruccion
 */
// ONLY USER
var createUser = /*#__PURE__*/function () {
  var _ref6 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(req, res, next) {
    var data, message, _message5;
    return _regenerator["default"].wrap(function _callee6$(_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
          _context6.next = 2;
          return _bcrypt["default"].hash(req.body.password.toString(), 10);
        case 2:
          req.body.password = _context6.sent;
          _context6.prev = 3;
          _context6.next = 6;
          return _database.pool.query("call sp_create_user(?, ?, ?, ?);", [req.body.email, req.body.password, req.body.nombre, req.body.apellido]);
        case 6:
          data = _context6.sent;
          if (data[0].affectedRows >= 1) {
            message = "Item create successful (user)";
            _responses["default"].success(req, res, message, 201);
          } else {
            _message5 = "Could't add the user";
            _responses["default"].error(req, res, _message5, 400);
          }
          _context6.next = 13;
          break;
        case 10:
          _context6.prev = 10;
          _context6.t0 = _context6["catch"](3);
          next(_context6.t0);
        case 13:
        case "end":
          return _context6.stop();
      }
    }, _callee6, null, [[3, 10]]);
  }));
  return function createUser(_x16, _x17, _x18) {
    return _ref6.apply(this, arguments);
  };
}();

/**
 * Esta funcion sirve para eliminar el inactivo de los usuarios
 * @param {object} req Captura peticiones en HTML
 * @param {object} res Envia peticiones en HTML
 * @param {object} next Sirve para pasar a la siguiente instruccion
 */
// Eliminar recuperar cuenta PROBARLO pregunta si o no y listo
var deleteUser = /*#__PURE__*/function () {
  var _ref7 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(req, res, next) {
    var data, message, _message6;
    return _regenerator["default"].wrap(function _callee7$(_context7) {
      while (1) switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          _context7.next = 3;
          return _database.pool.query("CALL sp_delete_recuperar_cuenta(?)", [req.body.email]);
        case 3:
          data = _context7.sent;
          if (data[0].affectedRows >= 1) {
            message = "Item delted successful (account)";
            _responses["default"].success(req, res, message, 201);
          } else {
            _message6 = "Could't deleted the account";
            _responses["default"].error(req, res, _message6, 400);
          }
          _context7.next = 10;
          break;
        case 7:
          _context7.prev = 7;
          _context7.t0 = _context7["catch"](0);
          next(_context7.t0);
        case 10:
        case "end":
          return _context7.stop();
      }
    }, _callee7, null, [[0, 7]]);
  }));
  return function deleteUser(_x19, _x20, _x21) {
    return _ref7.apply(this, arguments);
  };
}();

/**
 * Esta funcion sirve para mostrara los datos dependiendo del el id USER
 * @param {object} req Captura peticiones en HTML
 * @param {object} res Envia peticiones en HTML
 * @param {object} next Sirve para pasar a la siguiente instruccion
 */
var showInfoUser = /*#__PURE__*/function () {
  var _ref8 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8(req, res, next) {
    var data, message;
    return _regenerator["default"].wrap(function _callee8$(_context8) {
      while (1) switch (_context8.prev = _context8.next) {
        case 0:
          _context8.prev = 0;
          _context8.next = 3;
          return _database.pool.query("call sp_read_user(?);", [req.body.id]);
        case 3:
          data = _context8.sent;
          message = data[0][0];
          _responses["default"].success(req, res, message, 201);
          _context8.next = 11;
          break;
        case 8:
          _context8.prev = 8;
          _context8.t0 = _context8["catch"](0);
          next(_context8.t0);
        case 11:
        case "end":
          return _context8.stop();
      }
    }, _callee8, null, [[0, 8]]);
  }));
  return function showInfoUser(_x22, _x23, _x24) {
    return _ref8.apply(this, arguments);
  };
}();

/**
 * Esta funcion sirve para crear los informes de solicitud de herramientas
 * @param {object} req Captura peticiones en HTML
 * @param {object} res Envia peticiones en HTML
 * @param {object} next Sirve para pasar a la siguiente instruccion
 */
var createReportRequest = /*#__PURE__*/function () {
  var _ref9 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee9(req, res, next) {
    var data, message, _message7;
    return _regenerator["default"].wrap(function _callee9$(_context9) {
      while (1) switch (_context9.prev = _context9.next) {
        case 0:
          _context9.prev = 0;
          _context9.next = 3;
          return _database.pool.query("CALL sp_create_informe_solicitud(?, ?, ?);", [req.body.numero_ficha, req.body.fecha, req.body.id_user]);
        case 3:
          data = _context9.sent;
          if (data[0].affectedRows >= 1) {
            message = "Item create successful (Report Request)";
            _responses["default"].success(req, res, message, 201);
          } else {
            _message7 = "Could't add Report Request";
            _responses["default"].error(req, res, _message7, 400);
          }
          _context9.next = 10;
          break;
        case 7:
          _context9.prev = 7;
          _context9.t0 = _context9["catch"](0);
          next(_context9.t0);
        case 10:
        case "end":
          return _context9.stop();
      }
    }, _callee9, null, [[0, 7]]);
  }));
  return function createReportRequest(_x25, _x26, _x27) {
    return _ref9.apply(this, arguments);
  };
}();

/**
 * Esta funcion sirve para crear formularios para pedir una nueva herramienta
 * @param {object} req Captura peticiones en HTML
 * @param {object} res Envia peticiones en HTML
 * @param {object} next Sirve para pasar a la siguiente instruccion
 */
var createFormNew = /*#__PURE__*/function () {
  var _ref10 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee10(req, res, next) {
    var data, message, _message8;
    return _regenerator["default"].wrap(function _callee10$(_context10) {
      while (1) switch (_context10.prev = _context10.next) {
        case 0:
          _context10.prev = 0;
          _context10.next = 3;
          return _database.pool.query("call sp_create_formulario_nueva_herramienta(?, ?, ?, ?);", [req.body.asunto, req.body.cantidad, req.body.descripcion, req.body.id_user]);
        case 3:
          data = _context10.sent;
          if (data[0].affectedRows >= 1) {
            message = "Item create successful (Form New Tool)";
            _responses["default"].success(req, res, message, 201);
          } else {
            _message8 = "Could't add Form New Tool";
            _responses["default"].error(req, res, _message8, 400);
          }
          _context10.next = 10;
          break;
        case 7:
          _context10.prev = 7;
          _context10.t0 = _context10["catch"](0);
          next(_context10.t0);
        case 10:
        case "end":
          return _context10.stop();
      }
    }, _callee10, null, [[0, 7]]);
  }));
  return function createFormNew(_x28, _x29, _x30) {
    return _ref10.apply(this, arguments);
  };
}();

/**
 * Esta funcion sirve para mostrar los formulario de nueva Herramienta para el usuario
 * @param {object} req Captura peticiones en HTML
 * @param {object} res Envia peticiones en HTML
 * @param {object} next Sirve para pasar a la siguiente instruccion
 */
var ShowFormNewUser = /*#__PURE__*/function () {
  var _ref11 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee11(req, res, next) {
    var data, message;
    return _regenerator["default"].wrap(function _callee11$(_context11) {
      while (1) switch (_context11.prev = _context11.next) {
        case 0:
          _context11.prev = 0;
          _context11.next = 3;
          return _database.pool.query("CALL sp_read_formulario_nueva_herramienta_user(?);", [req.body.id_user]);
        case 3:
          data = _context11.sent;
          message = data[0][0];
          _responses["default"].success(req, res, message, 201);
          _context11.next = 11;
          break;
        case 8:
          _context11.prev = 8;
          _context11.t0 = _context11["catch"](0);
          next(_context11.t0);
        case 11:
        case "end":
          return _context11.stop();
      }
    }, _callee11, null, [[0, 8]]);
  }));
  return function ShowFormNewUser(_x31, _x32, _x33) {
    return _ref11.apply(this, arguments);
  };
}();

/**
 * Esta funcion sirve para crear formularios de daño de herramienta
 * @param {object} req Captura peticiones en HTML
 * @param {object} res Envia peticiones en HTML
 * @param {object} next Sirve para pasar a la siguiente instruccion
 */
var createFormDemage = /*#__PURE__*/function () {
  var _ref12 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee12(req, res, next) {
    var data, message, _message9;
    return _regenerator["default"].wrap(function _callee12$(_context12) {
      while (1) switch (_context12.prev = _context12.next) {
        case 0:
          _context12.prev = 0;
          _context12.next = 3;
          return _database.pool.query("call sp_create_formulario_dano_herramienta(?, ?, ?, ?, ?, ?);", [req.body.asunto, req.body.cantidad, req.body.imagen, req.body.descripcion, req.body.id_user, req.body.id_herramienta]);
        case 3:
          data = _context12.sent;
          if (data[0].affectedRows >= 1) {
            message = "Item create successful (Form Demage Tool)";
            _responses["default"].success(req, res, message, 201);
          } else {
            _message9 = "Could't add Form Demage Tool";
            _responses["default"].error(req, res, _message9, 400);
          }
          _context12.next = 10;
          break;
        case 7:
          _context12.prev = 7;
          _context12.t0 = _context12["catch"](0);
          next(_context12.t0);
        case 10:
        case "end":
          return _context12.stop();
      }
    }, _callee12, null, [[0, 7]]);
  }));
  return function createFormDemage(_x34, _x35, _x36) {
    return _ref12.apply(this, arguments);
  };
}();

/**
 * Esta funcion sirve para mostrar los formularios de nueva herramienta para usuario
 * @param {object} req Captura peticiones en HTML
 * @param {object} res Envia peticiones en HTML
 * @param {object} next Sirve para pasar a la siguiente instruccion
 */
var ShowFormDemageUser = /*#__PURE__*/function () {
  var _ref13 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee13(req, res, next) {
    var data, message;
    return _regenerator["default"].wrap(function _callee13$(_context13) {
      while (1) switch (_context13.prev = _context13.next) {
        case 0:
          _context13.prev = 0;
          _context13.next = 3;
          return _database.pool.query("CALL sp_read_formulario_da\xF1o_herramienta_user(?);", [req.body.id_user]);
        case 3:
          data = _context13.sent;
          message = data[0][0];
          _responses["default"].success(req, res, message, 201);
          _context13.next = 11;
          break;
        case 8:
          _context13.prev = 8;
          _context13.t0 = _context13["catch"](0);
          next(_context13.t0);
        case 11:
        case "end":
          return _context13.stop();
      }
    }, _callee13, null, [[0, 8]]);
  }));
  return function ShowFormDemageUser(_x37, _x38, _x39) {
    return _ref13.apply(this, arguments);
  };
}();

/**
 * Esta funcion sirve para enlazar las fichas correspondientes a cada usuario
 * @param {object} req Captura peticiones en HTML
 * @param {object} res Envia peticiones en HTML
 * @param {object} next Sirve para pasar a la siguiente instruccion
 */
var createUserFicha = /*#__PURE__*/function () {
  var _ref14 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee14(req, res, next) {
    var data, message;
    return _regenerator["default"].wrap(function _callee14$(_context14) {
      while (1) switch (_context14.prev = _context14.next) {
        case 0:
          _context14.prev = 0;
          _context14.next = 3;
          return _database.pool.query("CALL sp_create_user_ficha(?, ?)", [req.body.id_user, req.body.numero_ficha]);
        case 3:
          data = _context14.sent;
          message = "Item created successful (User-Ficha)";
          _responses["default"].success(req, res, message, 201);
          _context14.next = 11;
          break;
        case 8:
          _context14.prev = 8;
          _context14.t0 = _context14["catch"](0);
          next(_context14.t0);
        case 11:
        case "end":
          return _context14.stop();
      }
    }, _callee14, null, [[0, 8]]);
  }));
  return function createUserFicha(_x40, _x41, _x42) {
    return _ref14.apply(this, arguments);
  };
}();

/**
 * Esta funcion sirve para mostrar las fichas que tiene cada usuario
 * @param {object} req Captura peticiones en HTML
 * @param {object} res Envia peticiones en HTML
 * @param {object} next Sirve para pasar a la siguiente instruccion
 */
var showFichasUser = /*#__PURE__*/function () {
  var _ref15 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee15(req, res, next) {
    var data, message;
    return _regenerator["default"].wrap(function _callee15$(_context15) {
      while (1) switch (_context15.prev = _context15.next) {
        case 0:
          _context15.prev = 0;
          _context15.next = 3;
          return _database.pool.query("CALL sp_read_user_ficha(?)", [req.body.id_user]);
        case 3:
          data = _context15.sent;
          message = data[0][0];
          _responses["default"].success(req, res, message, 201);
          _context15.next = 11;
          break;
        case 8:
          _context15.prev = 8;
          _context15.t0 = _context15["catch"](0);
          next(_context15.t0);
        case 11:
        case "end":
          return _context15.stop();
      }
    }, _callee15, null, [[0, 8]]);
  }));
  return function showFichasUser(_x43, _x44, _x45) {
    return _ref15.apply(this, arguments);
  };
}();

/**
 * Esta funcion sirve para mostrar un mensaje de que el token si es valido
 * @param {object} req Captura peticiones en HTML
 * @param {object} res Envia peticiones en HTML
 */
var validateToken = function validateToken(req, res) {
  _responses["default"].success(req, res, {
    token: "El token es valido"
  }, 200);
};
var _default = exports["default"] = {
  login: login,
  updateAccounts: updateAccounts,
  showInfoReport: showInfoReport,
  sendMail: sendMail,
  recoverPassword: recoverPassword,
  createUser: createUser,
  deleteUser: deleteUser,
  showInfoUser: showInfoUser,
  createReportRequest: createReportRequest,
  createFormNew: createFormNew,
  ShowFormNewUser: ShowFormNewUser,
  createFormDemage: createFormDemage,
  ShowFormDemageUser: ShowFormDemageUser,
  showFichasUser: showFichasUser,
  createUserFicha: createUserFicha,
  validateToken: validateToken
};
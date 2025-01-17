import express from "express";
import tool from "../controllers/controller.tool.js";
import { checkAuth } from "../services/security.js";

/**
 * Esta es la ruta de las herramientas
 * @type {object}
 */
const routerTool = express.Router();

// ROUTES
routerTool.post("/tool", tool.createTool);
routerTool.put("/tool", tool.updateTool);
routerTool.delete("/tool", tool.deleteTool);
routerTool.get("/tool", tool.showTool);
routerTool.post("/cartTool", tool.createToolCart);
routerTool.post("/showCartTool", tool.showToolCart);
routerTool.delete("/cartTool", tool.deleteToolCart);

export default routerTool;

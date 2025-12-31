const express = require("express");
const dashboardRoute = express.Router();
const { getDashboardStats, getMonthlyProjectStats } = require("../controllers/dashboardController");

// GET /api/dashboard
dashboardRoute.get("/", getDashboardStats);
dashboardRoute.get("/projects/monthly", getMonthlyProjectStats);

module.exports = dashboardRoute;

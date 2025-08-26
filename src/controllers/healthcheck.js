import { request, response } from "express";

export const healthCheck = async (req = request, res = response) => {
  try {
    res.status(200).json({
      status: "Ok",
      uptime: process.uptime(), // seconds since server started
      timestamp: Date.now(), // current server time
      message: "Server is healthy",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: `Internal server error: ${error}`,
    });
  }
};

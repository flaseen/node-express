import { request, response } from "express";

export const helloWorld = async (req = request, res = response) => {
  try {
    res.send("Hello World!");
  } catch (error) {
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: `Internal server error: ${error}`,
    });
  }
};

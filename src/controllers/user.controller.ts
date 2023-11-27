import { DataSource } from "typeorm";
import { Request, Response, NextFunction, RequestHandler } from "express";
import { User } from "../models/User";
import AppDataSource from "../Config/db";
import jwt, { JwtPayload } from "jsonwebtoken";
import {
  loginUserService,
  logoutUserService,
  refreshAccessTokenService,
  registerUserService,
} from "../services/AuthService";
import { validationResult } from "express-validator";
const UserRepository = AppDataSource.getRepository(User);

const generateAccessAndRefreshTokens = async (userId: number) => {
  try {
    const user = await UserRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new Error("User does not exist");
    }

    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    // attach refresh token to the user to avoid refreshing the access token with multiple refresh tokens
    user.refreshToken = refreshToken;

    await UserRepository.save(user);

    return { accessToken, refreshToken };
  } catch (error) {
    throw new Error("Something went wrong while generating the access token");
  }
};
const registerUser = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    const { email, firstName, password, lastName } = req.body;

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    let result = await registerUserService(
      email,
      firstName,
      password,
      lastName
    );

    if (!result.status) {
      return res.status(result.statusCode ?? 500).json({
        status: false,
        message: result.message,
      });
    }

    return res.status(201).json({
      status: true,
      message: "Succesfully Register User",
    });
  } catch (error) {
    console.error("<---Error in registerUser--->", error);
    return res.status(500).json({
      status: false,
      message: "Failed to create user please try again later",
    });
  }
};

const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    let result = await loginUserService(email, password);
    let {
      accessToken,
      options,
      refreshToken,
      status,
      statusCode,
      message,
      user,
    } = result;

    if (!status) {
      return res.status(statusCode ?? 500).json({
        status: false,
        message: message,
      });
    }

    if (!result || !accessToken || !refreshToken || !options) {
      throw "Result not found";
    }

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json({
        status: true,
        message: "User logged in successfully",
        user: user,
        accessToken,
        refreshToken,
      });
  } catch (error) {
    console.error("<---Error in loginUser function --->", error);
    return res.status(500).json({
      status: false,
      message: "Unable to login User please try again later",
    });
  }
};

const logoutUser = async (req: Request, res: Response) => {
  try {
    const userId: number = req.body.userId;

    let result = await logoutUserService(userId);
    let {
      options,
    } = result;

    return res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json({status:true,message:"Successfully logged out"});
  } catch (error) {
    return res.status(500).json({
      status:false,
      message:"Failed to logout"
    })
  }
};

export const refreshAccessToken = async (req: Request, res: Response) => {
  try {
    let result = await refreshAccessTokenService(req, res);
    let { accessToken, options, newRefreshToken, status, statusCode, message } =
      result;

    if (!status) {
      return res.status(statusCode ?? 500).json({
        status: false,
        message: message,
      });
    }

    if (!result || !accessToken || !newRefreshToken || !options) {
      throw "Result not found";
    }

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json({
        accessToken,
        refreshToken: newRefreshToken,
        message: "Access token refreshed",
      });
  } catch (error) {
    // throw new Error(error?.message || "Invalid refresh token");
    // throw new Error("Invalid refresh token");
    return res.status(403).json({
      status: false,
      message: "Invalid refresh token",
    });
  }
};

export { registerUser, loginUser, logoutUser };

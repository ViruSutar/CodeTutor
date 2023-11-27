import AppDataSource from "../Config/db";
import { User } from "../models/User";
import bcrypt from "bcrypt";
import { Request, Response, NextFunction, RequestHandler } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

const UserRepository = AppDataSource.getRepository(User);

export async function registerUserService(
  email: string,
  firstName: string,
  password: string,
  lastName: string
) {
  try {
    console.log("Inside registerUserService");

    // check if user exists with that username and email
    const existedUser = await UserRepository.findOne({ where: { email } });

    if (existedUser) {
      //TODO: redirect user to login page aur do auto login
      //   throw new Error();
      return {
        status: false,
        statusCode: 409,
        message: "User with email already exists",
      };
    }

    // Hash password
    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashedPassword = await bcrypt.hash(password, salt);

    //  /TODO: Think about adding role for User table
    const user = await UserRepository.insert({
      email,
      firstName,
      lastName,
      password: hashedPassword,
      isActive: true,
    });

    console.log("user>>", user);

    if (!user) {
      return {
        status: false,
        statusCode: 500,
        message: "Failed to create user please try again later",
      };
    }
    return Promise.resolve({
      status: true,
      statusCode: 201,
      message: "Succesfully Register User",
    });
  } catch (error) {
    throw error;
  }
}

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
    // console.error("<---Error in generateAccessAndRefreshTokens function--->",error)
    throw error;
  }
};

export async function loginUserService(email: string, password: string) {
  try {
    const user = await UserRepository.findOne({ where: { email } });

    if (!user) {
      return {
        status: false,
        statusCode: 404,
        message: "User does not exist please register and create new Account",
      };
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
      return {
        status: false,
        statusCode: 401,
        message: "Invalid user credentials",
      };
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
      user.id
    );

    // get the user document ignoring the password and refreshToken field
    //   TODO: why we need to call this agains
    // const loggedInUser = await UserRepository.findOne({ where: { id: user.id } ,select:{firstName:true,email:true}});
    // ,select:{password,refreshToken}
    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    };

    return {
      status: true,
      statusCode: 200,
      accessToken,
      refreshToken,
      options,
      user,
    };
  } catch (error) {
    throw error;
  }
}

export async function refreshAccessTokenService(req: Request, res: Response) {
  try {
    const incomingRefreshToken =
      req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
      // throw new Error("Unauthorized request");
      return {
        status: false,
        statusCode: 401,
        message: "Unauthorized request",
      };
    }

    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET!
    ) as { _id: number }; // Type assertion for decodedToken
    let user: User | null;
    // user = await UserRepository.findOne({ id: decodedToken?._id });
    user = await UserRepository.findOneBy({ id: decodedToken?._id });

    if (!user) {
      // throw new Error("Invalid refresh token");
      return {
        status: false,
        statusCode: 403,
        message: "Invalid refresh token",
      };
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      // throw new Error("Refresh token is expired or used");
      return {
        status: false,
        statusCode: 403,
        message: "Refresh token is expired or used",
      };
    }

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    };

    const { accessToken, refreshToken: newRefreshToken } =
      await generateAccessAndRefreshTokens(user.id);

    return {
      accessToken,
      newRefreshToken,
      options,
    };
  } catch (error) {
    throw error;
  }
}

export async function logoutUserService(userId: number) {
  try {
    await UserRepository.update({ id: userId }, { refreshToken: undefined });

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    };

    return {
      options,
    };
  } catch (error) {
    throw error;
  }
}

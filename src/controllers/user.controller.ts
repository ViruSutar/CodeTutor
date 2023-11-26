import { DataSource } from "typeorm";
import { Request, Response, NextFunction, RequestHandler } from "express";
import { User } from "../models/User";
import AppDataSource from "../Config/db";
// import { Error om "../utils/Error"port
import jwt, { JwtPayload } from "jsonwebtoken";
import { loginUserService, registerUserService } from "../services/AuthService";
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
    const { email, firstName, password, lastName } = req.body;

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
    let { accessToken, options, refreshToken, status, statusCode } = result;

    if(!result || !accessToken || !refreshToken || !options){
      throw "Result not found"
    }
    if (!status) {
      return res.status(statusCode ?? 500).json({
        status: false,
        message: result.message,
      });
    }

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json({
        status: result.status,
        statusCode: result.statusCode,
        message: result.message,
      });
  } catch (error) {
    console.error("<---Error in loginUser function --->");
    return res.status(500).json({
      status: false,
      message: "Unable to login User please try again later",
    });
  }
};

const logoutUser = async (req: Request, res: Response) => {
  const userId: number = req.body.userId;

  await UserRepository.update({ id: userId }, { refreshToken: undefined });

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options);
  // .json(new ApiResponse(200, {}, "User logged out"));
};

// const refreshAccessToken = asyncHandler(async (req, res) => {
//   const incomingRefreshToken =
//     req.cookies.refreshToken || req.body.refreshToken;

//   if (!incomingRefreshToken) {
//     throw new Error( "Unauthorized request");
//   }

//   try {
//     const decodedToken = jwt.verify(
//       incomingRefreshToken,
//       process.env.REFRESH_TOKEN_SECRET!
//     );
//     const user = await UserRepository.findBy({id:decodedToken?._id});
//     if (!user) {
//       throw new Error( "Invalid refresh token");
//     }

//     // check if incoming refresh token is same as the refresh token attached in the user document
//     // This shows that the refresh token is used or not
//     // Once it is used, we are replacing it with new refresh token below
//     if (incomingRefreshToken !== user?.refreshToken) {
//       // If token is valid but is used already
//       throw new Error( "Refresh token is expired or used");
//     }
//     const options = {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//     };

//     const { accessToken, refreshToken: newRefreshToken } =
//       await generateAccessAndRefreshTokens(user._id);

//     return res
//       .status(200)
//       .cookie("accessToken", accessToken, options)
//       .cookie("refreshToken", newRefreshToken, options)
//       .json(
//         new ApiResponse(
//           200,
//           { accessToken, refreshToken: newRefreshToken },
//           "Access token refreshed"
//         )
//       );
//   } catch (error) {
//     throw new Error( error?.message || "Invalid refresh token");
//   }
// });

export const refreshAccessToken = async (req: Request, res: Response) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new Error("Unauthorized request");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET!
    ) as { _id: number }; // Type assertion for decodedToken
    let user: User | null;
    // user = await UserRepository.findOne({ id: decodedToken?._id });

    user = await UserRepository.findOneBy({ id: decodedToken?._id });

    // if (user.length === 0) {
    //   throw new Error('Invalid refresh token');
    // }

    if (!user) {
      throw new Error("Invalid refresh token");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new Error("Refresh token is expired or used");
    }

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    };

    const { accessToken, refreshToken: newRefreshToken } =
      await generateAccessAndRefreshTokens(user.id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options);
    // .json(
    //   new ApiResponse(
    //     200,
    //     { accessToken, refreshToken: newRefreshToken },
    //     "Access token refreshed"
    //   )
    // );
  } catch (error) {
    // throw new Error(error?.message || "Invalid refresh token");
    throw new Error("Invalid refresh token");
  }
};

export { registerUser, loginUser, logoutUser };

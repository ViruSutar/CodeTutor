import { DataSource } from "typeorm";
import { Request, Response, NextFunction, RequestHandler } from "express";
import { User } from "../models/User";
import AppDataSource from "../Config/db";
// import { Error om "../utils/Error"port
import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
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
  console.log("Inside registerUser")
  const { email, firstName, password, lastName } = req.body;

  // check if user exists with that username and email
  const existedUser = await UserRepository.findOne({ where: { email } });

  if (existedUser) {
    throw new Error("User with email already exists");
  }

  // Hash password
  const salt = await bcrypt.genSalt(Number(process.env.SALT));
  const hashedPassword = await bcrypt.hash(password, salt);

  //  /TODO: Think about adding role for User table
  const user = await UserRepository.create({
    email,
    firstName,
    lastName,
    password: hashedPassword,
  });

  if (!user) {
    throw new Error("Something went wrong while registering the user");
  }
  return res
    .status(201)
    .json({
      status:true,
      message:"User is registerd successfully"
    });
};

const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email && !password) {
    throw new Error("email or password is required");
  }

  const user = await UserRepository.findOne({ where: { email } });

  if (!user) {
    throw new Error("User does not exist");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new Error("Invalid user credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user.id
  );

  // get the user document ignoring the password and refreshToken field
  //   TODO: why we need to call this agains
  const loggedInUser = await UserRepository.findOne({ where: { id: user.id } });
  // ,select:{password,refreshToken}
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options) // set the access token in the cookie
    .cookie("refreshToken", refreshToken, options) // set the refresh token in the cookie
    // .json(
    //   new ApiResponse(
    //     200,
    //     { user: loggedInUser, accessToken, refreshToken }, // send access and refresh token in response if client decides to save them by themselves
    //     "User logged in successfully"
    //   )
    // );
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
    .clearCookie("refreshToken", options)
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

export const refreshAccessToken = 
  async (req: Request, res: Response) => {
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

      user = await UserRepository.findOneBy({id: decodedToken?._id})

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
        .cookie("refreshToken", newRefreshToken, options)
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
  }

export { registerUser, loginUser, logoutUser };

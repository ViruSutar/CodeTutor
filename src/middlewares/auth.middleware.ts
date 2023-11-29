import jwt ,{ JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction, RequestHandler } from "express";
import AppDataSource from "../Config/db";
import { User } from "../models/User";
const UserRepository = AppDataSource.getRepository(User);

declare global {
    namespace Express {
      interface Request {
        user?: User;
      }
    }
  }

export const verifyJWT = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ status: false, message: "No token found" });
  }

  try {
    //   const user = await User.findById(decodedToken?._id).select(
    //     "-password -refreshToken -emailVerificationToken -emailVerificationExpiry"
    //   );
    const decodedToken = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET!
    ) as JwtPayload;

    const user = await UserRepository.findOne({
      where: { id: decodedToken?.id },
      select:{refreshToken:true,id:true,email:true}
    });
    if (!user) {
      // Client should make a request to /api/v1/users/refresh-token if they have refreshToken present in their cookie
      // Then they will get a new access token which will allow them to refresh the access token without logging out the user
      // throw new ApiError(401, "Invalid access token");
      return res.status(401).json({ status: false, message: "Invalid access token" });
    }
    req.user = user;
    next();
  } catch (error) {
    // Client should make a request to /api/v1/users/refresh-token if they have refreshToken present in their cookie
    // Then they will get a new access token which will allow them to refresh the access token without logging out the user
    return res.status(401).json({ status: false, message: "Invalid access token" });

  }
};

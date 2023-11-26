import AppDataSource from "../Config/db";
import { User } from "../models/User";
import bcrypt from "bcrypt";

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
        status:false,
        statusCode:409,
        message:"User with email already exists"
      }
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
      isActive:true
    });

    console.log("user>>", user);

    if (!user) {
      return {
        status: false,
        statusCode:500,
        message:"Failed to create user please try again later"
      };
    }
    return Promise.resolve({
        status:true,
        statusCode:201,
        message:"Succesfully Register User"
    })
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
      throw new Error("Something went wrong while generating the access token");
    }
  };

export async function loginUserService(email:string, password:string ) {
    try {

        // if (!email && !password) {
        //     throw new Error("email or password is required");
        //   }
        
          const user = await UserRepository.findOne({ where: { email } });
        
          if (!user) {
            return {
                status:false,
                statusCode:404,
                message:"User does not exist please register and create new Account"
            }
          }
        
          const isPasswordValid = await user.isPasswordCorrect(password);
        
          if (!isPasswordValid) {
            return {
                status:false,
                statusCode:401,
                message:"Invalid user credentials"
            }
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

          return {
            status:true,
            statusCode:200,
            accessToken,
            refreshToken,
            options
          }
    } catch (error) {
        throw error;
    }
}

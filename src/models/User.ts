import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

@Entity({ name: "Users" })
export class User {
  @PrimaryGeneratedColumn()
  id!: number;
  @Column()
  firstName!: string;

  @Column({ unique: true })
  email!: String;

  @Column()
  lastName!: string;

  @Column()
  password!: string;

  @Column()
  refreshToken!: string;

  @Column()
  isActive!: boolean;

  public async isPasswordCorrect(password: string) {
    return await bcrypt.compare(password, this.password);
  }

  public async generateAccessToken() {
    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
    console.log("accessTokenSecret",accessTokenSecret)
    if (!accessTokenSecret) {
      throw new Error("ACCESS_TOKEN_SECRET not defined in environment");
    }

    return jwt.sign(
      {
        id: this.id,
        email: this.email,
        firstName: this.firstName,
      },
      accessTokenSecret,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );
  }

  public async generateRefreshToken() {
    const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
    if (!refreshTokenSecret) {
      throw new Error("REFRESH_TOKEN_SECRET not defined in environment");
    }

    return jwt.sign(
      {
        _id: this.id,
      },
      refreshTokenSecret,
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
    );
  }
}

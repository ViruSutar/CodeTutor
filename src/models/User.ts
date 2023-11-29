import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

@Entity({ name: "Users" })
export class User {
  @PrimaryGeneratedColumn()
 public id!: number;
  @Column()
  public firstName!: string;

  @Column({ unique: true })
  public email!: string;

  @Column()
  public lastName!: string;

  @Column()
  public password!: string;

  @Column({ type: 'text',nullable:true})
  public refreshToken!:string | null

  @Column()
  public isActive!: boolean;

  public async isPasswordCorrect(password: string) {
    return await bcrypt.compare(password, this.password);
  }

  public async generateAccessToken() {
    return jwt.sign({
      id: this.id,
      email: this.email,
      firstName: this.firstName,
    },
    process.env.ACCESS_TOKEN_SECRET!,
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
      process.env.REFRESH_TOKEN_SECRET!,
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
    );
  }
}

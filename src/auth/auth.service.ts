import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SignUpDto } from './dtos/signup.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
// Import necessary modules and decorators from NestJS
import { LoginDto } from './dtos/login.dto';
// Import the DTOs for sign-up and login
import { v4 as uuidv4 } from 'uuid';
// Import the uuid library to generate unique identifiers
import { RefreshToken } from './schemas/refresh-token.schema';
// Import necessary modules and decorators from NestJS and Mongoose

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private UserModel: Model<User>,
    @InjectModel(RefreshToken.name)
    private RefreshTokenModel: Model<RefreshToken>,
    private jwtService: JwtService,
  ) {}
  async signup(signUpData: SignUpDto) {
    const { name, email, password } = signUpData;
    //Todo: Check if email already exists
    const emailExists = await this.UserModel.findOne({
      email: email,
    });
    if (emailExists) {
      throw new UnauthorizedException('email already exists');
    }
    //Todo: Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    //Todo:Crate and save user to database
    await this.UserModel.create({
      name,
      email,
      password: hashedPassword,
    });
  }

  async login(loginData: LoginDto) {
    const { email, password } = loginData;
    //todo: Check if user exists
    const user = await this.UserModel.findOne({ email });
    if (!user) {
      throw new UnauthorizedException('Wrong credentials');
    }
    //todo: Compare passwords with existing password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedException('Wrong credentials');
    }
    //todo: generate JWT tokens

    return this.generateTokens((user._id as any).toString());
  }

  async refreshToken(refreshToken: string) {
    const token = await this.RefreshTokenModel.findOne({
      token: refreshToken,
      expiryrDate: { $gte: new Date() },
    });
    if (!token) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    return this.generateTokens(token.userId.toString());
  }

  // Generate access and refresh tokens
  // This method can be called after successful login or signup
  async generateTokens(userId: string) {
    const accessToken = this.jwtService.sign({ userId });
    const refreshToken = uuidv4();

    await this.storeRefreshToken(refreshToken, userId);
    return {
      accessToken,
      refreshToken,
    };
  }

  async storeRefreshToken(token: string, userId: string) {
    // Store the refresh token in the database
    const expiryrDate = new Date();
    expiryrDate.setDate(expiryrDate.getDate() + 7); // Set expiration date to 7 days from now
    await this.RefreshTokenModel.updateOne(
      { userId },
      {
        $set: { expiryrDate, token },
      },
      {
        upsert: true, // Create a new document if it doesn't exist
      },
    );
  }
}

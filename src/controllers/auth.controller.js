import crypto from 'crypto';
import { promisify } from 'util';
import bcrypt from 'bcryptjs';
require('dotenv').config();
import jwt from 'jsonwebtoken';
import { registerValidation, loginValidation } from '../utils/validation';

const models = require('../models');
import handleAsync from '../utils/handleAsync';
import AppError from '../utils/appError';
import sendEmail from '../utils/email';

const { User } = models;

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user.id);
  const cookieOptions = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
    httpOnly: true
  };

  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
  res.cookie('jwt', token, cookieOptions);

  res.status(statusCode).json({
    token,
    user
  });
};

exports.signup = handleAsync(async (req, res, next) => {
  //   joi validation
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).json(error);

  const newUser = await User.create(req.body);

  createSendToken(newUser, 201, res);
  next();
});

exports.login = async (req, res, next) => {
  try {
    //validate user first
    const { error } = loginValidation(req.body);
    if (error) return res.status(400).json(error);
    const { email, password } = req.body;

    // 1) Check if email and password exist
    if (!email || !password) {
      return next(new Error('Please provide email and password!'));
    }

    // 2) Check if user exists && password is correct
    const user = await User.findOne({ where: { email: email } });

    const validPassword = await bcrypt.compare(req.body.password, user.password);

    // !(await user.correctPassword(req.body.password, user.password))
    // console.log(!user || !validPassword);

    if (!user) {
      console.log(!user || !(await user.correctPassword(req.body.password, user.password)));
      return next(new AppError('invalid email or password  ', 400));
    }
    console.log(!user || !validPassword);

    // 3) If everything ok, send token to client
    createSendToken(user, 200, res);
  } catch (err) {
    return next(err);
  }
};

exports.protect = async (req, res, next) => {
  try {
    //get token and see if its there

    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
      return next(new Error('You are not logged in! Please login to get access'));
    }

    //verify token
    const verified = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    //check if user exist
    const currentUser = await User.findByPk(verified.id);
    if (!currentUser) {
      return next(new Error('The user belonging to this token does no longer exist.', 500));
    }

    //check if user changed password after the token was issued
    // if (currentUser.changedPasswordAfter(verified.iat)) {
    //   return next(new Error('User recently changed password! Please log in again.', 401));
    // }

    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;
    next();
  } catch (err) {
    next(err);
  }
};

exports.updatePassword = async (req, res, next) => {
  try {
    //get logged in user from auth token

    const currentUser = await User.findOne({
      where: { password: req.user.password }
    });
    // const currentUser = await User.findByPk(req.user.id, {
    //   where: { password: req.user.password },
    // });
    console.log(currentUser);

    if (!(await currentUser.correctPassword(req.body.password, currentUser.password))) {
      return next(new AppError('Your current passwword is wrong', 401));
    }

    //3) if password is correct update password
    // currentUser.password = req.body.newPassword;
    // currentUser.passwordConfirm = req.body.passwordConfirm;
    // await currentUser.save();
    createSendToken(currentUser, 200, res);
    // currentUser.password = await bcrypt.hash(req.body.newPassword, 12);
  } catch (error) {
    console.log(error.message);
  }
};

exports.forgotPassword = handleAsync(async (req, res, next) => {
  // 1) Get user based on POSTed email
  const user = await User.findOne({ where: { email: req.body.email } });
  if (!user) {
    return next(new AppError('There is no user with email address.', 404));
  }

  // 2) Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  // await user.save({ validateBeforeSave: false });
  await user.save();

  // 3) Send it to user's email
  const resetURL = `${req.protocol}://${req.get('host')}/api/user/resetPassword/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email! 🙃🙃`;

  try {
    await sendEmail({
      email: user.email,
      subject: `Your (10 mins) password reset token (${user.passwordResetExpires})👍👍 `,
      message: message
    });
    console.log(user);

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!'
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    return next(err);
  }
});

exports.resetPassword = handleAsync(async (req, res, next) => {
  // 1) Get user based on the token
  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

  const user = await User.findOne({
    where: {
      passwordResetToken: hashedToken
      // passwordResetExpires: { gt: Date.now() + 10 * 60 * 4000 },
    }
  });
  console.log(user);

  // 2) If token has not expired, and there is user, set the new password
  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = null;
  user.passwordResetExpires = null;
  await user.save();

  // 3) Update changedPasswordAt property for the user
  const token = signToken(user.id);

  res.status(200).json({
    status: 'success',
    token: token
  });
  // 4) Log the user in, send JWT
  // createSendToken(user, 200, res);
});

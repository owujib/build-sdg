'use strict';

import bcrypt from 'bcryptjs';
import crypto from 'crypto';

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      firstname: {
        type: DataTypes.STRING,
        allowNull: false
      },

      lastname: {
        type: DataTypes.STRING,
        allowNull: false
      },
      middlename: {
        type: DataTypes.STRING,
        allowNull: false
      },
      user_type: {
        type: DataTypes.ENUM,
        values: ['customer', 'farmer'],
        allowNull: false
      },
      role: {
        type: DataTypes.ENUM,
        values: ['user', 'admin'],
        defaultValue: 'user'
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      delivery_address: {
        type: DataTypes.STRING,
        allowNull: false
      },
      profile_img: {
        type: DataTypes.STRING,
        allowNull: false
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
          max: 255
        }
      },
      passwordChangedAt: DataTypes.DATE,
      passwordResetToken: DataTypes.STRING,
      passwordResetExpires: DataTypes.DATE
    },
    {}
  );
  User.associate = function (models) {
    // associations can be defined here
  };

  User.beforeSave(async (user) => {
    if (user.isNewRecord || !user.changed('password')) return false;

    return (user.passwordChangedAt = Date.now() - 1000);
  });

  //hash user password before create
  User.beforeCreate(async (user) => {
    //only run this function if password is was actually modified
    if (!user.changed('password')) return false;

    const hashUser = bcrypt.hash(user.password, 12).then((hashedPw) => {
      user.password = hashedPw;
    });

    return hashUser;
  });
  //hash password after save
  User.beforeSave(async (user) => {
    //only run this function if password is was actually modified
    if (!user.changed('password')) return false;

    const hashUser = bcrypt.hash(user.password, 12).then((hashedPw) => {
      user.password = hashedPw;
    });

    return hashUser;
  });

  User.prototype.correctPassword = async function (candidatePassword, userPassword) {
    console.log(candidatePassword, userPassword);
    return bcrypt.compare(candidatePassword, userPassword);
  };

  User.prototype.changedPasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
      const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);

      //if false means not changed that this
      return JWTTimestamp < changedTimestamp;
    }

    //False means not changed
    return false;
  };

  User.prototype.createPasswordResetToken = function () {
    //going to be sent to the user
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    console.log({ resetToken }, this.passwordResetToken);

    // this.passwordResetExpires = new Date().toISOString();
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    console.log(this.passwordResetExpires);

    return resetToken;
  };

  return User;
};

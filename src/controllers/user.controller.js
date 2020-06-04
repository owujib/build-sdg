import AppError from '../utils/appError';

const models = require('../models');
const { User } = models;

exports.updateUser = async (req, res, next) => {
  try {
    req.params.id = req.user.id;
    const updated = await User.update(req.body, {
      where: { id: req.params.id }
    });
    if (updated) {
      const updateUser = await User.findOne({ where: { id: req.params.id } });
      return res.status(200).json({
        status: 'success',
        data: {
          user: updateUser
        }
      });
    } else {
      throw new AppError('User does not exist');
    }
  } catch (err) {
    return next(err);
  }
};

exports.getUser = (req, res, next) => {
  req.params.id = req.user.id;
  console.log(req.user);
  res.status(200).json(req.user);
  next();
};

import { Router } from 'express';
import IRoute from '../types/IRoute';
import { User } from '../services/db';
import { CreateUserRequest, UpdateUserRequest } from '../requests/user.request';
import { AppError } from '../utils/AppError';

const UsersRouter: IRoute = {
  route: '/users', // This is just the mount point, app.use('/users', UsersRouter.router());
  router() {
    const router = Router();

    router.route('/')
      // Fetch all users
      .get(async (req, res) => {
        return User.findAll() // This will return a Promise that is handled by the .then() and .catch() blocks.
          .then(users => {
            return res.json({
              success: true,
              data: users,
            });
          })
          .catch(err => {
            console.error('Failed to list all users.', err);
            res.status(500).json({
              success: false,
            });
          });
      })
      .post(async (req, res, next) => {
        const userData = CreateUserRequest.safeParse(req.body);
        console.log('userData', userData);

        if (!userData.success) {
          return next(new AppError('Validation failed', 400, userData.error.flatten()));
        }

        return User.create(userData.data)
          .then(user => {
            return res.json({
              success: true,
              data: user,
            });
          })
          .catch(err => {
            console.error('Failed to create user.', err);
            next(new AppError('Failed to create user', 500, err));
          });
      });

      router.patch('/:id', async (req, res, next) => {
        const updateData = UpdateUserRequest.safeParse(req.body);
  
        if (!updateData.success) {
          return next(new AppError('Validation failed', 400, updateData.error.flatten()));
        }
  
        try {
          const user = await User.findByPk(req.params.id);
  
          if (!user) {
            return next(new AppError('User not found', 404));
          }
  
          await user.update(updateData.data);
          return res.json({
            success: true,
            data: user,
          });
        } catch (err) {
          console.error('Failed to update user.', err);
          next(new AppError('Failed to update user', 500, err));
        }
      });  

    return router;
  },
  
};

export default UsersRouter;

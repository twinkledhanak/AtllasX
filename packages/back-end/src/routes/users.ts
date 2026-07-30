import { Router } from 'express';
import IRoute from '../types/IRoute';
import { User } from '../services/db';
import { CreateUserRequest, UpdateUserRequest } from '../requests/user.request';

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
      .post(async (req, res) => {
        const userData = CreateUserRequest.safeParse(req.body);
        console.log('userData', userData);

        if (!userData.success) {
          return res.status(400).json({
            success: false,
            errors: userData.error.flatten(),
          });
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
            res.status(500).json({
              success: false,
            });
          });
      });

    return router;
  },
};

export default UsersRouter;

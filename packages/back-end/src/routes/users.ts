import { Router } from 'express';
import IRoute from '../types/IRoute';
import { User } from '../services/db';
import { CreateUserRequest, UpdateUserRequest } from '../requests/user.request';
import { AppError } from '../utils/AppError';
import { Op } from "sequelize";

const UsersRouter: IRoute = {
  route: '/users', // This is just the mount point, app.use('/users', UsersRouter.router());
  router() {
    const router = Router();

    router.route('/')
      // Fetch all users
      .get(async (req, res) => {
        try {
          const page = parseInt(req.query.page as string) || 0;
          const pageSize = parseInt(req.query.pageSize as string) || 10;
          const search = (req.query.search as string) || "";
      
          // Build WHERE clause for search
          const where = search
            ? {
                [Op.or]: [
                  { firstName: { [Op.like]: `%${search}%` } },
                  { middleName: { [Op.like]: `%${search}%` } },
                  { lastName: { [Op.like]: `%${search}%` } },
                  { email: { [Op.like]: `%${search}%` } },
                ],
              }
            : {};
                
          // Use findAndCountAll for pagination + total count
          const users = await User.findAndCountAll({
            where,
            limit: pageSize,
            offset: page * pageSize,
          });
      
          return res.json({
            success: true,
            data: users.rows,   // current page
            total: users.count, // total matching users
          });
        } catch (err) {
          console.error("Failed to fetch paginated users.", err);
          return res.status(500).json({
            success: false,
            error: "Failed to fetch users",
          });
        }
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
            if (err.name === 'SequelizeUniqueConstraintError') {
              return next(new AppError('A user with this email already exists', 409, err));
            }
            console.error('Failed to create user.', err);
            next(new AppError('Failed to create user', 500, err));
          });
      });

      router.route('/:id')
      .patch(async (req, res, next) => {
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
      })
      .delete(async (req, res, next) => {
        try {
          const user = await User.findByPk(req.params.id);

          if (!user) {
            return next(new AppError('User not found', 404));
          }

          await user.destroy();
          return res.json({ 
            success: true, data: user 
          });
        } catch (err) {
          console.error('Failed to delete user.', err);
          next(new AppError('Failed to delete user', 500, err));
        }
      });

    return router;
  },
  
};

export default UsersRouter;

import { Router } from 'express';
import IRoute from '../types/IRoute';
import { User } from '../services/db';
import { CreateUserRequest, UpdateUserRequest } from '../requests/user.request';
import { AppError } from '../utils/AppError';
import { Op, Sequelize, Order } from "sequelize";

// UI Display Column <-> Actual Database column
const SORT_MAP: Record<string, string> = {
  fullName: "firstName",   
  firstName: "firstName",
  registeredAt: "registered",
  updatedAt: "updatedAt"
};
const DATE_COLUMNS = new Set(["registered", "updatedAt"]);


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
          const search = (req.query.search as string).toLowerCase() || "";
      
          // Build WHERE clause for search
          const where = search? {
              [Op.or]: [
                Sequelize.where(
                  Sequelize.fn("LOWER", Sequelize.col("firstName")),
                  { [Op.like]: `%${search}%` }
                ),
                Sequelize.where(
                  Sequelize.fn("LOWER", Sequelize.col("middleName")),
                  { [Op.like]: `%${search}%` }
                ),
                Sequelize.where(
                  Sequelize.fn("LOWER", Sequelize.col("lastName")),
                  { [Op.like]: `%${search}%` }
                ),
                Sequelize.where(
                  Sequelize.fn("LOWER", Sequelize.col("email")),
                  { [Op.like]: `%${search}%` }
                ),
              ],
            }
          : {};

          const rawSort = Array.isArray(req.query.sort)? req.query.sort[0]: req.query.sort;
          const requestedSort = typeof rawSort === "string" && rawSort.trim() !== ""? rawSort: "firstName";  
          const sort = SORT_MAP[requestedSort] || "firstName";
          const direction = typeof req.query.direction === "string" && req.query.direction === "desc"? "DESC": "ASC";

          const isDateColumn = DATE_COLUMNS.has(sort);
          // Depending on whether we have to sort FullName column OR any of the dates column
          // registered and updatedAt wont require LOWER
          const order: Order = isDateColumn? [[sort, direction]]:[[Sequelize.fn("LOWER", Sequelize.col(sort)),
              direction]];
          // Use findAndCountAll for pagination + total count
          const users = await User.findAndCountAll({
            where,
            limit: pageSize,
            offset: page * pageSize,
            order,
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

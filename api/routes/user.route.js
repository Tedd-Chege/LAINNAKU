import express from 'express';
import {
  createUserByAdmin,
  deleteUser,
  getUser,
  getUsers,
  getUsersByAdmin,
  signout,
  test,
  updateUser,
  adminUpdateUser,
  adminDeleteUser,
} from '../controllers/user.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.get('/test', test);
router.put('/update/:userId', verifyToken, updateUser);
router.delete('/delete/:userId', verifyToken, deleteUser);
router.post('/signout', signout);
router.get('/getusers', verifyToken, getUsers);
router.post('/by-admin',  getUsersByAdmin);
router.post('/create-by-admin', verifyToken, createUserByAdmin);
router.get('/:userId', verifyToken, getUser);
router.put('/admin-update/:userId', adminUpdateUser);
router.delete('/admin-delete/:userId', adminDeleteUser);

export default router;

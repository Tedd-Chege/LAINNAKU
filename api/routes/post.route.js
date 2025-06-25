import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';

import { deletepost, getposts, updatepost, uploadFile, getAllPosts, replaceFile, searchPosts, getPostsByUserId } from '../controllers/post.controller.js';

const router = express.Router();

router.post('/upload', verifyToken, uploadFile);
router.get('/getposts/:id', getposts);
router.delete('/deletepost/:postId/:userId', verifyToken, deletepost);
router.get('/getallposts', verifyToken, getAllPosts); // Add this line
router.put('/updatepost/:id', verifyToken, updatepost);
router.put('/replacefile/:id', replaceFile);
router.get('/search', searchPosts);
router.get('/user/:userId', verifyToken, getPostsByUserId);

export default router;

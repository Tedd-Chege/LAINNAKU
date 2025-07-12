import NewPost from '../models/NewPost.js';
 
// Function to handle file upload
// uploadFile function
export const uploadFile = async (req, res, next) => {
  try {
    const { userId, fileUrl, category, subject, year, form, term, title, description, status } = req.body; // updated terms to term

    const post = new NewPost({
      userId,
      fileUrl,
      category,
      subject,
      form,
      year,
      term, // updated terms to term
      title,
      description,
      status,
    });

    const savedPost = await post.save();
    res.status(201).json(savedPost);
  } catch (err) {
    next(err);
  }
};



// Other controller functions as needed

export const getposts = async (req, res, next) => {
  const postId = req.params.id;

  try {
    const post = await NewPost.findById(postId);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }
    res.json(post);
  } catch (error) {
    next(error);
  }
};

export const searchPosts = async (req, res) => {
  try {
    const { category, form, subject, year, term, searchTerm, sort, startIndex } = req.query;

    let query = {};

    if (category) {
      query.category = category;
    }
    if (form) {
      query.form = form;
    }
    if (subject) {
      query.subject = subject;
    }
    if (year) {
      query.year = year;
    }
    if (term) {
      query.term = term;
    }
    if (searchTerm) {
      query.$or = [
        { title: { $regex: searchTerm, $options: 'i' } },
        { description: { $regex: searchTerm, $options: 'i' } }
      ];
    }

    const sortOrder = sort === 'asc' ? 1 : -1;
    const skip = parseInt(startIndex) || 0;

    const posts = await NewPost.find(query)
      .sort({ createdAt: sortOrder })
      .skip(skip)
      .limit(9);

    res.json({ posts });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch posts', error });
  }
};





export const deletepost = async (req, res, next) => {
  
  try {
    await NewPost.findByIdAndDelete(req.params.postId);
    res.status(200).json('The post has been deleted');
  } catch (error) {
    next(error);
  }
};

// controllers/post.controller.js

export const updatepost = async (req, res, next) => {
  const { fileUrl, category, subject, year, term, form, title, description,status } = req.body;
  const postId = req.params.id;

  try {
    const updatedPost = await NewPost.findByIdAndUpdate(
      postId,
      {
        fileUrl,
        category,
        subject,
        year,
        term,
        form,
        title,
        description,
        status,
      },
      { new: true }
    );

    res.json(updatedPost);
  } catch (error) {
    next(error);
  }
};



export const getAllPosts = async (req, res) => {
  try {
    const posts = await NewPost.find();
    res.status(200).json({ posts });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add this controller to handle file replacement
export const replaceFile = async (req, res) => {
  const { id } = req.params;
  const { filename, filePath, newFilename, newFilePath } = req.body;

  try {
    const post = await NewPost.findById(id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Delete the old file from Firebase Storage
    const storage = getStorage(app);
    const fileRef = ref(storage, filename);
    await deleteObject(fileRef);

    // Update the post with the new file's information
    post.filename = newFilename;
    post.filePath = newFilePath;
    await post.save();

    res.status(200).json({ message: 'File replaced successfully', post });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to replace file', error });
  }
};

// Get posts/files by userId
export const getPostsByUserId = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const posts = await NewPost.find({ userId });
    res.status(200).json(posts);
  } catch (error) {
    next(error);
  }
};
const Blog = require("../models/blogModel");
const User = require("../models/userModal");
const asyncHandler = require("express-async-handler");
const validateMongodbId = require("../utils/validateMongodbId");

//create a new blog
const createBlog = asyncHandler(async (req, res) => {
  try {
    const newBlog = await Blog.create(req.body);
    res.json({
      status: "success",
      newBlog,
    });
  } catch (error) {
    throw new Error(error);
  }
});

//update blog
const updateBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  //validate id
  validateMongodbId(id);
  try {
    const updateBlog = await Blog.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updateBlog);
  } catch (error) {
    throw new Error(error);
  }
});

//get a blog
const getBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  //validate id
  validateMongodbId(id);
  try {
    const getBlog = await Blog.findById(id);
    await Blog.findByIdAndUpdate(
      id,
      {
        $inc: { numViews: 1 },
      },
      { new: true }
    );
    res.json(getBlog);
  } catch (error) {
    throw new Error(error);
  }
});

//get all blogs
const getAllBlog = asyncHandler(async (req, res) => {
  try {
    const getBlogs = await Blog.find();
    res.json(getBlogs);
  } catch (error) {
    throw new Error(error);
  }
});

//delete a blog
const deleteABlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  //validate id
  validateMongodbId(id);
  try {
    const deleteABlog = await Blog.findByIdAndDelete(id);
    res.json({ status: "Blog data deleted successfully", deleteABlog });
  } catch (error) {
    throw new Error(error);
  }
});

//like a blog
const likeBlog = asyncHandler(async (req, res) => {
    console.log(req.body);
  const { blogId } = await req.body;
  validateMongodbId(blogId);

  //Find the blog which you want to be liked
  const blog = await Blog.findById(blogId);
  const loginUserId = req?.user?._id;
  //find if the user has like the blog
  const isLiked = blog?.isLiked;
  //find if the user has like the blog
  const alreadyDisLiked = blog?.disLikes?.find(
    (userId = userId.toString() === loginUserId.toString())
  );
  if (alreadyDisLiked) {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { dislikes: loginUserId },
        isDislike: false,
      },
      { new: true }
    );
    res.json(blog);
  }
  if (isLiked) {
    const blog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $pull: { likes: loginUserId },
          isLike: false,
        },
        { new: true }
      );
      res.json(blog);
  } else {
    const blog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $push: { likes: loginUserId },
          isLike: true,
        },
        { new: true }
      );
      res.json(blog);
  }
});

module.exports = { createBlog, updateBlog, getBlog, getAllBlog, deleteABlog, likeBlog };

const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const User = require('../models/User');
const Post = require('../models/Post'); // Import the Post model

// Create a new post
router.post('/', auth, async (req, res) => {
  try {
    console.log('📝 Creating new post...');

    const {
      content,
      media,
      privacy,
      location,
      taggedUsers,
      userId,
      userEmail,
      mediaCount,
      hasMedia
    } = req.body;

    // Validate required fields
    if (!content && (!media || media.length === 0)) {
      return res.status(400).json({
        success: false,
        message: 'Post must have content or media'
      });
    }

    // Get user information
    const user = await User.findById(req.user._id).select('firstName lastName email profilePicture');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    console.log('👤 User found:', {
      id: user._id,
      name: `${user.firstName} ${user.lastName}`
    });

    // Create post object
    const postData = {
      userId: req.user._id,
      userInfo: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        profilePicture: user.profilePicture
      },
      content: content || '',
      media: media || [],
      privacy: privacy || 'public',
      location: location || '',
      taggedUsers: taggedUsers || [],
      mediaCount: media ? media.length : 0,
      hasMedia: media ? media.length > 0 : false
    };

    console.log('💾 Creating post in database...');

    // Save post to database
    const newPost = new Post(postData);
    const savedPost = await newPost.save();

    console.log('✅ Post saved successfully:', savedPost._id);

    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      data: savedPost
    });

  } catch (error) {
    console.error('❌ Error creating post:', error);
    console.error('Error details:', error.message);
    console.error('Stack trace:', error.stack);
    
    res.status(500).json({
      success: false,
      message: 'Error creating post',
      error: error.message
    });
  }
});

// Get user's posts
router.get('/user/:userId', auth, async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const posts = await Post.getPaginatedPosts(
      { userId },
      { page: parseInt(page), limit: parseInt(limit) }
    );

    const totalPosts = await Post.countDocuments({ userId });

    res.json({
      success: true,
      data: posts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalPosts,
        pages: Math.ceil(totalPosts / limit)
      }
    });

  } catch (error) {
    console.error('❌ Error fetching user posts:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching posts',
      error: error.message
    });
  }
});

// Get feed posts
router.get('/feed', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const posts = await Post.getFeedPosts(
      req.user._id,
      { page: parseInt(page), limit: parseInt(limit) }
    );

    const totalPosts = await Post.countDocuments({ 
      privacy: { $in: ['public'] }
    });

    res.json({
      success: true,
      data: posts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalPosts,
        pages: Math.ceil(totalPosts / limit)
      }
    });

  } catch (error) {
    console.error('❌ Error fetching feed posts:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching feed',
      error: error.message
    });
  }
});

// Get single post
router.get('/:postId', auth, async (req, res) => {
  try {
    const { postId } = req.params;

    // TODO: Implement when Post model is created
    // const post = await Post.findById(postId)
    //   .populate('userId', 'firstName lastName profilePicture');

    // For now, return mock data
    const post = {
      _id: postId,
      content: 'Sample post content',
      media: [],
      createdAt: new Date()
    };

    res.json({
      success: true,
      data: post
    });

  } catch (error) {
    console.error('❌ Error fetching post:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching post',
      error: error.message
    });
  }
});

// Delete post
router.delete('/:postId', auth, async (req, res) => {
  try {
    const { postId } = req.params;

    // TODO: Implement when Post model is created
    // const post = await Post.findById(postId);
    // 
    // if (!post) {
    //   return res.status(404).json({
    //     success: false,
    //     message: 'Post not found'
    //   });
    // }
    //
    // // Check if user owns the post
    // if (post.userId.toString() !== req.user._id.toString()) {
    //   return res.status(403).json({
    //     success: false,
    //     message: 'Not authorized to delete this post'
    //   });
    // }
    //
    // await Post.findByIdAndDelete(postId);

    res.json({
      success: true,
      message: 'Post deleted successfully'
    });

  } catch (error) {
    console.error('❌ Error deleting post:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting post',
      error: error.message
    });
  }
});

// Like/Unlike post
router.post('/:postId/like', auth, async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user._id;

    // TODO: Implement when Post model is created
    // const post = await Post.findById(postId);
    // 
    // if (!post) {
    //   return res.status(404).json({
    //     success: false,
    //     message: 'Post not found'
    //   });
    // }
    //
    // const likeIndex = post.likes.indexOf(userId);
    // if (likeIndex > -1) {
    //   // Unlike
    //   post.likes.splice(likeIndex, 1);
    // } else {
    //   // Like
    //   post.likes.push(userId);
    // }
    //
    // await post.save();

    res.json({
      success: true,
      message: 'Like toggled successfully'
    });

  } catch (error) {
    console.error('❌ Error toggling like:', error);
    res.status(500).json({
      success: false,
      message: 'Error toggling like',
      error: error.message
    });
  }
});

// Add comment
router.post('/:postId/comments', auth, async (req, res) => {
  try {
    const { postId } = req.params;
    const { comment } = req.body;
    const userId = req.user._id;

    // TODO: Implement when Post model is created

    res.json({
      success: true,
      message: 'Comment added successfully'
    });

  } catch (error) {
    console.error('❌ Error adding comment:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding comment',
      error: error.message
    });
  }
});

module.exports = router;

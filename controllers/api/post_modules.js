const router = require('express').Router();
const { Post, User, Vote } = require('../../models');
const sequelize = require('../../config/connection');


router.get('/', async (req,res) => {
    try {    
        const dbPostData = await Post.findAll({
          attributes: [
            'id',
            'post_url',
            'title',
            'created_at',
            [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
          ],
            order: [['created_at','DESC']],
            include: [
                {
                    model: User,
                    attributes: ['username']
                }
            ]
        })
        res.json(dbPostData)
    }
    catch(err) {
        console.log(err)
        res.status(500).json(err)
    }
})
router.get('/:id', async (req,res) => {
    try {    
        const dbPostData = await Post.findOne({
            where: {
                id: req.params.id
            },
            attributes: [
              'id',
              'post_url',
              'title',
              'created_at',
              [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
            ],
            include: [
                {
                    model: User,
                    attributes: ['username']
                }
            ]
        })
        if (!dbPostData) {
            res.status(404).json({message: 'No post found with this id'})
            return
        }
        res.json(dbPostData)
    }
    catch(err) {
        console.log(err)
        res.status(500).json(err)
    }
})

router.post('/', async (req, res) => {
    try {
        const dbPostData = await Post.create({
        title: req.body.title,
        post_url: req.body.post_url,
        user_id: req.body.user_id
    })
    res.json(dbPostData)
    }
    catch(err) {
        console.log(err)
        res.status(500).json(err)
    }
});
router.put('/upvote', async (req,res) => {
    try {   
          const postData = await Post.upvote(req.body, {Vote})
          res.json(postData)
    }
    catch(err) {
        res.json(err)
    }
})
router.put('/:id', (req, res) => {
    Post.update(
      {
        title: req.body.title
      },
      {
        where: {
          id: req.params.id
        }
      }
    )
      .then(dbPostData => {
        if (!dbPostData) {
          res.status(404).json({ message: 'No post found with this id' });
          return;
        }
        res.json(dbPostData);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  });
  router.delete('/:id', (req, res) => {
    Post.destroy({
      where: {
        id: req.params.id
      }
    })
      .then(dbPostData => {
        if (!dbPostData) {
          res.status(404).json({ message: 'No post found with this id' });
          return;
        }
        res.json(dbPostData);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  });
module.exports = router
const router = require('express').Router()
const {User, Post, Vote} = require('../../models')
const bcrypt = require('bcrypt')

// GET /api/users
router.get('/', async (req, res) => {
    try {
        const dbUserData = await User.findAll({
          attributes: { exclude: ['password']}
        })
        res.json(dbUserData)
    }
    catch(err) {
        console.log(err)
        res.status(500).json(err)
    }
});

// GET /api/users/1
router.get('/:id', async (req, res) => {
    try {
        const dbUserData = await User.findOne({
            attributes: { exclude: ['password']},
            where: {id:req.params.id},
            include: [
              {
                model: Post,
                attributes: ['id', 'title', 'post_url', 'created_at']
              },
              {
                model: Post,
                attributes: ['title'],
                through: Vote,
                as: 'voted_posts'
              }
            ]
        })
        if (!dbUserData) {
            res.status(404).json({message: 'No user found with this id'})
            return 
        }
        res.json(dbUserData)
    }
    catch(err) {
        console.log(err)
        res.status(500).json(err)
    }
});

// POST /api/users
router.post('/', async (req, res) => {
    try {
        const dbUserData = await User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    })
    res.json(dbUserData)
    }
    catch(err) {
        console.log(err)
        res.status(500).json(err)
    }
});

// PUT /api/users/1
router.put('/:id', (req, res) => {
    // expects {username: 'Lernantino', email: 'lernantino@gmail.com', password: 'password1234'}
  
    // if req.body has exact key/value pairs to match the model, you can just use `req.body` instead
    User.update(req.body, {
      individualHooks: true,
      where: {
        id: req.params.id
      }
    })
      .then(dbUserData => {
        if (!dbUserData[0]) {
          res.status(404).json({ message: 'No user found with this id' });
          return;
        }
        res.json(dbUserData);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  });

// DELETE /api/users/1
router.delete('/:id', (req, res) => {
    User.destroy({
      where: {
        id: req.params.id
      }
    })
      .then(dbUserData => {
        if (!dbUserData) {
          res.status(404).json({ message: 'No user found with this id' });
          return;
        }
        res.json(dbUserData);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  });

  router.post("/login", async (req,res) => {
    const dbUserData = await User.findOne({
      where:{
        email: req.body.email
      }
    })
    if (!dbUserData) {
      res.status(400).json({ message: 'No user with that email address!' });
      return;
    }
    if (await dbUserData.checkPassword(req.body.password)) {
      res.json({user: dbUserData})
    }
    else {
      res.status(400).json({ message: 'Incorrect password!' });
    }
  })

module.exports = router;
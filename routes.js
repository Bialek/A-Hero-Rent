const router = require('express').Router()
const db = require('./db')

router.route('/heroes')
  .get((req, res) => res.send(db.getAllHeroes()))
  .post((req, res) => res.send(db.insertHero(req.body)))
  .delete((req, res) => res.send(db.deleteAllHeroes()))

router.route('/heroes/:hero')
  .get((req, res) => res.send(db.getHero(req.params.hero)))
  .put((req, res) => res.send(db.updateHero(req.body)))
  .delete((req, res) => res.send(db.deleteHero(req.params.hero)))

module.exports = router
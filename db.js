const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('heroes.json')
const db = require('lowdb')(adapter)

const findHero = name => db.get('heroes').find({name})
const getHero = name => findHero(name).value()
const getAllHeroes = () => db.get('heroes').value().map(({description, isAvailable, ...heroInfo} = hero) => heroInfo)

const insertHero = data => getHero(data.name) ? null : db.get('heroes')
  .push(data)
  .last()
  .write()

const deleteHero = name => db.get('heroes')
  .remove({name})
  .write()

const deleteAllHeroes = () => db.get('heroes')
  .remove()
  .write()

const updateHero = ({name, ...info} = data) => findHero(name)
  .assign({...info})
  .write()

db.defaults({ heroes: [] }).write()

module.exports = {
  getHero,
  getAllHeroes,
  insertHero,
  deleteAllHeroes,
  deleteHero,
  updateHero
}




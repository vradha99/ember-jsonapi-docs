'use strict'

let RSVP = require('rsvp')
let byType = require('./filter-jsonapi-doc').byType
let Queue = require('promise-queue')
let saveDoc = require('./save-document')

module.exports = function (document, db) {
  let things = document.data;
  let queue = new Queue(10)

  return RSVP.map(things, klass => {
    let document = {
      _id: klass.id,
      data: klass
    }

    return queue.add(() => {
      return saveDoc(document, db)
    })
  }).then(() => document)
}
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Tests = new Mongo.Collection('tests');

if (Meteor.isServer) {
  // This code only runs on the server
  // Only publish tests that are public or belong to the current user
  Meteor.publish('tests', function tasksPublication() {
    return Tests.find({});
  });
}

Meteor.methods({
  'tests.insert'(text) {
    check(text, String);

    // Make sure the user is logged in before inserting a task
    if (! this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    Tests.insert({
      text,
      createdAt: new Date(),
      owner: this.userId,
      username: Meteor.users.findOne(this.userId).username,
    });
  },
  'tests.remove'(itemId) {
    check(itemId, String);

    const task = Tests.findOne(itemId);
    if (task.private && task.owner !== this.userId) {
      // If the task is private, make sure only the owner can delete it
      throw new Meteor.Error('not-authorized');
    }

    Tests.remove(itemId);
  },
  'tests.setChecked'(itemId, setChecked) {
    check(itemId, String);
    check(setChecked, Boolean);

    const task = Tests.findOne(itemId);
    if (task.private && task.owner !== this.userId) {
      // If the task is private, make sure only the owner can check it off
      throw new Meteor.Error('not-authorized');
    }

    Tests.update(itemId, { $set: { checked: setChecked } });
  },
  'tests.setPrivate'(itemId, setToPrivate) {
    check(itemId, String);
    check(setToPrivate, Boolean);

    const task = Tests.findOne(itemId);

    // Make sure only the task owner can make a task private
    if (task.owner !== this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    Tests.update(itemId, { $set: { private: setToPrivate } });
  },
});

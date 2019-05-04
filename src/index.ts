import api from './services/api';
import stateService from './services/state';
import queueService from './services/queue';
import {
  UserService,
  ItemsService,
} from './services';

require('dotenv').config();

module.exports = class Todoist {

  // services
  public user = new UserService();
  public items = new ItemsService();
  public queue = queueService;
  public state = stateService;

  constructor(token: string) {
    api.setToken(token);
  }

  async sync(commands: object[] = null): Promise<any> {
    //
    // Sends to the server the changes that were made locally, and also
    // fetches the latest updated data from the server
    //
    return stateService.update(commands);
  }

  async commit(): Promise<any> {
    //
    // Commits all requests that are queued.  Note that, without calling this
    // method none of the changes that are made to the objects are actually
    // synchronized to the server, unless one of the aforementioned Sync API
    // calls are called directly
    //
    if (queueService.length === 0) {
      return;
    }

    await this.sync(this.queue.commands);
    console.log('Commited');
  }
};

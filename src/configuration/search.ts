import { Client } from '@elastic/elasticsearch'; // import mongo client and database types

export let search: Client;

export class Search {
  public async setup() {
    try {
      const client: any = new Client({
        cloud: {
          id: process.env.ELASTIC_ID as string
        },
        auth: {
          username: process.env.ELASTIC_USER as string,
          password: process.env.ELASTIC_PASS as string
        }
      });
      search = client; //set the mongodb client
    } catch (err) {
      throw new Error(err.message);
    }
  }
}

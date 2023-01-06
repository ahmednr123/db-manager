# DB Manager

Library to manage databases for any couch application.
Documentation can be found in notion.

## Functionality

- Provides application level schema that can be used to manage database tables.
- Provides APIs to interact with the database tables without writing MySQL code. (Basically can be used to provide UI functionality)
- Automated user defined module inclusion for table schema. (Has to be designed yet)

### NOTE

DB Manager is built on top of knex query builder. Any code solely written for db manager functionality will not and should not be used to run on production. At least not in this state where its highly unstable. The point of DB Manager is to provide internal functionality to the organization, it will only be used in development phase (when the table schema and all is not finalized) during maintanence to setup or upgrade the product.